import { USE_MOCK } from "@/lib/constants";
import type { AssessmentResult, SubmitAnswersPayload } from "@/types/assessment.types";
import type { PatientDetails } from "@/types/patient.types";
import { api } from "./api";

// The browser only sends selected option IDs. The SERVER scores them.
export async function submitAssessment(patient: PatientDetails, payload: SubmitAnswersPayload): Promise<AssessmentResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    // DEMO ONLY: fixed placeholder values, deliberately NOT computed from the answers.
    return { assessmentId: "demo", patientName: patient.fullName, completedAt: new Date().toISOString(),
      totalScore: 0, interpretation: "Demo result — pending server-side scoring", isDemo: true };
  }
  const created = await api<{ id: string }>("/assessments", { method: "POST", body: JSON.stringify({ patient }) });
  await api(`/assessments/${created.id}/answers`, { method: "POST", body: JSON.stringify(payload) });
  await api(`/assessments/${created.id}/complete`, { method: "POST" });
  return api<AssessmentResult>(`/assessments/${created.id}/result`);
}
