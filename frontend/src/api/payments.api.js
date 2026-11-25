import axiosClient from './axiosClient'

export async function getPayments(params) {
  const response = await axiosClient.get('/payments', { params })
  return { data: response.data.data }
}

export async function createPayment(input) {
  const response = await axiosClient.post('/payments', input)
  return { data: response.data.data }
}

export async function deletePayment(id) {
  const response = await axiosClient.delete(`/payments/${id}`)
  return { data: response.data.data }
}
