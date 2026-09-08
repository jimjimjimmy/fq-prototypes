// Date math for the Create Job drawer. Approximations for prototype use:
// "business day" treats Mon–Fri as business days (no holiday calendar yet).

export type RunBasis = 'calendar-date' | 'business-day' | 'last-day' | ''
export type RepeatUnit = 'hourly' | 'daily' | 'monthly' | 'quarterly' | 'ad-hoc' | ''

function parseISODate(iso: string): Date | null {
  if (!iso) return null
  // Force local-time interpretation by appending T00:00:00 to a YYYY-MM-DD.
  const d = new Date(`${iso}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

function isWeekday(d: Date): boolean {
  const dow = d.getDay()
  return dow !== 0 && dow !== 6
}

function lastDayOfMonth(year: number, monthIndex: number): Date {
  // monthIndex is 0-based. Day 0 of (month+1) === last day of month.
  return new Date(year, monthIndex + 1, 0)
}

function lastDayOfQuarter(year: number, monthIndex: number): Date {
  const quarter = Math.floor(monthIndex / 3) // 0..3
  const lastMonth = quarter * 3 + 2 // last month of that quarter (0-indexed)
  return lastDayOfMonth(year, lastMonth)
}

// What business day of the month is `date`? (1-indexed; weekdays only.)
export function businessDayOfMonth(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth()
  const targetDay = date.getDate()
  let count = 0
  for (let day = 1; day <= targetDay; day++) {
    const d = new Date(year, month, day)
    if (isWeekday(d)) count++
  }
  return count
}

// The Nth business day of a given month. Falls back to last business day if N exceeds.
export function nthBusinessDayOfMonth(year: number, monthIndex: number, n: number): Date {
  const last = lastDayOfMonth(year, monthIndex).getDate()
  let count = 0
  let lastWeekday: Date | null = null
  for (let day = 1; day <= last; day++) {
    const d = new Date(year, monthIndex, day)
    if (isWeekday(d)) {
      count++
      lastWeekday = d
      if (count === n) return d
    }
  }
  return lastWeekday ?? new Date(year, monthIndex, 1)
}

function addMonths(date: Date, n: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + n, 1)
  return d
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Formats a 24-hr "HH:MM" string as "H:MM AM/PM".
export function formatRunTime(runTime: string): string {
  if (!runTime) return ''
  const [hStr, mStr] = runTime.split(':')
  const h = Number(hStr)
  const m = Number(mStr)
  if (Number.isNaN(h) || Number.isNaN(m)) return runTime
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const period = h < 12 ? 'AM' : 'PM'
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Pulls the parenthesized short code from a timezone label
// (e.g. "Eastern Time (ET)" → "ET", "UTC" → "UTC").
export function shortTimezoneCode(label: string | undefined): string {
  if (!label) return ''
  const match = label.match(/\(([^)]+)\)$/)
  if (match) return match[1].split('/')[0].trim()
  return label
}

// The "anchor day" displayed alongside the basis dropdown (e.g. "27" for
// calendar-date, "3" for business-day, or null for last-day).
export function getAnchorDay(initialDate: Date | null, basis: RunBasis): number | null {
  if (!initialDate) return null
  if (basis === 'calendar-date') return initialDate.getDate()
  if (basis === 'business-day') return businessDayOfMonth(initialDate)
  return null // last-day has no anchor day
}

// Compute the next run date given an initial date + repeat unit + basis.
// Returns null when there isn't enough info to compute.
export function computeNextRunDate(
  initialISO: string,
  unit: RepeatUnit,
  basis: RunBasis,
): Date | null {
  const initial = parseISODate(initialISO)
  if (!initial) return null

  // Hourly/Daily/Ad Hoc don't have a meaningful "next run by basis" — just
  // show the day after for daily, the same day for hourly (driven by Run
  // Time), and the same day for ad-hoc.
  if (unit === 'hourly' || unit === 'ad-hoc') return initial
  if (unit === 'daily') {
    const next = new Date(initial)
    next.setDate(next.getDate() + 1)
    return next
  }

  if (unit === 'monthly') {
    const nextMonth = addMonths(initial, 1)
    return resolveDateInMonth(nextMonth, initial, basis)
  }

  if (unit === 'quarterly') {
    const nextQuarter = addMonths(initial, 3)
    return resolveDateInMonth(nextQuarter, initial, basis, /* quarter */ true)
  }

  return null
}

function resolveDateInMonth(
  targetMonth: Date,
  initial: Date,
  basis: RunBasis,
  quarterly = false,
): Date {
  const year = targetMonth.getFullYear()
  const monthIndex = targetMonth.getMonth()

  if (basis === 'last-day') {
    return quarterly ? lastDayOfQuarter(year, monthIndex) : lastDayOfMonth(year, monthIndex)
  }

  if (basis === 'business-day') {
    const n = businessDayOfMonth(initial)
    return nthBusinessDayOfMonth(year, monthIndex, n)
  }

  // calendar-date (default)
  const day = initial.getDate()
  const last = lastDayOfMonth(year, monthIndex).getDate()
  return new Date(year, monthIndex, Math.min(day, last))
}
