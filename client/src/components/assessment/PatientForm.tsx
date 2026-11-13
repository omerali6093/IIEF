"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, type PatientFormValues } from "@/lib/validations";
import { useLanguage } from "@/hooks/useLanguage";
import { session } from "@/lib/session";

const AGE_GROUPS = ["30_31", "31_44", "50_60", "51_66", "60_plus"] as const;
const MARITAL = ["married", "unmarried"] as const;
const TOBACCO = ["never", "former", "current"] as const;
const CONDITIONS = ["diabetes", "hypertension", "bph"] as const;

const optionClass = (on: boolean) =>
  `flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
    on ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
  }`;

export default function PatientForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: "", age: 0, contactNumber: "",
      ageGroup: "", maritalStatus: "", tobaccoUse: "", conditions: [],
    },
  });

  const err = (k?: string) => (k ? <p role="alert" className="mt-1.5 text-xs text-red-600">{t(`patient.errors.${k}`)}</p> : null);

  const ageGroup = watch("ageGroup");
  const maritalStatus = watch("maritalStatus");
  const tobaccoUse = watch("tobaccoUse");
  const conditions = watch("conditions") ?? [];

  // Checkbox-style, single choice (click again to clear)
  const pickOne = (name: "ageGroup" | "maritalStatus" | "tobaccoUse", current: string, value: string) =>
    setValue(name, current === value ? "" : value, { shouldValidate: true, shouldDirty: true });

  // Checkbox, multiple choice
  const toggleCondition = (value: string) =>
    setValue(
      "conditions",
      conditions.includes(value) ? conditions.filter((c) => c !== value) : [...conditions, value],
      { shouldDirty: true }
    );

  const onSubmit = async (v: PatientFormValues) => {
    setBusy(true);
    session.clear();
    session.set("patient", v);
    router.push("/assessment/questions");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card mx-auto max-w-xl space-y-5 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold">{t("patient.title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("patient.subtitle")}</p>
      </div>

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold">{t("patient.name")}</label>
        <input id="fullName" autoComplete="name" className="field" {...register("fullName")} />
        {err(errors.fullName?.message)}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="age" className="mb-1.5 block text-sm font-semibold">{t("patient.age")}</label>
          <input id="age" type="number" inputMode="numeric" className="field" {...register("age")} />
          {err(errors.age?.message)}
        </div>
      </div>

      {/* Age group */}
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">{t("patient.ageGroup.label")}</legend>
        <p className="mb-2 text-xs text-muted">{t("patient.selectOne")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {AGE_GROUPS.map((v) => (
            <label key={v} className={optionClass(ageGroup === v)}>
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={ageGroup === v}
                onChange={() => pickOne("ageGroup", ageGroup, v)} />
              <span>{t(`patient.ageGroup.options.${v}`)}</span>
            </label>
          ))}
        </div>
        {err(errors.ageGroup?.message)}
      </fieldset>

      {/* Marital status */}
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">{t("patient.maritalStatus.label")}</legend>
        <p className="mb-2 text-xs text-muted">{t("patient.selectOne")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MARITAL.map((v) => (
            <label key={v} className={optionClass(maritalStatus === v)}>
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={maritalStatus === v}
                onChange={() => pickOne("maritalStatus", maritalStatus, v)} />
              <span>{t(`patient.maritalStatus.options.${v}`)}</span>
            </label>
          ))}
        </div>
        {err(errors.maritalStatus?.message)}
      </fieldset>

      {/* Tobacco use */}
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">{t("patient.tobacco.label")}</legend>
        <p className="mb-2 text-xs text-muted">{t("patient.selectOne")}</p>
        <div className="grid gap-2">
          {TOBACCO.map((v) => (
            <label key={v} className={optionClass(tobaccoUse === v)}>
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={tobaccoUse === v}
                onChange={() => pickOne("tobaccoUse", tobaccoUse, v)} />
              <span>{t(`patient.tobacco.options.${v}`)}</span>
            </label>
          ))}
        </div>
        {err(errors.tobaccoUse?.message)}
      </fieldset>

      {/* Health conditions (multi-select) */}
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">{t("patient.conditions.label")}</legend>
        <p className="mb-2 text-xs text-muted">{t("patient.conditions.hint")}</p>
        <div className="grid gap-2">
          {CONDITIONS.map((v) => (
            <label key={v} className={optionClass(conditions.includes(v))}>
              <input type="checkbox" className="h-4 w-4 accent-primary" checked={conditions.includes(v)}
                onChange={() => toggleCondition(v)} />
              <span>{t(`patient.conditions.options.${v}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="contact" className="mb-1.5 block text-sm font-semibold">{t("patient.contact")} <span className="font-normal text-muted">({t("patient.optional")})</span></label>
        <input id="contact" type="tel" dir="ltr" autoComplete="tel" className="field" {...register("contactNumber")} />
        {err(errors.contactNumber?.message)}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-primary" {...register("consent")} />
          <span>{t("patient.consent")}</span>
        </label>
        {err(errors.consent?.message)}
      </div>

      <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? t("patient.checking") : t("patient.continue")}</button>
    </form>
  );
}