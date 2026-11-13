'use client'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
export default function Hero () {
  const { t } = useLanguage()
  const steps = t('home.steps') as { t: string; d: string }[]
  return (
    <section className='grid items-center gap-10 py-6 md:grid-cols-[1.1fr_.9fr] md:py-14'>
      <div className='rise'>
        <h1 className='text-3xl font-extrabold leading-tight sm:text-5xl'>
          {t('home.title')}
        </h1>
        <p className='mt-5 max-w-xl text-base text-muted sm:text-lg'>
          {t('home.subtitle')}
        </p>
        <Link
          href='/assessment/patient-details'
          className='btn-primary mt-8 !px-8 !py-4 text-base'
        >
          {t('home.start')}
        </Link>
      </div>
      <ol className='card divide-y divide-line'>
        <li className='rounded-t-card bg-primary-soft px-6 py-4 font-heading text-sm font-bold text-primary-dark'>
          {t('home.stepsTitle')}
        </li>
        {steps.map((s, i) => (
          <li key={i} className='flex gap-4 px-6 py-5'>
            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white'>
              {i + 1}
            </span>
            <div>
              <p className='font-semibold text-secondary'>{s.t}</p>
              <p className='mt-0.5 text-sm text-muted'>{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
