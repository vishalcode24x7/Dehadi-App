import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiStore } from '../state/ui.store'

export function useLanguage() {
  const { i18n, t } = useTranslation()
  const language = useUiStore((state) => state.language)
  const setLanguage = useUiStore((state) => state.setLanguage)

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [i18n, language])

  const toggleLanguage = () => {
    const nextLanguage = language === 'hi' ? 'en' : 'hi'
    setLanguage(nextLanguage)
  }

  return { language, toggleLanguage, t }
}
