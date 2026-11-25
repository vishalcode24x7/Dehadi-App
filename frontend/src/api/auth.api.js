import axiosClient from './axiosClient'

export async function register(input) {
  const response = await axiosClient.post('/auth/register', input)
  return { data: response.data.data }
}

export async function loginPin(input) {
  const response = await axiosClient.post('/auth/login-pin', input)
  return { data: response.data.data }
}

export async function getMe() {
  const response = await axiosClient.get('/auth/me')
  return { data: response.data.data }
}
