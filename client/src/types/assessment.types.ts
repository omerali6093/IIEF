export type AssessmentResult = {
  assessmentId: string;
  interpretation: string;
  completedAt: string;
  isDemo?: boolean;
};

export type SubmitAnswersPayload = {
  answers: {
    questionId: string;
    answerOptionId: string;
  }[];
};