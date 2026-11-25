import { useCallback } from 'react'
import * as groupsApi from '../api/khorakiGroups.api'
import * as workersApi from '../api/workers.api'
import { useKhorakiGroupsStore } from '../state/khorakiGroups.store'
import { useUiStore } from '../state/ui.store'

export function useKhorakiGroups() {
  const groups = useKhorakiGroupsStore((state) => state.groups)
  const workers = useKhorakiGroupsStore((state) => state.workers)
  const loading = useKhorakiGroupsStore((state) => state.loading)
  const error = useKhorakiGroupsStore((state) => state.error)
  const setGroups = useKhorakiGroupsStore((state) => state.setGroups)
  const setWorkers = useKhorakiGroupsStore((state) => state.setWorkers)
  const setLoading = useKhorakiGroupsStore((state) => state.setLoading)
  const setError = useKhorakiGroupsStore((state) => state.setError)
  const addGroup = useKhorakiGroupsStore((state) => state.addGroup)
  const updateGroup = useKhorakiGroupsStore((state) => state.updateGroup)
  const setToast = useUiStore((state) => state.setToast)

  const loadGroups = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [groupsResult, workersResult] = await Promise.all([
        groupsApi.getKhorakiGroups(),
        workersApi.getWorkers(),
      ])
      setGroups(groupsResult.data)
      setWorkers(workersResult.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
      setToast('khoraki.error')
    } finally {
      setLoading(false)
    }
  }, [setError, setGroups, setLoading, setToast, setWorkers])

  const createGroup = async (input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await groupsApi.createKhorakiGroup(input)
      addGroup(data)
      setToast('khoraki.groupCreated')
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
      setToast('khoraki.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const addGroupEntry = async (id, input) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await groupsApi.addKhorakiGroupEntry(id, input)
      updateGroup(data)
      setToast('khoraki.entryAdded')
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
      setToast('khoraki.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const divideGroup = async (id, date) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await groupsApi.divideKhorakiGroup(id, date)
      updateGroup(data)
      setToast('khoraki.groupDivided')
      return data
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'khoraki.error')
      setToast('khoraki.error')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  return {
    groups,
    workers,
    loading,
    error,
    loadGroups,
    createGroup,
    addGroupEntry,
    divideGroup,
  }
}
