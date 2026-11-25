import { create } from 'zustand'

const initialLanguage = localStorage.getItem('hk_lang') || 'hi'
const initialTheme = localStorage.getItem('hk_theme') === 'dark' ? 'dark' : 'light'

export const useUiStore = create((set) => ({
  language: initialLanguage,
  theme: initialTheme,
  toast: '',
  setToast: (toast) => set({ toast }),
  setLanguage: (language) => {
    localStorage.setItem('hk_lang', language)
    set({ language })
  },
  setTheme: (theme) => {
    localStorage.setItem('hk_theme', theme)
    set({ theme })
  },
}))
