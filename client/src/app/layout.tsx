import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Noto_Nastaliq_Urdu } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/hooks/useLanguage'
import Header from '@/components/common/Header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta'
})
const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu'
})

export const metadata: Metadata = {
  title: 'IIEF-5 / SHIM Assessment',
  description: 'A private, five-question self-assessment. No account needed.'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      dir='ltr'
      className={`${inter.variable} ${jakarta.variable} ${urdu.variable}`}
    >
      <body className='flex min-h-screen flex-col'>
        <LanguageProvider>
          <Header />
          <main className='mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6'>
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}
