
import type { Request, Response } from "express";
import prisma from "../config/db";

export async function getActiveQuestionnaire(
  _req: Request,
  res: Response
) {
  try {
    const versions = await prisma.questionnaire.findMany({
      where: {
        code: "IIEF5",
        isActive: true,
        language: { in: ["en", "ur"] },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        questions: {
          orderBy: { questionNumber: "asc" },
          include: {
            options: {
              orderBy: { optionOrder: "asc" },
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

    const english = versions.find((v) => v.language === "en");
    const urdu = versions.find((v) => v.language === "ur");

    if (!english || !urdu || english.version !== urdu.version) {
      return res.status(404).json({
        success: false,
        message: "Complete English and Urdu questionnaire versions were not found.",
      });
    }

    if (
      english.questions.length !== 5 ||
      urdu.questions.length !== 5
    ) {
      return res.status(503).json({
        success: false,
        message: "Questionnaire must contain exactly five questions.",
      });
    }

    const questions = english.questions.map((enQuestion) => {
      const urQuestion = urdu.questions.find(
        (q) => q.questionNumber === enQuestion.questionNumber
      );

      if (!urQuestion) {
        throw new Error("Question translation is missing.");
      }

      const options = enQuestion.options.map((enOption) => {
        const urOption = urQuestion.options.find(
          (o) => o.optionOrder === enOption.optionOrder
        );

        if (!urOption) {
          throw new Error("Answer option translation is missing.");
        }

        return {
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
