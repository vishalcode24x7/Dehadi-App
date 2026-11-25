import { create } from 'zustand'

export const useSummaryStore = create((set) => ({
  workers: [],
  todayPresent: 0,
  todayKhoraki: 0,
  totalBalance: 0,
  totalWorkers: 0,
  loading: false,
  error: '',
  setWorkers: (workers) => set({ workers }),
  setDashboard: (todayPresent, todayKhoraki, totalBalance, totalWorkers) =>
    set({ todayPresent, todayKhoraki, totalBalance, totalWorkers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
