"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  if (result === undefined) return null;

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
      <div className="card space-y-5 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Assessment Completed
        </h1>

        <p className="text-sm leading-6 text-muted">
          Your assessment has been successfully submitted and saved.
        </p>

        <div className="rounded-xl bg-gray-50 p-4 text-left">
          <p className="text-xs text-muted">
            Assessment Reference
          </p>

          <p className="mt-1 break-all text-sm font-semibold">
            {result.assessmentId}
          </p>
        </div>

        <div className="text-left">
          <p className="text-xs text-muted">Completed At</p>

          <p className="mt-1 text-sm font-medium">
            {new Date(result.completedAt).toLocaleString()}
          </p>
        </div>
      </div>

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