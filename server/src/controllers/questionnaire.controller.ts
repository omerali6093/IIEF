
import type { Request, Response } from "express";
import prisma from "../config/db.js";

type QuestionnaireOption = {
  id: string;
  optionText: string;
  optionOrder: number;
};

type QuestionnaireQuestion = {
  id: string;
  questionNumber: number;
  questionText: string;
  options: QuestionnaireOption[];
};

type QuestionnaireVersion = {
  id: string;
  name: string;
  version: string;
  language: string;
  questions: QuestionnaireQuestion[];
};

export async function getActiveQuestionnaire(
  _req: Request,
  res: Response
) {
  try {
    const versions: QuestionnaireVersion[] =
      await prisma.questionnaire.findMany({
        where: {
          code: "IIEF5",
          isActive: true,
          language: {
            in: ["en", "ur"],
          },
        },
        include: {
          questions: {
            orderBy: {
              questionNumber: "asc",
            },
            include: {
              options: {
                orderBy: {
                  optionOrder: "asc",
                },
                select: {
                  id: true,
                  optionText: true,
                  optionOrder: true,
                },
              },
            },
          },
        },
      });

    // Find matching English and Urdu versions.
    const english = versions.find(
      (item: QuestionnaireVersion) =>
        item.language === "en" &&
        versions.some(
          (other: QuestionnaireVersion) =>
            other.language === "ur" &&
            other.version === item.version
        )
    );

    if (!english) {
      return res.status(404).json({
        success: false,
        message:
          "Matching English and Urdu questionnaire versions were not found.",
      });
    }

    const urdu = versions.find(
      (item: QuestionnaireVersion) =>
        item.language === "ur" &&
        item.version === english.version
    );

    if (!urdu) {
      return res.status(404).json({
        success: false,
        message: "Urdu questionnaire translation was not found.",
      });
    }

    if (
      english.questions.length !== 5 ||
      urdu.questions.length !== 5
    ) {
      return res.status(503).json({
        success: false,
        message:
          "Questionnaire must contain exactly five questions in both languages.",
      });
    }

    const questions = english.questions.map(
      (enQuestion: QuestionnaireQuestion) => {
        const urQuestion = urdu.questions.find(
          (question: QuestionnaireQuestion) =>
            question.questionNumber ===
            enQuestion.questionNumber
        );

        if (!urQuestion) {
          throw new Error(
            `Missing Urdu translation for question ${enQuestion.questionNumber}.`
          );
        }

        const options = enQuestion.options.map(
          (enOption: QuestionnaireOption) => {
            const urOption = urQuestion.options.find(
              (option: QuestionnaireOption) =>
                option.optionOrder === enOption.optionOrder
            );

            if (!urOption) {
              throw new Error(
                `Missing Urdu translation for option ${enOption.optionOrder}.`
              );
            }

            return {
              id: enOption.id,
              text: {
                en: enOption.optionText,
                ur: urOption.optionText,
              },
            };
          }
        );

        return {
          id: enQuestion.id,
          number: enQuestion.questionNumber,
          text: {
            en: enQuestion.questionText,
            ur: urQuestion.questionText,
          },
          options,
        };
      }
    );

    return res.status(200).json({
      success: true,
      data: {
        id: english.id,
        name: english.name,
        version: english.version,
        questions,
      },
    });
  } catch (error) {
    console.error("Questionnaire fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch questionnaire.",
    });
  }
}
