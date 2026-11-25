export function formatDate(date) {
  if (!date) return ''
  const [year, month, day] = String(date).slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}
