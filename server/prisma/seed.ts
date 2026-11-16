
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

/**
 * Add your authorized, clinician-approved questionnaire content here.
 *
 * Requirements:
 * - Exactly five questions.
 * - English and Urdu translations for every question.
 * - English and Urdu translations for every answer option.
 * - Matching option orders between both languages.
 * - Clinician-approved scoring values.
 */
const translations: SeedQuestion[] = [
  {
    number: 1,
    en: "How do you rate your confidence that you could get and keep an erection?",
    ur: "۔ عضِو پناسل میں پناو پندا ک رنے اور اسے پ ر ق رار ر ک ھن ے ک ی ا پنی صلا حیت پ ر اپ کو کتنا اعت ماد ہے؟",
    options: [
      {
        order: 1,
        en: "Very low",
        ur: "نہب ک م",
        score: 1,
      },
      {
        order: 2,
        en: "Low",
        ur: " ک م",
        score: 2,
      },
      {
        order: 3,
        en: "Moderate",
        ur: "درمیانہ",
        score: 3,
      },
      {
        order: 4,
        en: "High",
        ur: "رتادہ",
        score: 4,
      },
      {
        order: 5,
        en: "Very high",
        ur: "نہب رتادہ",
        score: 5,
      },

    ],
  },
  {
    number: 2,
    en: "When you had erections with sexual stimulation, how often were your erections hard enough for penetration?",
    ur: " جنسی ا ت ھار کے دوران حت اپ کا عضِو پناسل ک ھڑا ہوا، تو کتنی بار وہ اپنا سخت ت ھا کہ دخِول ہو سکے؟",
    options: [
      {
        order: 1,
        en: "Almost never/never",
        ur: "حند تار",
        score: 1,
      },
      {
        order: 2,
        en: "A few times (much less than half the time)",
        ur: "حند تار",
        score: 2,
      },
      {
        order: 3,
        en: "Sometimes (about half the time)",
        ur: "کب ھی کب ھار",
        score: 3,
      },
      {
        order: 4,
        en: "Most times (much more than half the time)",
        ur: "اکیر اوقاب",
        score: 4,
      },
      {
        order: 5,
        en: "Almost always/always",
        ur: "تقرپیا ہمیشہ تا ہمیشہ",
        score: 5,
      },
    ],
  },

  {
    number: 3,
    en: " During sexual intercourse, how often were you able to maintain your erection after you had penetrated (entered) your partner? ",
    ur: "ہمبستری کے دوران، دخِول کے بعد اپ کتنی بار عضِو پناسل کا پناو پ ر ق رار رکھ سکے؟",
    options: [
      {
        order: 1,
        en: "Almost never/never",
        ur: "حند تار",
        score: 1,
      },
      {
        order: 2,
        en: "A few times (much less than half the time)",
        ur: "حند تار",
        score: 2,
      },
      {
        order: 3,
        en: "Sometimes (about half the time)",
        ur: "کب ھی کب ھار",
        score: 3,
      },
      {
        order: 4,
        en: "Most times (much more than half the time)",
        ur: "اکیر اوقاب",
        score: 4,
      },
      {
        order: 5,
        en: "Almost always/always",
        ur: "تقرپیا ہمیشہ تا ہمیشہ",
        score: 5,
      },
    ],
  },
  {
    number: 4,
    en: " During sexual intercourse, how difficult was it to maintain your erection to completion of intercourse?",
    ur: "ہمبستری کے دوران، عمل مک مل ہونے تک عضِو پناسل کا پناو پ ر ق رار ر ک ھنا اپ کے لن ے کتنا مشکل ت ھا؟",
    options: [
      {
        order: 1,
        en: "Extremely difficult",
        ur: "اپتہا ئ ی مشکل",
        score: 1,
      },
      {
        order: 2,
        en: "Very difficult",
        ur: "ہب مشکل",
        score: 2,
      },
      {
        order: 3,
        en: "Difficult",
        ur: "مشکل",
        score: 3,
      },
      {
        order: 4,
        en: "Slightly difficult ",
        ur: "قدرے مشکل",
        score: 4,
      },
      {
        order: 5,
        en: "Not difficult",
        ur: "تالکل مشکل نہیں",
        score: 5,
      },
    ],
  },
  {
    number: 5,
    en: " When you attempted sexual intercourse, how often was it satisfactory for you?",
    ur: " حت اپ نے ہمبستری ک ی کوشش ک ی، تو کتنی بار یہ اپ کے لن ے ا طمتنان ب خش رہی؟",
    options: [
      {
        order: 1,
        en: "Almost never/never",
        ur: "حند تار",
        score: 1,
      },
      {
        order: 2,
        en: "A few times (much less than half the time)",
        ur: "حند تار",
        score: 2,
      },
      {
        order: 3,
        en: "Sometimes (about half the time)",
        ur: "کب ھی کب ھار",
        score: 3,
      },
      {
        order: 4,
        en: "Most times (much more than half the time)",
        ur: "اکیر اوقاب",
        score: 4,
      },
      {
        order: 5,
        en: "Almost always/always",
        ur: "تقرپیا ہمیشہ تا ہمیشہ",
        score: 5,
      },
    ],
  },
];

function validateTranslations(data: SeedQuestion[]) {
  if (data.length !== 5) {
    throw new Error("Exactly five questions are required.");
  }

  const questionNumbers = new Set<number>();

  for (const question of data) {
    if (
      !Number.isInteger(question.number) ||
      question.number < 1 ||
      question.number > 5
    ) {
      throw new Error(`Invalid question number: ${question.number}`);
    }

    if (questionNumbers.has(question.number)) {
      throw new Error(`Duplicate question number: ${question.number}`);
    }

    questionNumbers.add(question.number);

    if (
      !question.en.trim() ||
      !question.ur.trim() ||
      question.en.startsWith("REPLACE_WITH") ||
      question.ur.startsWith("REPLACE_WITH")
    ) {
      throw new Error(
        `Missing approved translation for question ${question.number}.`
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
        option.en.startsWith("REPLACE_WITH") ||
        option.ur.startsWith("REPLACE_WITH")
      ) {
        throw new Error(
          `Missing approved answer translation in question ${question.number}, option ${option.order}.`
        );
      }

      if (!Number.isInteger(option.score)) {
        throw new Error(
          `Invalid score in question ${question.number}, option ${option.order}.`
        );
      }
    }
  }

  for (let number = 1; number <= 5; number++) {
    if (!questionNumbers.has(number)) {
      throw new Error(`Question ${number} is missing.`);
    }
  }
}

/**
 * Checks whether an existing questionnaire is complete.
 * Existing questionnaire content is never overwritten.
 */

async function validateExistingQuestionnaire(
  tx: Prisma.TransactionClient,
  questionnaireId: string,
  language: Language
) {
  for (const item of translations) {
    // Find or create the question
    const question = await tx.question.upsert({
      where: {
        questionnaireId_questionNumber: {
          questionnaireId,
          questionNumber: item.number,
        },
      },
      update: {
        questionText: item[language],
      },
      create: {
        questionnaireId,
        questionNumber: item.number,
        questionText: item[language],
      },
    });

    // Find or create each expected option
    for (const option of item.options) {
      await tx.answerOption.upsert({
        where: {
          questionId_optionOrder: {
            questionId: question.id,
            optionOrder: option.order,
          },
        },
        update: {
          optionText: option[language],
          scoreValue: option.score,
        },
        create: {
          questionId: question.id,
          optionText: option[language],
          scoreValue: option.score,
          optionOrder: option.order,
        },
      });
    }

    // Check for unexpected extra options
    const existingOptions = await tx.answerOption.findMany({
      where: {
        questionId: question.id,
      },
      select: {
        optionOrder: true,
      },
    });

    const expectedOrders = new Set(
      item.options.map((option) => option.order)
    );

    const extraOptions = existingOptions.filter(
      (option) => !expectedOrders.has(option.optionOrder)
    );

    if (extraOptions.length > 0) {
      throw new Error(
        `Unexpected extra options in ${language} question ${item.number}: ${extraOptions.map(o => o.optionOrder).join(", ")}. Check existing assessment references before removing them.`
      );
    }
  }

  console.log(
    `${language.toUpperCase()} questionnaire synchronized successfully.`
  );
}


async function seedLanguage(
  tx: Prisma.TransactionClient,
  language: Language
) {
  const questionnaire = await tx.questionnaire.upsert({
    where: {
      code_version_language: {
        code: "IIEF5",
        version: "1.0",
        language,
      },
    },

    update: {},

    create: {
      code: "IIEF5",
      name: "IIEF-5",
      version: "1.0",
      language,
      isActive: true,
    },
  });

  const existingQuestions = await tx.question.count({
    where: {
      questionnaireId: questionnaire.id,
    },
  });

  if (existingQuestions > 0) {
    await validateExistingQuestionnaire(
      tx,
      questionnaire.id,
      language
    );

    return;
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

  console.log(
    `${language.toUpperCase()} questionnaire created successfully.`
  );
}

async function main() {
  // Stop before touching the database if the content is incomplete.
  validateTranslations(translations);

  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      await seedLanguage(tx, "en");
      await seedLanguage(tx, "ur");
    },
    {
      maxWait: 10000,
      timeout: 30000,
    }
  );

  console.log("Questionnaire seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Questionnaire seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
