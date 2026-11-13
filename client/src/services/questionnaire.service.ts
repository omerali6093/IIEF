import { USE_MOCK } from "@/lib/constants";
import { mockQuestionnaire } from "@/lib/mock-questionnaire";
import type { Questionnaire } from "@/types/questionnaire.types";
import { api } from "./api";
export async function getActiveQuestionnaire(): Promise<Questionnaire> {
  if (USE_MOCK) return mockQuestionnaire;
  return api<Questionnaire>("/questionnaires/active");
}
