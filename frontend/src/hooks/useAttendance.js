import { useCallback } from 'react'
import * as attendanceApi from '../api/attendance.api'
import * as workersApi from '../api/workers.api'
import { useAttendanceStore } from '../state/attendance.store'
import { useUiStore } from '../state/ui.store'

export function useAttendance() {
  const workers = useAttendanceStore((state) => state.workers)
  const attendanceByWorker = useAttendanceStore(
    (state) => state.attendanceByWorker,
  )
  const loading = useAttendanceStore((state) => state.loading)
  const error = useAttendanceStore((state) => state.error)
  const setWorkers = useAttendanceStore((state) => state.setWorkers)
  const setAttendance = useAttendanceStore((state) => state.setAttendance)
  const setLoading = useAttendanceStore((state) => state.setLoading)
  const setError = useAttendanceStore((state) => state.setError)
  const setWorkerAttendance = useAttendanceStore(
    (state) => state.setWorkerAttendance,
  )
  const setToast = useUiStore((state) => state.setToast)
  const toast = useUiStore((state) => state.toast)
  const clearToast = () => setToast('')

  const loadAttendance = useCallback(async (date) => {
    setLoading(true)
    setError('')
    try {
      const [workersResult, attendanceResult] = await Promise.all([
        workersApi.getWorkers(),
        attendanceApi.getAttendance(date),
      ])
      setWorkers(workersResult.data)
      setAttendance(attendanceResult.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'attendance.error')
    } finally {
      setLoading(false)
    }
  }, [setAttendance, setError, setLoading, setWorkers])

  const saveAttendance = async ({ workerId, date, status, note }) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await attendanceApi.upsertAttendance({
        workerId,
        date,
        status,
        note,
      })
      setWorkerAttendance(data)
      setToast('attendance.saved')
      return data
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || 'attendance.error'
      setError(message)
      setToast('attendance.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    workers,
    attendanceByWorker,
    loading,
    error,
    loadAttendance,
    saveAttendance,
    toast,
    clearToast,
  }
}
