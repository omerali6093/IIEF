
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const translations = [
  {
    number: 1,
    en: "INSERT CLINICIAN-APPROVED ENGLISH QUESTION 1",
    ur: "INSERT AUTHORIZED URDU TRANSLATION OF QUESTION 1",
    options: [
      {
        order: 1,
        en: "Approved English answer option 1",
        ur: "منظور شدہ اردو جواب 1",
        score: 1,
      },
      // Add the remaining approved options.
    ],
  },

  // Add questions 2, 3, 4 and 5 using the same structure.
];

async function main() {
  if (translations.length !== 5) {
    throw new Error("Exactly five approved questions are required.");
  }

  await prisma.$transaction(async (tx) => {
    for (const language of ["en", "ur"] as const) {
      const questionnaire = await tx.questionnaire.upsert({
        where: {
          code_version_language: {
            code: "IIEF5",
            version: "1.0",
            language,
          },
        },
        update: {
          name: "IIEF-5 / SHIM",
          isActive: true,
        },
        create: {
          code: "IIEF5",
          name: "IIEF-5 / SHIM",
          version: "1.0",
          language,
          isActive: true,
        },
      });

      // Do not overwrite an existing version used by assessments.
      const existing = await tx.question.count({
        where: {
          questionnaireId: questionnaire.id,
        },
      });

      if (existing > 0) {
        console.log(
          `${language} version already contains questions. Skipping.`
        );
        continue;
      }

      for (const item of translations) {
        const question = await tx.question.create({
          data: {
            questionnaireId: questionnaire.id,
            questionNumber: item.number,
            questionText: item[language],
          },
        });

        await tx.answerOption.createMany({
          data: item.options.map((option) => ({
            questionId: question.id,
            optionText: option[language],
            scoreValue: option.score,
            optionOrder: option.order,
          })),
        });
      }
    }
  });

  console.log("Questionnaire seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
