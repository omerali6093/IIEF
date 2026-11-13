export type AnswerOption = { id: string; text: { en: string; ur: string } } // no score values on the client
export type Question = {
  id: string
  number: number
  text: { en: string; ur: string }
  options: AnswerOption[]
}
export type Questionnaire = {
  id: string
  name: string
  version: string
  questions: Question[]
}
