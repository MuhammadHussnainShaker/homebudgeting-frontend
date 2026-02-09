export default function yyyyMMToISODate (monthInput) {
  if (!monthInput) return ''
  const dateString = `${monthInput}-01`
  const dateObj = new Date(dateString)
  if (Number.isNaN(dateObj.getTime())) return ''
  return dateObj.toISOString()
}
