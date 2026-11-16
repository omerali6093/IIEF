'use client'

import { useState } from 'react'
import { getAssessmentPdf } from '@/services/report.service'

type Props = {
  assessmentId: string
  reportAccessToken: string
}

export default function ReportActions ({
  assessmentId,
  reportAccessToken
}: Props) {
  const [loading, setLoading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  async function downloadPdf () {
    if (!assessmentId || !reportAccessToken) {
      throw new Error('Report access information is missing.')
    }

    const blob = await getAssessmentPdf(assessmentId, reportAccessToken)

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `rise-in-life-${assessmentId}.pdf`

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function handleDownload () {
    try {
      setLoading(true)
      setError('')
      await downloadPdf()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to download PDF.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePrepareShare () {
    try {
      setLoading(true)
      setError('')

      const blob = await getAssessmentPdf(assessmentId, reportAccessToken)

      const file = new File([blob], `rise-in-life-${assessmentId}.pdf`, {
        type: 'application/pdf'
      })

      setPdfFile(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to prepare PDF.')
    } finally {
      setLoading(false)
    }
  }

  async function handleShare () {
    if (!pdfFile) return

    try {
      setError('')

      if (
        navigator.canShare &&
        navigator.canShare({ files: [pdfFile] }) &&
        navigator.share
      ) {
        await navigator.share({
          files: [pdfFile],
          title: 'Assessment Report'
        })
        return
      }

      // Desktop fallback: download the same PDF.
      await downloadPdf()

      window.open('https://web.whatsapp.com/', '_blank', 'noopener,noreferrer')

      setError('PDF downloaded. Attach the downloaded PDF in WhatsApp.')
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      setError(err instanceof Error ? err.message : 'Unable to share PDF.')
    }
  }

  return (
    <div className='space-y-4'>
      <button
        type='button'
        onClick={handleDownload}
        disabled={loading}
        className='btn-primary block w-full disabled:opacity-60'
      >
        {loading ? 'Preparing...' : 'Download as PDF'}
      </button>

      <button
        type='button'
        onClick={handlePrepareShare}
        disabled={loading || !!pdfFile}
        className='btn-primary block w-full disabled:opacity-60'
      >
        {loading
          ? 'Preparing PDF...'
          : pdfFile
          ? 'PDF Ready to Share'
          : 'Prepare PDF for WhatsApp'}
      </button>

      {pdfFile && (
        <button
          type='button'
          onClick={handleShare}
          className='btn-primary block w-full'
        >
          Share PDF on WhatsApp
        </button>
      )}

      {error && (
        <p role='alert' className='text-center text-sm text-red-500'>
          {error}
        </p>
      )}
    </div>
  )
}
