
import { API_URL } from "@/lib/constants";

export async function getAssessmentPdf(
  assessmentId: string,
  token: string
): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/reports/${encodeURIComponent(assessmentId)}/pdf`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Unable to generate assessment PDF."
    );
  }

  return response.blob();
}
