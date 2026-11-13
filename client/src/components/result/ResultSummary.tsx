"use client";
import { useLanguage } from "@/hooks/useLanguage";
import type { AssessmentResult } from "@/types/assessment.types";
export default function ResultSummary({ result }: { result: AssessmentResult }) {
  const { t, lang } = useLanguage();
  const date = new Date(result.completedAt).toLocaleDateString(lang === "ur" ? "ur-PK" : "en-GB", { dateStyle: "long" });
  return (
    <dl className="grid grid-cols-2 gap-4 rounded-card border border-line bg-white p-5 text-sm">
      <div><dt className="text-muted">{t("result.name")}</dt><dd className="mt-0.5 font-semibold text-secondary">{result.patientName}</dd></div>
      <div><dt className="text-muted">{t("result.date")}</dt><dd className="mt-0.5 font-semibold text-secondary">{date}</dd></div>
    </dl>
  );
}
