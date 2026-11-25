import axiosClient from './axiosClient'

export async function getKhoraki(params) {
  const response = await axiosClient.get('/khoraki', { params })
  return { data: response.data.data }
}

export async function createKhoraki(input) {
  const response = await axiosClient.post('/khoraki', input)
  return { data: response.data.data }
}

export async function deleteKhoraki(id) {
  const response = await axiosClient.delete(`/khoraki/${id}`)
  return { data: response.data.data }
}
