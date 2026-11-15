
import type { Request, Response } from "express";
import prisma from "../config/db.js";

type SubmitBody = {
  patient?: {
    fullName?: string;
    age?: number;
    ageGroup?: string;
    bloodPressure?: string;
    weightRange?: string;
    contactNumber?: string;
    consent?: boolean;
  };
  answers?: {
    questionId: string;
    answerOptionId: string;
  }[];
};

export async function submitAssessment(
  req: Request,
  res: Response
) {
  try {
    const body = req.body as SubmitBody;
    const patient = body.patient;
    const answers = body.answers;

    // Validate patient details
    if (
      !patient ||
      typeof patient.fullName !== "string" ||
      !patient.fullName.trim() ||
      !Number.isInteger(patient.age) ||
      patient.age! < 18 ||
      patient.consent !== true
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid patient details, adult age eligibility, and consent are required.",
      });
    }

    // Exactly five answers are required
    if (!Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Exactly five answers are required.",
      });
    }

    const questionIds = answers.map((answer) => answer.questionId);

    if (
      answers.some(
        (answer) =>
          !answer.questionId ||
          !answer.answerOptionId
      ) ||
      new Set(questionIds).size !== 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Answers are incomplete or contain duplicate questions.",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Use the English questionnaire as the canonical ID source.
      const questionnaire = await tx.questionnaire.findFirst({
        where: {
          code: "IIEF5",
          language: "en",
          isActive: true,
        },
        include: {
          questions: {
            orderBy: {
              questionNumber: "asc",
            },
            include: {
              options: true,
            },
          },
        },
      });

      if (!questionnaire || questionnaire.questions.length !== 5) {
        throw new Error("ACTIVE_QUESTIONNAIRE_NOT_FOUND");
      }

      const expectedQuestionIds = new Set(
        questionnaire.questions.map((question) => question.id)
      );

      if (
        answers.some(
          (answer) => !expectedQuestionIds.has(answer.questionId)
        )
      ) {
        throw new Error("INVALID_QUESTION");
      }

      // Validate each selected option and calculate the score on the server.
      const savedAnswers = answers.map((answer) => {
        const question = questionnaire.questions.find(
          (item) => item.id === answer.questionId
        );

        const option = question?.options.find(
          (item) => item.id === answer.answerOptionId
        );

        if (!question || !option) {
          throw new Error("INVALID_ANSWER_OPTION");
        }

        return {
          questionId: question.id,
          answerOptionId: option.id,
          scoreValue: option.scoreValue,
        };
      });

      const totalScore = savedAnswers.reduce(
        (sum, answer) => sum + answer.scoreValue,
        0
      );

      // Save patient and assessment together.
      const savedPatient = await tx.patient.create({
        data: {
          fullName: patient.fullName.trim(),
          age: patient.age!,
          ageGroup: patient.ageGroup || null,
          bloodPressure: patient.bloodPressure || null,
          weightRange: patient.weightRange || null,
          contactNumber: patient.contactNumber || null,
          consent: true,
        },
      });

      const assessment = await tx.assessment.create({
        data: {
          patientId: savedPatient.id,
          questionnaireId: questionnaire.id,
          totalScore,
          status: "COMPLETED",
          answers: {
            create: savedAnswers,
          },
        },
      });

      return {
        id: assessment.id,
        patientName: savedPatient.fullName,
        completedAt: assessment.completedAt,
      };
    });

    // Do not return totalScore or individual score values to the patient.
    return res.status(201).json({
      success: true,
      message: "Assessment completed successfully.",
      data: {
        assessmentId: result.id,
        patientName: result.patientName,
        completedAt: result.completedAt.toISOString(),
        reportAvailable: true,
      },
    });
  } catch (error) {
    console.error("Assessment submission failed:", error);

    if (error instanceof Error) {
      const messages: Record<string, string> = {
        ACTIVE_QUESTIONNAIRE_NOT_FOUND:
          "The active questionnaire could not be found.",
        INVALID_QUESTION:
          "One or more submitted questions do not belong to the active questionnaire.",
        INVALID_ANSWER_OPTION:
          "One or more selected options are invalid for their questions.",
      };

      if (messages[error.message]) {
        return res.status(400).json({
          success: false,
          message: messages[error.message],
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save the assessment. Please try again.",
    });
  }
}
