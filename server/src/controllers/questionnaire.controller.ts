
import type { Request, Response } from "express";
import prisma from "../config/db.js";

export async function getActiveQuestionnaire(
  _req: Request,
  res: Response
) {
  try {
    const versions = await prisma.questionnaire.findMany({
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

    const englishVersions = versions.filter(
      (item) => item.language === "en"
    );

    const matchingPair = englishVersions.find((english) => {
      const urdu = versions.find(
        (item) =>
          item.language === "ur" &&
          item.version === english.version
      );

      return Boolean(urdu);
    });

    if (!matchingPair) {
      return res.status(404).json({
        success: false,
        message:
          "Matching English and Urdu questionnaire versions were not found.",
      });
    }

    const english = matchingPair;

    const urdu = versions.find(
      (item) =>
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

    const questions = english.questions.map((enQuestion) => {
      const urQuestion = urdu.questions.find(
        (question) =>
          question.questionNumber === enQuestion.questionNumber
      );

      if (!urQuestion) {
        throw new Error(
          `Missing Urdu translation for question ${enQuestion.questionNumber}.`
        );
      }

      if (
        enQuestion.options.length === 0 ||
        enQuestion.options.length !== urQuestion.options.length
      ) {
        throw new Error(
          `Answer option count mismatch in question ${enQuestion.questionNumber}.`
        );
      }

      const options = enQuestion.options.map((enOption) => {
        const urOption = urQuestion.options.find(
          (option) =>
            option.optionOrder === enOption.optionOrder
        );

        if (!urOption) {
          throw new Error(
            `Missing Urdu translation for question ${enQuestion.questionNumber}, option ${enOption.optionOrder}.`
          );
        }

        return {
          // Canonical English option ID for both languages.
          id: enOption.id,

          text: {
            en: enOption.optionText,
            ur: urOption.optionText,
          },
        };
      });

      return {
        id: enQuestion.id,

        number: enQuestion.questionNumber,

        text: {
          en: enQuestion.questionText,
          ur: urQuestion.questionText,
        },

        options,
      };
    });

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
