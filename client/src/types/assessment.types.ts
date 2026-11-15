
export type AssessmentResult = {
  assessmentId: string;
  patientName: string;
  completedAt: string;
  reportAvailable: boolean;
  isDemo?: boolean;
};

export type SubmitAnswersPayload = {
  answers: {
    questionId: string;
    answerOptionId: string;
  }[];
};
