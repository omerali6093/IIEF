import { USE_MOCK } from "@/lib/constants";
import { mockQuestionnaire } from "@/lib/mock-questionnaire";

import type { Questionnaire } from "@/types/questionnaire.types";

import { api } from "./api";

type QuestionnaireResponse = {
  success: boolean;
  message?: string;
  data: Questionnaire;
};

export async function getActiveQuestionnaire(): Promise<Questionnaire> {
  if (USE_MOCK) {
    return mockQuestionnaire;
  }

  const response = await api<QuestionnaireResponse>(
    "/questionnaires/active"
  );

  if (!response.success || !response.data) {
    throw new Error(
      response.message || "Unable to load questionnaire."
    );
  }

  return response.data;
}