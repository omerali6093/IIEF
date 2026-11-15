
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ResultSummary from "@/components/result/ResultSummary";
import ReportActions from "@/components/result/ReportActions";

import { useLanguage } from "@/hooks/useLanguage";
import { session } from "@/lib/session";

import type { AssessmentResult } from "@/types/assessment.types";

export default function ResultPage() {
  const { t } = useLanguage();

  const [result, setResult] = useState<
    AssessmentResult | null | undefined
  >(undefined);

  useEffect(() => {
    setResult(session.get<AssessmentResult>("result"));
  }, []);

  if (result === undefined) {
    return null;
  }

  if (!result) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <p>{t("result.empty")}</p>

        <Link href="/" className="btn-primary mt-5">
          {t("result.again")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rise mx-auto max-w-2xl space-y-5">
      <div className="card space-y-4 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Assessment Completed
        </h1>

        <p className="text-sm leading-6 text-muted">
          Your assessment has been successfully submitted
          and saved. Your report can be accessed using
          the available report actions.
        </p>
      </div>

      <ResultSummary result={result} />

      <ReportActions assessmentId={result.assessmentId} />

      <p className="text-xs leading-relaxed text-muted">
        {t("result.disclaimer")}
      </p>

      <Link
        href="/"
        onClick={() => session.clear()}
        className="btn-ghost w-full"
      >
        {t("result.again")}
      </Link>
    </div>
  );
}
