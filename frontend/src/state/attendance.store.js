import { create } from 'zustand'

export const useAttendanceStore = create((set) => ({
  workers: [],
  attendanceByWorker: {},
  loading: false,
  error: '',
  toast: '',
  setWorkers: (workers) => set({ workers }),
  setAttendance: (attendance) =>
    set({
      attendanceByWorker: Object.fromEntries(
        attendance.map((item) => [item.workerId, item]),
      ),
    }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setToast: (toast) => set({ toast }),
  setWorkerAttendance: (item) =>
    set((state) => ({
      attendanceByWorker: {
        ...state.attendanceByWorker,
        [item.workerId]: item,
      },
    })),
}))
