import axiosClient from './axiosClient'

export async function getKhorakiGroups() {
  const response = await axiosClient.get('/khoraki/groups')
  return { data: response.data.data }
}

export async function createKhorakiGroup(input) {
  const response = await axiosClient.post('/khoraki/groups', input)
  return { data: response.data.data }
}

export async function addKhorakiGroupEntry(id, input) {
  const response = await axiosClient.post(
    `/khoraki/groups/${id}/entries`,
    input,
  )
  return { data: response.data.data }
}

export async function divideKhorakiGroup(id, date) {
  const response = await axiosClient.post(`/khoraki/groups/${id}/divide`, {
    date,
  })
  return { data: response.data.data }
}
