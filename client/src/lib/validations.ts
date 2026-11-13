import { z } from "zod";
import { REQUIRE_CONTACT } from "./constants";

// Messages are translation keys resolved in the form.
export const patientSchema = z.object({
  fullName: z.string().trim().min(2, "name").max(100, "name"),
  age: z.coerce.number({ invalid_type_error: "age" }).int("age").min(18, "age").max(120, "age"),
  ageGroup: z.string().trim().max(30).optional(),
  bloodPressure: z.string().trim().max(30).optional(),
  weightRange: z.string().trim().max(30).optional(),
  contactNumber: REQUIRE_CONTACT
    ? z.string().trim().regex(/^[+\d][\d\s-]{6,17}$/, "contact")
    : z.string().trim().regex(/^([+\d][\d\s-]{6,17})?$/, "contact").optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "consent" }) }),
});
export type PatientFormValues = z.infer<typeof patientSchema>;
