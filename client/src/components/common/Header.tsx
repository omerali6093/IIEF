'use client'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import LanguageSwitcher from './LanguageSwitcher'
export default function Header () {
  const { t } = useLanguage()
  return (
    <header className='sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur'>
      <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6'>
        <Link href='/' className='flex items-center gap-3'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/rise-in-life-logo.png' alt='' className='h-auto w-[190px]' />
        </Link>
        <LanguageSwitcher />

        <Link href='/' className='flex items-center gap-3'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/ATCO-Group.png' alt='' className='h-auto w-[90px]' />
        </Link>

      </div>
    </header>
  )
}
