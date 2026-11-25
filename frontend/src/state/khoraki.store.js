import { create } from 'zustand'

export const useKhorakiStore = create((set) => ({
  workers: [],
  items: [],
  loading: false,
  error: '',
  setWorkers: (workers) => set({ workers }),
  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    })),
}))
