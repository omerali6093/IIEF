export type AssessmentResult = {
  assessmentId: string; patientName: string; completedAt: string;
  totalScore: number; interpretation: string; isDemo?: boolean;
};
export type SubmitAnswersPayload = { answers: { questionId: string; answerOptionId: string }[] };
