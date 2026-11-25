import { create } from 'zustand'

export const useWorkersStore = create((set) => ({
  workers: [],
  summaries: [],
  loading: false,
  error: '',
  setWorkers: (workers) => set({ workers }),
  setSummaries: (summaries) => set({ summaries }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addWorker: (worker) =>
    set((state) => ({ workers: [worker, ...state.workers] })),
  replaceWorker: (worker) =>
    set((state) => ({
      workers: state.workers.map((item) =>
        item._id === worker._id ? worker : item,
      ),
    })),
  removeWorker: (id) =>
    set((state) => ({
      workers: state.workers.filter((worker) => worker._id !== id),
    })),
}))
