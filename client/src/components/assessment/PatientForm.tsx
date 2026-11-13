"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, type PatientFormValues } from "@/lib/validations";
import { useLanguage } from "@/hooks/useLanguage";
import { session } from "@/lib/session";

export default function PatientForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: { fullName: "", age: 0, ageGroup: "", bloodPressure: "", weightRange: "", contactNumber: "" },
  });
  const err = (k?: string) => (k ? <p role="alert" className="mt-1.5 text-xs text-red-600">{t(`patient.errors.${k}`)}</p> : null);

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
        <div>
          <label htmlFor="ageGroup" className="mb-1.5 block text-sm font-semibold">{t("patient.ageGroup")}</label>
          <input id="ageGroup" className="field" {...register("ageGroup")} />
          {err(errors.ageGroup?.message)}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bloodPressure" className="mb-1.5 block text-sm font-semibold">{t("patient.bloodPressure")}</label>
          <input id="bloodPressure" className="field" {...register("bloodPressure")} />
          {err(errors.bloodPressure?.message)}
        </div>
        <div>
          <label htmlFor="weightRange" className="mb-1.5 block text-sm font-semibold">{t("patient.weightRange")}</label>
          <input id="weightRange" className="field" {...register("weightRange")} />
          {err(errors.weightRange?.message)}
        </div>
      </div>
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
