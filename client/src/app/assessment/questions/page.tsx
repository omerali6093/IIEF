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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadQuestionnaire () {
      const patientData = session.get<PatientDetails>('patient')

      console.log('Patient data from session:', patientData)
      console.log('Age:', patientData?.age)
      console.log('Age type:', typeof patientData?.age)
      console.log('Consent:', patientData?.consent)
      console.log('Consent type:', typeof patientData?.consent)

      if (!patientData) {
        router.replace('/assessment/patient-details')
        return
      }

      setPatient(patientData)

      setAnswers(session.get<Record<string, string>>('answers') ?? {})

      try {
        const questionnaire = await getActiveQuestionnaire()

        if (!active) return

        if (!questionnaire.questions.length) {
          throw new Error('No questionnaire questions were returned.')
        }

        setQn(questionnaire)
      } catch (error) {
        console.error('Questionnaire loading failed:', error)

        if (active) {
          setFailed(true)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadQuestionnaire()

    return () => {
      active = false
    }
  }, [router])

  const choose = (optionId: string) => {
    if (!qn) return

    const question = qn.questions[index]

    const nextAnswers = {
      ...answers,
      [question.id]: optionId
    }

    setAnswers(nextAnswers)

    session.set('answers', nextAnswers)
  }

  const next = async () => {
    if (!qn || !patient || submitting) return

    const currentQuestion = qn.questions[index]

    // Require an answer before moving forward.
    if (!answers[currentQuestion.id]) {
      return
    }

    const isLast = index === qn.questions.length - 1

    if (!isLast) {
      setIndex(previous => previous + 1)
      return
    }

    setSubmitting(true)
    setFailed(false)

    try {
      const result = await submitAssessment(patient, {
        answers: qn.questions.map(question => ({
          questionId: question.id,
          answerOptionId: answers[question.id]
        }))
      })

      session.set('result', result)

      router.push('/assessment/result')
    } catch (error) {
      console.error('Assessment submission failed:', error)

      setFailed(true)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='py-20'>
        <Loading />
      </div>
    )
  }

  if (failed && !qn) {
    return (
      <div className='mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6'>
        <h2 className='font-semibold text-red-700'>
          Unable to load questionnaire
        </h2>

        <p className='mt-2 text-sm text-red-600'>
          Please check your backend connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className='btn-primary mt-4'
        >
          Try again
        </button>
      </div>
    )
  }

  if (!qn || !patient) {
    return null
  }

  const question = qn.questions[index]

  const isLast = index === qn.questions.length - 1

  return (
    <>
      {USE_MOCK && (
        <p className='mx-auto mb-4 max-w-2xl rounded-field bg-amber-50 px-4 py-2.5 text-xs text-amber-800'>
          {t('quiz.placeholderBanner')}
        </p>
      )}

      <QuestionCard
        question={question}
        total={qn.questions.length}
        value={answers[question.id]}
        onChange={choose}
        onPrev={() => setIndex(previous => previous - 1)}
        onNext={next}
        isFirst={index === 0}
        isLast={isLast}
        submitting={submitting}
        error={failed}
      />
    </>
  )
}
