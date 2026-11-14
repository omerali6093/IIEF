import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Language = "en" | "ur";

type SeedOption = {
  order: number;
  en: string;
  ur: string;
  score: number;
};

type SeedQuestion = {
  number: number;
  en: string;
  ur: string;
  options: SeedOption[];
};

/*
 * Add your approved questionnaire content below.
 *
 * Requirements:
 * - Exactly five questions.
 * - Both English and Urdu text for every question.
 * - Both English and Urdu text for every answer option.
 * - Matching option order between languages.
 * - Clinician-approved scoring values.
 */
const translations: SeedQuestion[] = [
  {
    number: 1,
    en: "ADD APPROVED ENGLISH QUESTION 1",
    ur: "یہاں سوال نمبر 1 کا منظور شدہ اردو ترجمہ شامل کریں",
    options: [
      {
        order: 1,
        en: "ADD APPROVED ENGLISH OPTION 1",
        ur: "یہاں منظور شدہ اردو جواب شامل کریں",
        score: 1,
      },
      // Add the remaining approved options.
    ],
  },

  {
    number: 2,
    en: "ADD APPROVED ENGLISH QUESTION 2",
    ur: "یہاں سوال نمبر 2 کا منظور شدہ اردو ترجمہ شامل کریں",
    options: [],
  },

  {
    number: 3,
    en: "ADD APPROVED ENGLISH QUESTION 3",
    ur: "یہاں سوال نمبر 3 کا منظور شدہ اردو ترجمہ شامل کریں",
    options: [],
  },

  {
    number: 4,
    en: "ADD APPROVED ENGLISH QUESTION 4",
    ur: "یہاں سوال نمبر 4 کا منظور شدہ اردو ترجمہ شامل کریں",
    options: [],
  },

  {
    number: 5,
    en: "ADD APPROVED ENGLISH QUESTION 5",
    ur: "یہاں سوال نمبر 5 کا منظور شدہ اردو ترجمہ شامل کریں",
    options: [],
  },
];

function validateTranslations(data: SeedQuestion[]) {
  if (data.length !== 5) {
    throw new Error(
      "Exactly five approved questionnaire questions are required."
    );
  }

  const questionNumbers = new Set<number>();

  for (const question of data) {
    if (
      !Number.isInteger(question.number) ||
      question.number < 1 ||
      question.number > 5
    ) {
      throw new Error(
        `Invalid question number: ${question.number}`
      );
    }

    if (questionNumbers.has(question.number)) {
      throw new Error(
        `Duplicate question number: ${question.number}`
      );
    }

    questionNumbers.add(question.number);

    if (
      !question.en.trim() ||
      !question.ur.trim() ||
      question.en.startsWith("ADD APPROVED") ||
      question.ur.includes("یہاں سوال نمبر")
    ) {
      throw new Error(
        `Approved English and Urdu text is missing for question ${question.number}.`
      );
    }

    if (!question.options.length) {
      throw new Error(
        `No answer options provided for question ${question.number}.`
      );
    }

    const optionOrders = new Set<number>();

    for (const option of question.options) {
      if (
        !Number.isInteger(option.order) ||
        option.order < 1 ||
        optionOrders.has(option.order)
      ) {
        throw new Error(
          `Invalid or duplicate option order in question ${question.number}.`
        );
      }

      optionOrders.add(option.order);

      if (
        !option.en.trim() ||
        !option.ur.trim() ||
        !Number.isInteger(option.score)
      ) {
        throw new Error(
          `Incomplete option text or score in question ${question.number}, option ${option.order}.`
        );
      }

      if (
        option.en.startsWith("ADD APPROVED") ||
        option.ur.includes("یہاں منظور شدہ")
      ) {
        throw new Error(
          `Replace placeholder option text in question ${question.number}, option ${option.order}.`
        );
      }
    }
  }

  for (let number = 1; number <= 5; number++) {
    if (!questionNumbers.has(number)) {
      throw new Error(
        `Question ${number} is missing from the seed data.`
      );
    }
  }
}

// async function seedLanguage(language: Language) {
//   const questionnaire = await prisma.questionnaire.upsert({
//     where: {
//       code_version_language: {
//         code: "IIEF5",
//         version: "1.0",
//         language,
//       },
//     },

//     update: {
//       name: "IIEF-5 / SHIM",
//     },

//     create: {
//       code: "IIEF5",
//       name: "IIEF-5 / SHIM",
//       version: "1.0",
//       language,
//       isActive: true,
//     },
//   });

//   const existingQuestions = await prisma.question.count({
//     where: {
//       questionnaireId: questionnaire.id,
//     },
//   });

//   // Never overwrite an existing version that may already be in use.
//   if (existingQuestions > 0) {
//     if (existingQuestions !== 5) {
//       throw new Error(
//         `The existing ${language} questionnaire has ${existingQuestions} questions. Resolve this incomplete version manually rather than overwriting it.`
//       );
//     }

//     console.log(
//       `${language.toUpperCase()} questionnaire already exists. Skipping.`
//     );

//     return;
//   }

//   for (const item of translations) {
//     const questionText = item[language];

//     const question = await prisma.question.create({
//       data: {
//         questionnaireId: questionnaire.id,
//         questionNumber: item.number,
//         questionText,
//       },
//     });

//     await prisma.answerOption.createMany({
//       data: item.options.map((option) => ({
//         questionId: question.id,
//         optionText: option[language],
//         scoreValue: option.score,
//         optionOrder: option.order,
//       })),
//     });
//   }

//   console.log(
//     `${language.toUpperCase()} questionnaire seeded successfully.`
//   );
// }

async function seedLanguage(
  client: Prisma.TransactionClient,
  language: Language
) {
  const questionnaire = await client.questionnaire.upsert({
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

  const existingQuestions = await client.question.count({
    where: {
      questionnaireId: questionnaire.id,
    },
  });

  if (existingQuestions > 0) {
    if (existingQuestions !== 5) {
      throw new Error(
        `The existing ${language} questionnaire has ${existingQuestions} questions. Resolve it manually.`
      );
    }

    console.log(
      `${language.toUpperCase()} questionnaire already exists. Skipping.`
    );

    return;
  }

  for (const item of translations) {
    const question = await client.question.create({
      data: {
        questionnaireId: questionnaire.id,
        questionNumber: item.number,
        questionText: item[language],
      },
    });

    await client.answerOption.createMany({
      data: item.options.map((option) => ({
        questionId: question.id,
        optionText: option[language],
        scoreValue: option.score,
        optionOrder: option.order,
      })),
    });
  }

  console.log(
    `${language.toUpperCase()} questionnaire seeded successfully.`
  );
}

async function main() {
  if (translations.length !== 5) {
    throw new Error(
      "Exactly five approved questions are required."
    );
  }

  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
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
    }
  );

  console.log("Questionnaire seed completed.");
}
main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });