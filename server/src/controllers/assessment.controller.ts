
import type { Request, Response } from 'express'
import { createHash, randomBytes } from 'node:crypto'

import prisma from '../config/db.js'

import {
  calculateTotalScore,
  getInterpretation,
  isSupportedLanguage,
  type Language
} from '../services/assessment.service.js'

type SubmitBody = {
  language?: Language

  patient?: {
    contactNumber?: string
    ageGroup?: string
    maritalStatus?: string
    tobaccoUse?: string
    conditions?: string[]
    consent?: boolean
  }

  answers?: {
    questionId: string
    answerOptionId: string
  }[]
}

const REPORT_TOKEN_VALIDITY_DAYS = 7

function hashReportToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function submitAssessment(req: Request, res: Response) {
  try {
    const body = req.body as SubmitBody
    const patient = body.patient
    const answers = body.answers
    const language = body.language

    // 1. Validate language
    if (!isSupportedLanguage(language)) {
      return res.status(400).json({
        success: false,
        message: 'A valid language (en or ur) is required.'
      })
    }

    // 2. Validate patient details
    if (
      !patient ||
      typeof patient.ageGroup !== 'string' ||
      !patient.ageGroup.trim() ||
      typeof patient.maritalStatus !== 'string' ||
      !patient.maritalStatus.trim() ||
      typeof patient.tobaccoUse !== 'string' ||
      !patient.tobaccoUse.trim() ||
      !Array.isArray(patient.conditions) ||
      !patient.conditions.every(condition => typeof condition === 'string') ||
      patient.consent !== true
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid patient details and consent are required.'
      })
    }

    // 3. Store validated and trimmed patient values
    const ageGroup = patient.ageGroup.trim()
    const maritalStatus = patient.maritalStatus.trim()
    const tobaccoUse = patient.tobaccoUse.trim()

    // 4. Validate submitted answers
    if (
      !Array.isArray(answers) ||
      answers.length !== 5 ||
      answers.some(
        answer =>
          typeof answer.questionId !== 'string' ||
          !answer.questionId ||
          typeof answer.answerOptionId !== 'string' ||
          !answer.answerOptionId
      ) ||
      new Set(answers.map(answer => answer.questionId)).size !== 5
    ) {
      return res.status(400).json({
        success: false,
        message: 'Exactly five valid answers are required.'
      })
    }

    // 5. Generate a secure report token
    const reportAccessToken = randomBytes(32).toString('hex')

    const reportAccessTokenHash = hashReportToken(reportAccessToken)

    const reportAccessExpiresAt = new Date(
      Date.now() + REPORT_TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000
    )

    // 6. Save assessment and answers in one transaction
    const result = await prisma.$transaction(async tx => {
      const questionnaire = await tx.questionnaire.findFirst({
        where: {
          code: 'IIEF5',
          language,
          isActive: true
        },
        include: {
          questions: {
            orderBy: {
              questionNumber: 'asc'
            },
            include: {
              options: true
            }
          }
        }
      })

      if (!questionnaire || questionnaire.questions.length !== 5) {
        throw new Error('ACTIVE_QUESTIONNAIRE_NOT_FOUND')
      }

      // 7. Validate question IDs
      const expectedQuestionIds = new Set(
        questionnaire.questions.map(question => question.id)
      )

      if (answers.some(answer => !expectedQuestionIds.has(answer.questionId))) {
        throw new Error('INVALID_QUESTION')
      }

      // 8. Validate selected options and retrieve database scores
      const savedAnswers = answers.map(answer => {
        const question = questionnaire.questions.find(
          item => item.id === answer.questionId
        )

        const option = question?.options.find(
          item => item.id === answer.answerOptionId
        )

        if (!question || !option) {
          throw new Error('INVALID_ANSWER_OPTION')
        }

        return {
          questionId: question.id,
          answerOptionId: option.id,
          scoreValue: option.scoreValue
        }
      })

      // 9. Calculate total score
      const totalScore = calculateTotalScore(
        savedAnswers.map(answer => answer.scoreValue)
      )

      // 10. Get interpretation
      const interpretation = getInterpretation(totalScore, language)

      // 11. Save patient
      const savedPatient = await tx.patient.create({
        data: {
          contactNumber: patient.contactNumber?.trim() || null,
          ageGroup,
          maritalStatus,
          tobaccoUse,
          conditions: patient.conditions,
          consent: true
        }
      })

      // 12. Save assessment and secure token hash
      const assessment = await tx.assessment.create({
        data: {
          patientId: savedPatient.id,
          questionnaireId: questionnaire.id,
          totalScore,
          interpretation,
          status: 'COMPLETED',

          reportAccessTokenHash,
          reportAccessExpiresAt,

          answers: {
            create: savedAnswers
          }
        }
      })

      // Do not expose the numerical score in the patient result.
      return {
        assessmentId: assessment.id,
        interpretation: assessment.interpretation,
        completedAt: assessment.completedAt,
        language,
        reportAccessToken,
        reportAccessExpiresAt
      }
    })

    return res.status(201).json({
      success: true,
      message: 'Assessment completed successfully.',
      data: result
    })
  } catch (error) {
    console.error('Assessment submission failed:', error)

    if (error instanceof Error) {
      const messages: Record<string, string> = {
        ACTIVE_QUESTIONNAIRE_NOT_FOUND:
          'The active questionnaire could not be found.',

        INVALID_QUESTION:
          'One or more submitted questions are invalid.',

        INVALID_ANSWER_OPTION:
          'One or more selected answer options are invalid.',

        EXACTLY_FIVE_SCORES_REQUIRED:
          'Exactly five scores are required.',

        INVALID_SCORE_VALUE:
          'An invalid answer score was found.',

        SCORE_RANGE_NOT_FOUND:
          'The score interpretation could not be determined.'
      }

      if (messages[error.message]) {
        return res.status(400).json({
          success: false,
          message: messages[error.message]
        })
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to save the assessment. Please try again.'
    })
  }
}
