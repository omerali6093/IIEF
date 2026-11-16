"use client";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { getAssessmentPdf } from "@/services/report.service";
import { FaWhatsapp } from "react-icons/fa";

export default function ReportActions({
  assessmentId,
  reportAccessToken = "",
}: {
  assessmentId: string;
  reportAccessToken?: string;
}) {
  const { t } = useLanguage();
  const [note, setNote] = useState("");

  const download = async () => {
    try {
      const blob = await getAssessmentPdf(assessmentId, reportAccessToken);
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href: url, download: "assessment-report.pdf" }).click();
      URL.revokeObjectURL(url);
    } catch { setNote(t("result.unavailable")); }
  };
  const share = async () => {
    try {
      const blob = await getAssessmentPdf(assessmentId, reportAccessToken);
      const file = new File([blob], "assessment-report.pdf", { type: "application/pdf" });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file] });
      else await download(); // fallback: download so the patient can attach it manually
    } catch { setNote(t("result.unavailable")); }
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={download} className="btn-primary flex-1">{t("result.download")}</button>
        <button
          onClick={share}
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1EBE5D] hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
        >
          <FaWhatsapp className="text-xl" />
          <span>{t("result.whatsapp")}</span>
        </button>
      </div>
      {note && <p role="status" className="text-xs text-muted">{note}</p>}
    </div>
  );
}
