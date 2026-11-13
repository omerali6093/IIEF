"use client";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchReportPdf } from "@/services/report.service";

export default function ReportActions({ assessmentId }: { assessmentId: string }) {
  const { t } = useLanguage();
  const [note, setNote] = useState("");

  const download = async () => {
    try {
      const blob = await fetchReportPdf(assessmentId);
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href: url, download: "assessment-report.pdf" }).click();
      URL.revokeObjectURL(url);
    } catch { setNote(t("result.unavailable")); }
  };
  const share = async () => {
    try {
      const blob = await fetchReportPdf(assessmentId);
      const file = new File([blob], "assessment-report.pdf", { type: "application/pdf" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] });
      else await download(); // fallback: download so the patient can attach it manually
    } catch { setNote(t("result.unavailable")); }
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={download} className="btn-primary flex-1">{t("result.download")}</button>
        <button onClick={share} className="btn-ghost flex-1 !border-[#25D366] !text-[#128C4A]">{t("result.whatsapp")}</button>
      </div>
      {note && <p role="status" className="text-xs text-muted">{note}</p>}
    </div>
  );
}
