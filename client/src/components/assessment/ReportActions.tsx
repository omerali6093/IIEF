'use client'

import { useState } from 'react'
import { getAssessmentPdf } from '@/services/report.service'
import { FaWhatsapp, FaFileDownload } from 'react-icons/fa'

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
        className='inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#E53935] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#C62828] hover:shadow-lg hover:shadow-red-500/30 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md'
      >
        <FaFileDownload className='text-xl' />
        <span>{loading ? 'Preparing...' : 'Download as PDF'}</span>
      </button>

      <button
        type='button'
        onClick={handlePrepareShare}
        disabled={loading || !!pdfFile}
        className='inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1EBE5D] hover:shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md'
      >
        <FaWhatsapp className='text-xl' />
        <span>
          {loading
            ? 'Preparing PDF...'
            : pdfFile
            ? 'PDF Ready to Share'
            : 'Prepare PDF for WhatsApp'}
        </span>
      </button>

      {pdfFile && (
        <button
          type='button'
          onClick={handleShare}
          className='inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1EBE5D] hover:shadow-lg hover:shadow-green-500/30 active:scale-95'
        >
          <FaWhatsapp className='text-xl' />
          <span>Share PDF on WhatsApp</span>
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
