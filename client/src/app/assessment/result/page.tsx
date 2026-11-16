
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/hooks/useLanguage";
import { session } from "@/lib/session";
import type { AssessmentResult } from "@/types/assessment.types";

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
        {/* Success icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
          ✓
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold sm:text-3xl">
          {t("result.title")}
        </h1>

        <p className="text-sm leading-6 text-muted">
          {t("result.successMessage")}
        </p>

        {/* Interpretation */}
        <div className="rounded-xl bg-gray-50 p-5">
          <p className="text-xs text-muted">
            {t("result.interpretationTitle")}
          </p>

          <h2 className="mt-2 text-xl font-bold text-primary">
            {result.interpretation}
          </h2>
        </div>

        {/* Assessment reference */}
        <div className={isUrdu ? "text-right" : "text-left"}>
          <p className="text-xs text-muted">
            {t("result.reference")}
          </p>

          <p
            dir="ltr"
            className="mt-1 break-all text-sm font-semibold"
          >
            {result.assessmentId}
          </p>
        </div>

        {/* Completion date */}
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

      {/* Disclaimer */}
      <p className="text-xs leading-relaxed text-muted">
        {t("result.disclaimer")}
      </p>

      {/* Start again */}
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
