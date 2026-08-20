const DATE_TIME = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

const toDate = (value: string | null | undefined) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDateTime = (value: string | null | undefined) => {
  const date = toDate(value)
  return date ? DATE_TIME.format(date) : '—'
}

export const formatPercent = (value: number | null | undefined, digits = 0) =>
  value === null || value === undefined || !Number.isFinite(value) ? '—' : `${value.toFixed(digits)}%`

export const formatScore = (value: number | null | undefined) =>
  value === null || value === undefined || !Number.isFinite(value)
    ? '—'
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(1)
