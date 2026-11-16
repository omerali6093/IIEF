
export type ScoreBand = {
  min: number;
  max: number;
  interpretation: string;
};

// Provisional ranges: obtain clinical approval before production use.
const SCORE_BANDS: ScoreBand[] = [
  { min: 22, max: 25, interpretation: "No significant ED" },
  { min: 17, max: 21, interpretation: "Mild" },
  { min: 12, max: 16, interpretation: "Mild-to-moderate" },
  { min: 8, max: 11, interpretation: "Moderate" },
  { min: 5, max: 7, interpretation: "Severe" },
];

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

export function getInterpretation(totalScore: number): string {
  const band = SCORE_BANDS.find(
    (item) =>
      totalScore >= item.min && totalScore <= item.max
  );

  if (!band) {
    throw new Error("SCORE_RANGE_NOT_FOUND");
  }

  return band.interpretation;
}
