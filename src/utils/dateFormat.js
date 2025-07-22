export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr

  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month}-${day}`
  }
  const d = new Date(dateStr)
  if (!isNaN(d)) {
    return d.toISOString().split('T')[0]
  }
  return ''
}

export const formatDateForPayload = (dateStr) => {
  if (!dateStr) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month}-${day}`
  }
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0]
  }
  return null 
}
