import { create } from 'zustand'

export const useKhorakiGroupsStore = create((set) => ({
  groups: [],
  workers: [],
  loading: false,
  error: '',
  setGroups: (groups) => set({ groups }),
  setWorkers: (workers) => set({ workers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addGroup: (group) =>
    set((state) => ({ groups: [group, ...state.groups] })),
  updateGroup: (group) =>
    set((state) => ({
      groups: state.groups.map((item) =>
        item._id === group._id ? group : item,
      ),
    })),
}))
