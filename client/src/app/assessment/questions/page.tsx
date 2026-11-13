'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import QuestionCard from '@/components/assessment/QuestionCard'
import Loading from '@/components/common/Loading'
import { useLanguage } from '@/hooks/useLanguage'
import { getActiveQuestionnaire } from '@/services/questionnaire.service'
import { submitAssessment } from '@/services/assessment.service'
import { session } from '@/lib/session'
import { USE_MOCK } from '@/lib/constants'
import type { Questionnaire } from '@/types/questionnaire.types'
import type { PatientDetails } from '@/types/patient.types'

export default function QuestionsPage () {
  const router = useRouter()
  const { t } = useLanguage()
  const [qn, setQn] = useState<Questionnaire | null>(null)
  const [patient, setPatient] = useState<PatientDetails | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const p = session.get<PatientDetails>('patient')
    if (!p) {
      router.replace('/assessment/patient-details')
      return
    }
    setPatient(p)
    setAnswers(session.get<Record<string, string>>('answers') ?? {})
    getActiveQuestionnaire().then(setQn)
  }, [router])

  if (!qn || !patient)
    return (
      <div className='py-20'>
        <Loading />
      </div>
    )
  const q = qn.questions[index]
  const isLast = index === qn.questions.length - 1

  const choose = (id: string) => {
    const next = { ...answers, [q.id]: id }
    setAnswers(next)
    session.set('answers', next) // answers preserved when navigating
  }
  const next = async () => {
    if (!isLast) return setIndex(index + 1)
    setSubmitting(true)
    setFailed(false)
    try {
      const result = await submitAssessment(patient, {
        answers: qn.questions.map(x => ({
          questionId: x.id,
          answerOptionId: answers[x.id]
        }))
      })
      session.set('result', result)
      router.push('/assessment/result')
    } catch {
      setFailed(true)
      setSubmitting(false)
    }
  }

  return (
    <>
      {USE_MOCK && (
        <p className='mx-auto mb-4 max-w-2xl rounded-field bg-amber-50 px-4 py-2.5 text-xs text-amber-800'>
          {t('quiz.placeholderBanner')}
        </p>
      )}
      <QuestionCard
        question={q}
        total={qn.questions.length}
        value={answers[q.id]}
        onChange={choose}
        onPrev={() => setIndex(index - 1)}
        onNext={next}
        isFirst={index === 0}
        isLast={isLast}
        submitting={submitting}
        error={failed}
      />
    </>
  )
}
