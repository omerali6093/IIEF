
export type AssessmentResult = {
  assessmentId: string;
  completedAt: string;
  isDemo?: boolean;
};

export type SubmitAnswersPayload = {
  answers: {
    questionId: string;
    answerOptionId: string;
  }[];
};
