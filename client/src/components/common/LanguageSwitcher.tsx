"use client";
import { useLanguage } from "@/hooks/useLanguage";
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div role="group" aria-label={t("nav.language")} className="flex rounded-full border border-line bg-white p-1 text-sm font-medium">
      {(["en", "ur"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
          className={`rounded-full px-3.5 py-1 transition ${lang === l ? "bg-primary text-white" : "text-muted hover:text-secondary"}`}>
          {l === "en" ? "English" : "اردو"}
        </button>
      ))}
    </div>
  );
}
