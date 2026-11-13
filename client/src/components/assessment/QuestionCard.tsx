'use client'
import { useLanguage } from '@/hooks/useLanguage'
import type { Question } from '@/types/questionnaire.types'
import AnswerOptions from './AnswerOptions'
import ProgressBar from './ProgressBar'

type Props = {
  question: Question
  total: number
  value?: string
  onChange: (id: string) => void
  onPrev: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  submitting: boolean
  error?: boolean
}

export default function QuestionCard ({
  question,
  total,
  value,
  onChange,
  onPrev,
  onNext,
  isFirst,
  isLast,
  submitting,
  error
}: Props) {
  const { t, lang } = useLanguage()
  return (
    <div className='card mx-auto max-w-2xl space-y-6 p-6 sm:p-8'>
      <ProgressBar current={question.number} total={total} />
      <p className='text-sm font-semibold text-primary'>
        {t('quiz.question', { n: question.number, total })}
      </p>
      <div key={question.id} className='rise space-y-6'>
        <h1
          id={`${question.id}-label`}
          className='text-xl font-bold leading-snug sm:text-2xl'
        >
          {question.text[lang]}
        </h1>
        <AnswerOptions
          questionId={question.id}
          options={question.options}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && (
        <p role='alert' className='text-sm text-red-600'>
          {t('quiz.error')}
        </p>
      )}
      <div className='flex items-center justify-between gap-3 pt-2'>
        <button
          type='button'
          onClick={onPrev}
          disabled={isFirst || submitting}
          className='btn-ghost'
        >
          {t('quiz.previous')}
        </button>
        <button
          type='button'
          onClick={onNext}
          disabled={!value || submitting}
          className='btn-primary'
        >
          {isLast
            ? submitting
              ? t('quiz.submitting')
              : t('quiz.submit')
            : t('quiz.next')}
        </button>
      </div>
      {!value && (
        <p className='text-center text-xs text-muted'>{t('quiz.choose')}</p>
      )}
    </div>
  )
}
