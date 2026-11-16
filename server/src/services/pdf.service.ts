import PDFDocument from 'pdfkit'
import { getPdfReportData } from './report.service.js'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export async function generateAssessmentPdf (
  assessmentId: string,
  token: string
): Promise<Buffer> {
  const report = await getPdfReportData(assessmentId, token)

  // Resolve the image relative to this service file.
  const pdfBgImg = fileURLToPath(
    new URL('../assets/pdf-bg.png', import.meta.url)
  )

  if (!existsSync(pdfBgImg)) {
    throw new Error(`PDF background image not found: ${pdfBgImg}`)
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 135,
        bottom: 45,
        left: 50,
        right: 50
      },
      info: {
        Title: 'Rise in Life Application',
        Author: 'Rise in Life Application'
      }
    })

    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const pageWidth = doc.page.width
    const pageHeight = doc.page.height

    // Draw the background on the current page.
    const drawBackground = () => {
      doc.save()

      doc.image(pdfBgImg, 0, 0, {
        width: pageWidth,
        height: pageHeight
      })

      doc.restore()
    }

    // First page.
    drawBackground()

    // Background for every additional page.
    doc.on('pageAdded', drawBackground)

    const addSectionTitle = (title: string) => {
      doc.moveDown(0.8)

      doc.font('Helvetica-Bold').fontSize(13).text(title)

      doc.moveDown(0.4)
    }

    const addField = (label: string, value: string) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#333333')
        .text(`${label}: `, { continued: true })

      doc.font('Helvetica').fontSize(10).text(value)
    }

    // Report heading.
    doc
      .font('Helvetica-Bold')
      .fontSize(21)
      .fillColor('#172554')
      .text('Assessment Report', {
        align: 'center'
      })

    doc.moveDown(0.4)

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#666666')
      .text(
        `Completed: ${new Date(report.completedAt).toLocaleString('en-PK')}`,
        { align: 'center' }
      )

    doc.moveDown()

    // Patient details.
    addSectionTitle('Patient Details')

    addField('Contact Number', report.patient.contactNumber || 'Not provided')
    addField('Age Group', report.patient.ageGroup || 'Not provided')
    addField('Marital Status', report.patient.maritalStatus || 'Not provided')
    addField('Tobacco Use', report.patient.tobaccoUse || 'Not provided')

    addField(
      'Conditions',
      report.patient.conditions.length
        ? report.patient.conditions.join(', ')
        : 'None provided'
    )

    addField('Consent', report.patient.consent ? 'Yes' : 'No')

    // Questionnaire information.
    addSectionTitle('Assessment Questions')

    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor('#666666')
      .text(
        `${report.questionnaire.name.replace(/\s*\/\s*SHIM/gi, '')} | Version ${
          report.questionnaire.version
        }`
      )

    doc.moveDown(0.6)

    // Questions and selected answers.
    report.answers.forEach(answer => {
      const requiredHeight = 65

      if (doc.y + requiredHeight > doc.page.height - 65) {
        doc.addPage()
      }

      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('#172554')
        .text(`Question ${answer.questionNumber}`)

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#222222')
        .text(answer.question, {
          width: 495
        })

      doc.moveDown(0.2)

      doc.font('Helvetica-Bold').fontSize(10).text('Selected Answer: ', {
        continued: true
      })

      doc.font('Helvetica').text(answer.selectedAnswer, {
        width: 495
      })

      doc.moveDown(0.7)
    })

    // Assessment summary.
    if (doc.y + 95 > doc.page.height - 55) {
      doc.addPage()
    }

    doc.moveDown(4)

    // Display total score.
    doc
      .font('Helvetica-Bold')
      .fontSize(15)
      .fillColor('#172554')
      .text(`Total Score: ${report.totalScore}`, {
        align: 'center'
      })

    doc.moveDown(0.5)

    // Determine interpretation from the total score.
    const getScoreInterpretation = (score: number): string => {
      if (score >= 22 && score <= 25) {
        return 'No erectile dysfunction'
      }

      if (score >= 17 && score <= 21) {
        return 'Mild erectile dysfunction'
      }

      if (score >= 12 && score <= 16) {
        return 'Mild to moderate erectile dysfunction'
      }

      if (score >= 8 && score <= 11) {
        return 'Moderate erectile dysfunction'
      }

      if (score >= 5 && score <= 7) {
        return 'Severe erectile dysfunction'
      }

      return 'Interpretation unavailable'
    }

    const interpretation = getScoreInterpretation(report.totalScore)

    // Display interpretation.
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#172554')

    doc
      .font('Helvetica')
      .fontSize(18)
      .fillColor('#333333')
      .text(interpretation, {
        align: 'center'
      })

    doc.moveDown(1)

    doc.end()
  })
}
