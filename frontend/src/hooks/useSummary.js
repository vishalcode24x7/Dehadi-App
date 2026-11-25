import { useCallback } from 'react'
import * as summaryApi from '../api/summary.api'
import * as attendanceApi from '../api/attendance.api'
import * as paymentsApi from '../api/payments.api'
import * as khorakiApi from '../api/khoraki.api'
import * as workersApi from '../api/workers.api'
import { useSummaryStore } from '../state/summary.store'

export function useSummary() {
  const workers = useSummaryStore((state) => state.workers)
  const loading = useSummaryStore((state) => state.loading)
  const error = useSummaryStore((state) => state.error)
  const setWorkers = useSummaryStore((state) => state.setWorkers)
  const setLoading = useSummaryStore((state) => state.setLoading)
  const setError = useSummaryStore((state) => state.setError)
  const setDashboard = useSummaryStore((state) => state.setDashboard)
  const todayPresent = useSummaryStore((state) => state.todayPresent)
  const todayKhoraki = useSummaryStore((state) => state.todayKhoraki)
  const totalBalance = useSummaryStore((state) => state.totalBalance)
  const totalWorkers = useSummaryStore((state) => state.totalWorkers)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const now = new Date()
      const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-')
      const [summaryResult, attendanceResult, workerResult] =
        await Promise.all([
          summaryApi.getWorkerSummaries(),
          attendanceApi.getAttendance(today),
          workersApi.getWorkers(),
        ])
      const present = attendanceResult.data.filter(
        (item) => item.status !== 'absent',
      ).length
      const khorakiResults = await Promise.all(
        workerResult.data.map((worker) =>
          khorakiApi.getKhoraki({ workerId: worker._id, from: today, to: today }),
        ),
      )
      const todayKhorakiAmount = khorakiResults.reduce(
        (total, result) =>
          total +
          result.data.reduce((sum, item) => sum + Number(item.amount), 0),
        0,
      )
      const totalBalance = summaryResult.data.reduce(
        (total, item) => total + Number(item.balance),
        0,
      )
      setWorkers(summaryResult.data)
      setDashboard(
        present,
        todayKhorakiAmount,
        totalBalance,
        workerResult.data.length,
      )
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'summary.error')
    } finally {
      setLoading(false)
    }
  }, [setDashboard, setError, setLoading, setWorkers])

  const loadSummaries = useCallback(async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await summaryApi.getWorkerSummaries(params)
      setWorkers(data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'summary.error')
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, setWorkers])

  const loadWorkerDetail = useCallback(async (workerId, from, to) => {
    setLoading(true)
    setError('')
    try {
      const dateList = []
      const cursor = new Date(`${from}T00:00:00`)
      const last = new Date(`${to}T00:00:00`)
      while (cursor <= last) {
        const year = cursor.getFullYear()
        const month = String(cursor.getMonth() + 1).padStart(2, '0')
        const day = String(cursor.getDate()).padStart(2, '0')
        dateList.push(`${year}-${month}-${day}`)
        cursor.setDate(cursor.getDate() + 1)
      }

      const [summaryResult, attendanceResults, paymentsResult, khorakiResult] =
        await Promise.all([
          summaryApi.getWorkerSummaries({ from, to }),
          Promise.all(dateList.map((date) => attendanceApi.getAttendance(date))),
          paymentsApi.getPayments({ workerId, from, to }),
          khorakiApi.getKhoraki({ workerId, from, to }),
        ])
      const summary = summaryResult.data.find(
        (item) => item.workerId === workerId,
      )
      return {
        summary,
        attendance: attendanceResults
          .flatMap((result) => result.data)
          .filter((item) => item.workerId === workerId),
        payments: paymentsResult.data,
        khoraki: khorakiResult.data,
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'summary.error')
      return null
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading])

  return {
    workers,
    loading,
    error,
    todayPresent,
    todayKhoraki,
    totalBalance,
    totalWorkers,
    loadDashboard,
    loadSummaries,
    loadWorkerDetail,
  }
}
