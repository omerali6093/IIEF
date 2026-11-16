'use client'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
export default function Header () {
  const { t } = useLanguage()
  return (
    <header className='sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur'>
      <div className='mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3'>
        <Link href='/' className='shrink-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/rise-in-life-logo.png' alt='Rise in Life' className='h-auto w-[120px] sm:w-[160px] md:w-[190px]' />
        </Link>

        <div className='flex flex-1 items-center justify-center'>
          <LanguageSwitcher />
        </div>

        <Link href='/' className='shrink-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/ATCO-Group.png' alt='ATCO Group' className='h-auto w-[56px] sm:w-[72px] md:w-[90px]' />
        </Link>
      </div>
    </header>
  )
}
