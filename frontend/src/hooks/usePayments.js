import { useCallback } from 'react'
import * as paymentsApi from '../api/payments.api'
import * as workersApi from '../api/workers.api'
import { usePaymentsStore } from '../state/payments.store'
import { useUiStore } from '../state/ui.store'

export function usePayments() {
  const workers = usePaymentsStore((state) => state.workers)
  const items = usePaymentsStore((state) => state.items)
  const loading = usePaymentsStore((state) => state.loading)
  const error = usePaymentsStore((state) => state.error)
  const setWorkers = usePaymentsStore((state) => state.setWorkers)
  const setItems = usePaymentsStore((state) => state.setItems)
  const setLoading = usePaymentsStore((state) => state.setLoading)
  const setError = usePaymentsStore((state) => state.setError)
  const addItem = usePaymentsStore((state) => state.addItem)
  const removeItem = usePaymentsStore((state) => state.removeItem)
  const setToast = useUiStore((state) => state.setToast)
  const toast = useUiStore((state) => state.toast)
  const clearToast = useCallback(() => setToast(''), [setToast])

  const loadPayments = useCallback(async (workerId) => {
    setLoading(true)
    setError('')
    try {
      const workersResult = await workersApi.getWorkers()
      setWorkers(workersResult.data)
      if (!workerId) {
        setItems([])
        return
      }
      const result = await paymentsApi.getPayments({ workerId })
      setItems(result.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'payments.error')
    } finally {
      setLoading(false)
    }
  }, [setError, setItems, setLoading, setWorkers])

  const createPayment = async (input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await paymentsApi.createPayment(input)
      addItem(data)
      setToast('payments.saved')
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'payments.error')
      setToast('payments.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const deletePayment = async (id) => {
    setLoading(true)
    setError('')
    try {
      await paymentsApi.deletePayment(id)
      removeItem(id)
      setToast('payments.deleted')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'payments.error')
      setToast('payments.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    workers,
    items,
    loading,
    error,
    loadPayments,
    createPayment,
    deletePayment,
    toast,
    clearToast,
  }
}
