import { create } from 'zustand'

const initialLanguage = localStorage.getItem('hk_lang') || 'hi'

export const useUiStore = create((set) => ({
  language: initialLanguage,
  toast: '',
  setToast: (toast) => set({ toast }),
  setLanguage: (language) => {
    localStorage.setItem('hk_lang', language)
    set({ language })
  },
}))
