'use client'
import { useLanguage } from '@/hooks/useLanguage'
import type { AnswerOption } from '@/types/questionnaire.types'
type Props = {
  questionId: string
  options: AnswerOption[]
  value?: string
  onChange: (id: string) => void
}
export default function AnswerOptions ({
  questionId,
  options,
  value,
  onChange
}: Props) {
  const { lang } = useLanguage()
  return (
    <div
      role='radiogroup'
      aria-labelledby={`${questionId}-label`}
      className='space-y-3'
    >
      {options.map(o => {
        const selected = value === o.id
        return (
          <button
            key={o.id}
            type='button'
            role='radio'
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            className={`flex w-full items-center gap-4 rounded-field border-2 px-4 py-4 text-start text-sm transition sm:text-base ${
              selected
                ? 'border-primary bg-primary-soft'
                : 'border-line bg-white hover:border-primary/40'
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                selected ? 'border-primary' : 'border-muted/50'
              }`}
            >
              {selected && (
                <span className='h-2.5 w-2.5 rounded-full bg-primary' />
              )}
            </span>
            <span>{o.text[lang]}</span>
          </button>
        )
      })}
    </div>
  )
}
