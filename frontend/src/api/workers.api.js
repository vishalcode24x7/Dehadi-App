import axiosClient from './axiosClient'

export async function getWorkers() {
  const response = await axiosClient.get('/workers')
  return { data: response.data.data }
}

export async function createWorker(input) {
  const response = await axiosClient.post('/workers', input)
  return { data: response.data.data }
}

export async function updateWorker(id, input) {
  const response = await axiosClient.put(`/workers/${id}`, input)
  return { data: response.data.data }
}

export async function resetWorkerPin(id, pin) {
  const response = await axiosClient.put(`/workers/${id}/pin`, { pin })
  return { data: response.data.data }
}

export async function deleteWorker(id) {
  const response = await axiosClient.delete(`/workers/${id}`)
  return { data: response.data.data }
}
