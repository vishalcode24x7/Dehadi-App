import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import hi from '../../public/locales/hi/translation.json'
import en from '../../public/locales/en/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    hi: { translation: hi },
    en: { translation: en },
  },
  lng: localStorage.getItem('hk_lang') || 'hi',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
