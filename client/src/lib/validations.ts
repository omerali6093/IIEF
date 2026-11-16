import { z } from 'zod'
import { REQUIRE_CONTACT } from './constants'

export const patientSchema = z.object({
  ageGroup: z.string().min(1, 'ageGroup'),

  maritalStatus: z.string().min(1, 'maritalStatus'),

  tobaccoUse: z.string().min(1, 'tobaccoUse'),

  conditions: z.array(z.string()).min(1, 'conditions'),

  contactNumber: REQUIRE_CONTACT
    ? z
        .string()
        .trim()
        .regex(/^[+\d][\d\s-]{6,17}$/, 'contact')
    : z
        .string()
        .trim()
        .regex(/^([+\d][\d\s-]{6,17})?$/, 'contact')
        .optional(),

  consent: z.boolean().refine(value => value === true, {
    message: 'consent'
  })
})

export type PatientFormValues = z.infer<typeof patientSchema>
