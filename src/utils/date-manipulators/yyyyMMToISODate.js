export default function yyyyMMToISODate (monthInput) {
  if (!monthInput) return ''
  if (!/^\d{4}-\d{2}$/.test(monthInput)) return ''
  const [year, month] = monthInput.split('-').map(Number)
  if (Number.isNaN(year) || Number.isNaN(month)) return ''
  if (month < 1 || month > 12) return ''
  const dateString = `${monthInput}-01`
  const dateObj = new Date(dateString)
  if (Number.isNaN(dateObj.getTime())) return ''
  return dateObj.toISOString()
}
