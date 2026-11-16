
export type AssessmentResult = {
  assessmentId: string;
  interpretation: string;
  completedAt: string;
  language: "en" | "ur";

  // Returned once after successful submission.
  reportAccessToken: string;
  reportAccessExpiresAt: string;

  isDemo?: boolean;
};

export type SubmitAnswersPayload = {
  answers: {
    questionId: string;
    answerOptionId: string;
  }[];
};

export type PdfReportData = {
  assessment: {
    id: string;
    completedAt: string;
    status: string;
    totalScore: number;
    interpretation: string;
  };

  questionnaire: {
    name: string;
    code: string;
    version: string;
    language: string;
  };

  patient: {
    contactNumber: string | null;
    ageGroup: string;
    maritalStatus: string;
    tobaccoUse: string;
    conditions: string[];
    consent: boolean;
  };

  answers: {
    questionNumber: number;
    question: string;
    selectedAnswer: string;
    score: number;
  }[];
};

export type WhatsappReportData = {
  questionnaire: {
    name: string;
    language: string;
  };

  answers: {
    questionNumber: number;
    question: string;
    selectedAnswer: string;
    score: number;
  }[];

  totalScore: number;
};
