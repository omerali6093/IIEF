"use client";
import { useLanguage } from "@/hooks/useLanguage";
export default function ScoreCard({ score, interpretation }: { score: number; interpretation: string }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-card bg-secondary p-6 text-white sm:p-8">
      <p className="text-sm text-white/70">{t("result.score")}</p>
      <p className="mt-1 flex items-baseline gap-2"><span className="font-heading text-6xl font-extrabold">{score}</span><span className="text-white/70">{t("result.outOf")}</span></p>
      <p className="mt-5 border-t border-white/15 pt-4 text-sm text-white/70">{t("result.interpretation")}</p>
      <p className="mt-1 text-lg font-semibold">{interpretation}</p>
    </div>
  );
}
