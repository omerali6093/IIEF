
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
import { session } from "@/lib/session";
import type { AssessmentResult } from "@/types/assessment.types";

import ReportActions from "@/components/assessment/ReportActions";

export default function ResultPage() {
  const { t, lang } = useLanguage();

  const [result, setResult] = useState<
    AssessmentResult | null | undefined
  >(undefined);

  useEffect(() => {
    setResult(session.get<AssessmentResult>("result"));
  }, []);

  const isUrdu = lang === "ur";

  if (result === undefined) {
    return null;
  }

  if (!result) {
    return (
      <div
        dir={isUrdu ? "rtl" : "ltr"}
        className="card mx-auto max-w-md p-8 text-center"
      >
        <p>{t("result.empty")}</p>

        <Link href="/" className="btn-primary mt-5">
          {t("result.again")}
        </Link>
      </div>
    );
  }

  const completedDate = new Date(
    result.completedAt
  ).toLocaleString(isUrdu ? "ur-PK" : "en-PK");

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      lang={lang}
      className="rise mx-auto max-w-2xl space-y-5"
    >
      <div className="card space-y-5 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="text-2xl font-bold sm:text-3xl">
          {t("result.title")}
        </h1>

        <p className="text-sm leading-6 text-muted">
          {t("result.successMessage")}
        </p>

        <div className="rounded-xl bg-surface p-5">
          <p className="text-xs text-muted">
            {t("result.interpretationTitle")}
          </p>

          <h2 className="mt-2 text-xl font-bold text-primary">
            {result.interpretation}
          </h2>
        </div>

        

        <div className={isUrdu ? "text-right" : "text-left"}>
          <p className="text-xs text-muted">
            {t("result.completedAt")}
          </p>

          <p
            dir="auto"
            className="mt-1 text-sm font-medium"
          >
            {completedDate}
          </p>
        </div>
      </div>

      {/* PDF download and WhatsApp sharing */}
      <div className="card space-y-4 p-5">
        <h2 className="text-lg font-semibold">
          Report Actions
        </h2>

        <ReportActions
          assessmentId={result.assessmentId}
          reportAccessToken={result.reportAccessToken}
        />
      </div>

      

      <Link
        href="/"
        onClick={() => session.clear()}
        className="btn-ghost block w-full text-center"
      >
        {t("result.again")}
      </Link>
    </div>
  );
}
