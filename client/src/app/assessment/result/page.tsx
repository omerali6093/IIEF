"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ScoreCard from "@/components/result/ScoreCard";
import ResultSummary from "@/components/result/ResultSummary";
import ReportActions from "@/components/result/ReportActions";
import { useLanguage } from "@/hooks/useLanguage";
import { session } from "@/lib/session";
import type { AssessmentResult } from "@/types/assessment.types";

export default function ResultPage() {
  const { t } = useLanguage();
  const [result, setResult] = useState<AssessmentResult | null | undefined>(undefined);
  useEffect(() => setResult(session.get<AssessmentResult>("result")), []);
  if (result === undefined) return null;
  if (!result) return (
    <div className="card mx-auto max-w-md p-8 text-center"><p>{t("result.empty")}</p>
      <Link href="/" className="btn-primary mt-5">{t("result.again")}</Link></div>
  );
  return (
    <div className="rise mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("result.title")}</h1>
      {result.isDemo && <p className="rounded-field bg-amber-50 px-4 py-2.5 text-xs text-amber-800">{t("result.demoBanner")}</p>}
      <ResultSummary result={result} />
      <ScoreCard score={result.totalScore} interpretation={result.interpretation} />
      <ReportActions assessmentId={result.assessmentId} />
      <p className="text-xs leading-relaxed text-muted">{t("result.disclaimer")}</p>
      <Link href="/" onClick={() => session.clear()} className="btn-ghost w-full">{t("result.again")}</Link>
    </div>
  );
}
