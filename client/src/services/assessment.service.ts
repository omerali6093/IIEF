import { USE_MOCK } from "@/lib/constants";

import type {
  AssessmentResult,
  SubmitAnswersPayload,
} from "@/types/assessment.types";

import type { PatientDetails } from "@/types/patient.types";

import { api } from "./api";

type AssessmentResponse = {
  success: boolean;
  message: string;
  data: AssessmentResult;
};

export async function submitAssessment(
  patient: PatientDetails,
  payload: SubmitAnswersPayload
): Promise<AssessmentResult> {
  if (USE_MOCK) {
    throw new Error(
      "Mock mode is enabled. Disable it to submit a real assessment."
    );
  }

  const response = await api<AssessmentResponse>(
    "/assessments",
    {
      method: "POST",
      body: JSON.stringify({
        patient,
        answers: payload.answers,
      }),
    }
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Unable to submit assessment."
    );
  }

  return response.data;
}