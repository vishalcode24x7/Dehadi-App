import { useCallback } from 'react'
import * as summaryApi from '../api/summary.api'
import { useWorkerSummaryStore } from '../state/workerSummary.store'

export function useWorkerSummary() {
  const summary = useWorkerSummaryStore((state) => state.summary)
  const loading = useWorkerSummaryStore((state) => state.loading)
  const error = useWorkerSummaryStore((state) => state.error)
  const setSummary = useWorkerSummaryStore((state) => state.setSummary)
  const setLoading = useWorkerSummaryStore((state) => state.setLoading)
  const setError = useWorkerSummaryStore((state) => state.setError)

  const loadSummary = useCallback(async (from, to) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await summaryApi.getMeSummary({
        ...(from ? { from } : {}),
        ...(to ? { to } : {}),
      })
      setSummary(data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'summary.error')
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, setSummary])

  return { summary, loading, error, loadSummary }
}
