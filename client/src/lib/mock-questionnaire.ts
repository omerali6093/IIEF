import type { Questionnaire } from '@/types/questionnaire.types'
// PLACEHOLDER CONTENT ONLY. The PRD forbids inventing clinical wording.
// Replace with clinician-approved English text and the authorized Urdu translation
// (in production this comes from GET /questionnaires/active?language=...).
const opt = (q: number, o: number) => ({
  id: `q${q}-o${o}`,
  text: {
    en: `[Answer option ${o} — approved wording pending]`,
    ur: `[جواب کا آپشن ${o} — منظور شدہ متن زیر التوا]`
  }
})
export const mockQuestionnaire: Questionnaire = {
  id: 'mock-questionnaire',
  name: 'IIEF-5 / SHIM',
  version: 'mock-0',
  questions: [1, 2, 3, 4, 5].map(n => ({
    id: `q${n}`,
    number: n,
    text: {
      en: `[Question ${n} — approved wording pending]`,
      ur: `[سوال ${n} — منظور شدہ متن زیر التوا]`
    },
    options: [1, 2, 3, 4, 5].map(o => opt(n, o))
  }))
}
