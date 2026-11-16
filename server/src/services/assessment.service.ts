
export type Language = "en" | "ur";

type ScoreBand = {
  min: number;
  max: number;
  interpretation: Record<Language, string>;
};

// These interpretation labels are provisional.
// Get the score bands and Urdu wording approved by the
// client's qualified clinical reviewer before production.
const SCORE_BANDS: ScoreBand[] = [
  {
    min: 22,
    max: 25,
    interpretation: {
      en: "No erectile dysfunction ",
      ur: "عضو پیاسل میں پیاو ک ی صلا حیب مع مول کے مطا نق ہے",
    },
  },
  {
    min: 17,
    max: 21,
    interpretation: {
      en: " Mild erectile dysfunction ",
      ur: "عضو پیاسل کے پیاو میں ہلک ی کمروری",
    },
  },
  {
    min: 12,
    max: 16,
    interpretation: {
      en: "Mild to moderate erectile dysfunction ",
      ur: "عضو پیاسل کے پیاو میں ہلک ی سے درمیا ئ ی درجے ک ی کمروری",
    },
  },
  {
    min: 8,
    max: 11,
    interpretation: {
      en: " Moderate erectile dysfunction",
      ur: "عضو پیاسل کے پیاو میں درمیا ئ ی درجے ک ی کمروری",
    },
  },
  {
    min: 5,
    max: 7,
    interpretation: {
      en: "Severe erectile dysfunction",
      ur: "عضو پیاسل کے پیاو میں سدتد کمروری",
    },
  },
];

export function isSupportedLanguage(
  language: unknown
): language is Language {
  return language === "en" || language === "ur";
}

export function calculateTotalScore(scores: number[]): number {
  if (scores.length !== 5) {
    throw new Error("EXACTLY_FIVE_SCORES_REQUIRED");
  }

  if (
    scores.some(
      (score) =>
        !Number.isInteger(score) || score < 1 || score > 5
    )
  ) {
    throw new Error("INVALID_SCORE_VALUE");
  }

  return scores.reduce((total, score) => total + score, 0);
}

export function getInterpretation(
  totalScore: number,
  language: Language
): string {
  const band = SCORE_BANDS.find(
    (item) =>
      totalScore >= item.min && totalScore <= item.max
  );

  if (!band) {
    throw new Error("SCORE_RANGE_NOT_FOUND");
  }

  return band.interpretation[language];
}
