import axiosClient from './axiosClient'

export async function getWorkerSummaries(params = {}) {
  const response = await axiosClient.get('/summary/workers', { params })
  return { data: response.data.data }
}

export async function getMeSummary(params = {}) {
  const response = await axiosClient.get('/me/summary', { params })
  return { data: response.data.data }
}
