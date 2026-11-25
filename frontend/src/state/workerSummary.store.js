import { create } from 'zustand'

export const useWorkerSummaryStore = create((set) => ({
  summary: null,
  loading: false,
  error: '',
  setSummary: (summary) => set({ summary }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
