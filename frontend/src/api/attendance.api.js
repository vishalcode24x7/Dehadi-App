import axiosClient from './axiosClient'

export async function getAttendance(date) {
  const response = await axiosClient.get('/attendance', {
    params: { date },
  })
  return { data: response.data.data }
}

export async function upsertAttendance(input) {
  const response = await axiosClient.put('/attendance', input)
  return { data: response.data.data }
}
