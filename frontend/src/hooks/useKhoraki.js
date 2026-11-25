import { useCallback } from 'react'
import * as khorakiApi from '../api/khoraki.api'
import * as workersApi from '../api/workers.api'
import { useKhorakiStore } from '../state/khoraki.store'
import { useUiStore } from '../state/ui.store'

export function useKhoraki() {
  const workers = useKhorakiStore((state) => state.workers)
  const items = useKhorakiStore((state) => state.items)
  const loading = useKhorakiStore((state) => state.loading)
  const error = useKhorakiStore((state) => state.error)
  const setWorkers = useKhorakiStore((state) => state.setWorkers)
  const setItems = useKhorakiStore((state) => state.setItems)
  const setLoading = useKhorakiStore((state) => state.setLoading)
  const setError = useKhorakiStore((state) => state.setError)
  const addItem = useKhorakiStore((state) => state.addItem)
  const removeItem = useKhorakiStore((state) => state.removeItem)
  const setToast = useUiStore((state) => state.setToast)
  const toast = useUiStore((state) => state.toast)
  const clearToast = useCallback(() => setToast(''), [setToast])

  const loadKhoraki = useCallback(async (workerId) => {
    setLoading(true)
    setError('')
    try {
      const workersResult = await workersApi.getWorkers()
      setWorkers(workersResult.data)
      if (!workerId) {
        setItems([])
        return
      }
      const result = await khorakiApi.getKhoraki({ workerId })
      setItems(result.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
    } finally {
      setLoading(false)
    }
  }, [setError, setItems, setLoading, setWorkers])

  const createKhoraki = async (input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await khorakiApi.createKhoraki(input)
      addItem(data)
      setToast('khoraki.saved')
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
      setToast('khoraki.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const deleteKhoraki = async (id) => {
    setLoading(true)
    setError('')
    try {
      await khorakiApi.deleteKhoraki(id)
      removeItem(id)
      setToast('khoraki.deleted')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
      setToast('khoraki.error')
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
    loadKhoraki,
    createKhoraki,
    deleteKhoraki,
    toast,
    clearToast,
  }
}
