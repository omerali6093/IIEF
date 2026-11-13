'use client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import en from '@/messages/en.json'
import ur from '@/messages/ur.json'

export type Lang = 'en' | 'ur'
const dict: Record<Lang, any> = { en, ur }
type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => any
}
const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider ({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'ur' || saved === 'en') setLangState(saved)
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr'
  }, [lang])
  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const val =
        key.split('.').reduce((o: any, k) => o?.[k], dict[lang]) ?? key
      return typeof val === 'string' && vars
        ? val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
        : val
    },
    [lang]
  )
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
export function useLanguage () {
  const c = useContext(LanguageContext)
  if (!c) throw new Error('useLanguage must be used inside LanguageProvider')
  return c
}
