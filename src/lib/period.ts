const DAY_MONTH = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const DAY_MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const parseDay = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), 1)
  next.setMonth(next.getMonth() + months)
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(date.getDate(), lastDay))
  return next
}

export function chakraPeriod(
  startDate: string | null | undefined,
  month: number | null,
  totalMonths: number,
): string | null {
  if (!startDate) return null
  const start = parseDay(startDate)
  if (!start) return null

  const from = addMonths(start, month === null ? 0 : month - 1)
  const to = addMonths(start, month === null ? totalMonths : month)
  return `${DAY_MONTH.format(from)} – ${DAY_MONTH_YEAR.format(to)}`
}
