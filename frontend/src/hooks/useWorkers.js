import { useCallback } from 'react'
import * as workersApi from '../api/workers.api'
import { useWorkersStore } from '../state/workers.store'

export function useWorkers() {
  const workers = useWorkersStore((state) => state.workers)
  const loading = useWorkersStore((state) => state.loading)
  const error = useWorkersStore((state) => state.error)
  const setWorkers = useWorkersStore((state) => state.setWorkers)
  const setLoading = useWorkersStore((state) => state.setLoading)
  const setError = useWorkersStore((state) => state.setError)
  const addWorker = useWorkersStore((state) => state.addWorker)
  const replaceWorker = useWorkersStore((state) => state.replaceWorker)
  const removeWorker = useWorkersStore((state) => state.removeWorker)

  const loadWorkers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await workersApi.getWorkers()
      setWorkers(data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'workers.error')
    } finally {
      setLoading(false)
    }
  }, [setError, setLoading, setWorkers])

  const createWorker = async (input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await workersApi.createWorker(input)
      addWorker(data)
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'workers.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const updateWorker = async (id, input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await workersApi.updateWorker(id, input)
      replaceWorker(data)
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'workers.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const resetWorkerPin = async (id, pin) => {
    setLoading(true)
    setError('')
    try {
      await workersApi.resetWorkerPin(id, pin)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'workers.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const deleteWorker = async (id) => {
    setLoading(true)
    setError('')
    try {
      await workersApi.deleteWorker(id)
      removeWorker(id)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'workers.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    workers,
    loading,
    error,
    loadWorkers,
    createWorker,
    updateWorker,
    resetWorkerPin,
    deleteWorker,
  }
}
