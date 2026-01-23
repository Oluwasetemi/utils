import { Temporal } from 'temporal-polyfill'
import { uniq } from './array'

/**
 * Get the current timestamp as a number
 *
 * @category Time
 */
export function timestamp() {
  return +Date.now()
}

// TODO: add more time utilities(new date time in javascript - Temporal)
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal

/**
 * Create a PlainDate from various input formats
 *
 * @category Time
 * @param input - String, Date, or PlainDate to convert
 * @returns A Temporal.PlainDate object
 * @example
 * ```
 * createDate('2023-01-01')
 * createDate(new Date())
 * createDate(Temporal.PlainDate.from('2023-01-01'))
 * ```
 */
export function createDate<T extends string | Date | Temporal.PlainDate>(input: T): Temporal.PlainDate {
  return Temporal.PlainDate.from(input as string | Temporal.PlainDate | Temporal.PlainDateLike)
}
/**
 * Create a PlainDateTime from various input formats
 *
 * @category Time
 * @param input - String, Date, or PlainDateTime to convert
 * @returns A Temporal.PlainDateTime object
 * @example
 * ```
 * createDateTime('2023-01-01T10:30:00')
 * createDateTime(new Date())
 * ```
 */
export function createDateTime<T extends string | Date | Temporal.PlainDateTime>(input: T): Temporal.PlainDateTime {
  return Temporal.PlainDateTime.from(input as string | Temporal.PlainDateTime | Temporal.PlainDateTimeLike)
}
/**
 * Create a PlainTime from various input formats
 *
 * @category Time
 * @param input - String, Date, or PlainTime to convert
 * @returns A Temporal.PlainTime object
 * @example
 * ```
 * createTime('10:30:00')
 * createTime(new Date())
 * ```
 */
export function createTime<T extends string | Date | Temporal.PlainTime>(input: T): Temporal.PlainTime {
  return Temporal.PlainTime.from(input as string | Temporal.PlainTime | Temporal.PlainTimeLike)
}
/**
 * Create a ZonedDateTime from various input formats
 *
 * @category Time
 * @param input - String, Date, or ZonedDateTime to convert
 * @returns A Temporal.ZonedDateTime object
 * @example
 * ```
 * createZonedDateTime('2023-01-01T10:30:00[America/New_York]')
 * createZonedDateTime(new Date())
 * ```
 */
export function createZonedDateTime<T extends string | Date | Temporal.ZonedDateTime>(input: T): Temporal.ZonedDateTime {
  return Temporal.ZonedDateTime.from(input as string | Temporal.ZonedDateTime | Temporal.ZonedDateTimeLike)
}

/**
 * Parse an ISO date string into a PlainDate
 *
 * @category Time
 * @param isoString - ISO date string to parse
 * @returns A Temporal.PlainDate object
 * @example
 * ```
 * parseISODate('2023-01-01')
 * parseISODate('2023-12-25')
 * ```
 */
export function parseISODate<T extends string | Date | Temporal.PlainDate>(isoString: T): Temporal.PlainDate {
  return Temporal.PlainDate.from(isoString as string | Temporal.PlainDate | Temporal.PlainDateLike)
}
/**
 * Parse an ISO datetime string into a PlainDateTime
 *
 * @category Time
 * @param isoString - ISO datetime string to parse
 * @returns A Temporal.PlainDateTime object
 * @example
 * ```
 * parseISODateTime('2023-01-01T10:30:00')
 * parseISODateTime('2023-12-25T15:45:30')
 * ```
 */
export function parseISODateTime<T extends string | Date | Temporal.PlainDateTime>(isoString: T): Temporal.PlainDateTime {
  return Temporal.PlainDateTime.from(isoString as string | Temporal.PlainDateTime | Temporal.PlainDateTimeLike)
}
/**
 * Parse an ISO time string into a PlainTime
 *
 * @category Time
 * @param isoString - ISO time string to parse
 * @returns A Temporal.PlainTime object
 * @example
 * ```
 * parseISOTime('10:30:00')
 * parseISOTime('15:45:30')
 * ```
 */
export function parseISOTime<T extends string | Date | Temporal.PlainTime>(isoString: T): Temporal.PlainTime {
  return Temporal.PlainTime.from(isoString as string | Temporal.PlainTime | Temporal.PlainTimeLike)
}

/**
 * Format a PlainDate in various styles
 *
 * @category Time
 * @param date - The date to format
 * @param format - Format style: 'short', 'long', or 'iso'
 * @returns Formatted date string
 * @example
 * ```
 * formatDate(Temporal.PlainDate.from('2023-01-01'), 'short') // '1/1/23'
 * formatDate(Temporal.PlainDate.from('2023-01-01'), 'long') // 'January 1, 2023'
 * formatDate(Temporal.PlainDate.from('2023-01-01'), 'iso') // '2023-01-01'
 * ```
 */
export function formatDate<T extends Temporal.PlainDate>(date: T, format: 'short' | 'long' | 'iso'): string {
  if (format === 'iso') {
    return date.toString()
  }
  const options: Intl.DateTimeFormatOptions = format === 'short'
    ? { dateStyle: 'short' }
    : { dateStyle: 'long' }
  return date.toLocaleString(undefined, options)
}

/**
 * Format a PlainDateTime in various styles
 *
 * @category Time
 * @param dateTime - The datetime to format
 * @param format - Format style: 'short', 'long', or 'iso'
 * @returns Formatted datetime string
 * @example
 * ```
 * formatDateTime(Temporal.PlainDateTime.from('2023-01-01T10:30:00'), 'short')
 * formatDateTime(Temporal.PlainDateTime.from('2023-01-01T10:30:00'), 'long')
 * formatDateTime(Temporal.PlainDateTime.from('2023-01-01T10:30:00'), 'iso')
 * ```
 */
export function formatDateTime<T extends Temporal.PlainDateTime>(dateTime: T, format: 'short' | 'long' | 'iso'): string {
  if (format === 'iso') {
    return dateTime.toString()
  }
  const options: Intl.DateTimeFormatOptions = format === 'short'
    ? { dateStyle: 'short', timeStyle: 'short' }
    : { dateStyle: 'long', timeStyle: 'long' }
  return dateTime.toLocaleString(undefined, options)
}

/**
 * Format a PlainTime in 12-hour or 24-hour format
 *
 * @category Time
 * @param time - The time to format
 * @param format - Format style: '12h' or '24h'
 * @returns Formatted time string
 * @example
 * ```
 * formatTime(Temporal.PlainTime.from('10:30:00'), '12h') // '10:30 AM'
 * formatTime(Temporal.PlainTime.from('10:30:00'), '24h') // '10:30'
 * ```
 */
export function formatTime<T extends Temporal.PlainTime>(time: T, format: '12h' | '24h'): string {
  const options: Intl.DateTimeFormatOptions = format === '12h'
    ? { hour: 'numeric', minute: 'numeric', hour12: true }
    : { hour: 'numeric', minute: 'numeric', hour12: false }
  return time.toLocaleString(undefined, options)
}

/**
 * Format a date/time as relative to now (e.g., "2 days ago", "tomorrow")
 *
 * @category Time
 * @param date - The date to format relative to now
 * @returns Relative time string
 * @example
 * ```
 * formatRelative(Temporal.PlainDate.from('2023-01-01')) // "2 days ago"
 * formatRelative(Temporal.PlainDate.from('2023-12-31')) // "tomorrow"
 * ```
 */
export function formatRelative<T extends Temporal.PlainDate | Temporal.PlainDateTime>(date: T): string {
  const now = 'toPlainDate' in date ? Temporal.Now.plainDateTimeISO() : Temporal.Now.plainDateISO()
  const duration = (now as any).since(date)
  const days = Math.abs(duration.total('day'))

  if (days < 1)
    return 'today'
  if (days < 2)
    return duration.sign < 0 ? 'tomorrow' : 'yesterday'
  if (days < 7)
    return `${Math.floor(days)} days ${duration.sign < 0 ? 'from now' : 'ago'}`
  if (days < 30)
    return `${Math.floor(days / 7)} weeks ${duration.sign < 0 ? 'from now' : 'ago'}`
  if (days < 365)
    return `${Math.floor(days / 30)} months ${duration.sign < 0 ? 'from now' : 'ago'}`
  return `${Math.floor(days / 365)} years ${duration.sign < 0 ? 'from now' : 'ago'}`
}

/**
 * Format a date as relative to another date
 *
 * @category Time
 * @param date - The date to format
 * @param reference - The reference date
 * @returns Relative time string
 * @example
 * ```
 * formatRelativeTo(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-05')
 * ) // "4 days earlier"
 * ```
 */
export function formatRelativeTo<T extends Temporal.PlainDate>(date: T, reference: T): string {
  const duration = reference.since(date)
  const days = Math.abs(duration.total('day'))

  if (days < 1)
    return 'same day'
  if (days < 2)
    return duration.sign < 0 ? 'next day' : 'previous day'
  if (days < 7)
    return `${Math.floor(days)} days ${duration.sign < 0 ? 'later' : 'earlier'}`
  if (days < 30)
    return `${Math.floor(days / 7)} weeks ${duration.sign < 0 ? 'later' : 'earlier'}`
  if (days < 365)
    return `${Math.floor(days / 30)} months ${duration.sign < 0 ? 'later' : 'earlier'}`
  return `${Math.floor(days / 365)} years ${duration.sign < 0 ? 'later' : 'earlier'}`
}

/**
 * Add days to a date
 *
 * @category Time
 * @param date - The base date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 * @example
 * ```
 * addDays(Temporal.PlainDate.from('2023-01-01'), 5) // 2023-01-06
 * addDays(Temporal.PlainDate.from('2023-01-01'), -5) // 2022-12-27
 * ```
 */
export function addDays(date: Temporal.PlainDate, days: number): Temporal.PlainDate {
  return date.add({ days })
}

/**
 * Add months to a date
 *
 * @category Time
 * @param date - The base date
 * @param months - Number of months to add (can be negative)
 * @returns New date with months added
 * @example
 * ```
 * addMonths(Temporal.PlainDate.from('2023-01-01'), 2) // 2023-03-01
 * addMonths(Temporal.PlainDate.from('2023-01-31'), 1) // 2023-02-28
 * ```
 */
export function addMonths(date: Temporal.PlainDate, months: number): Temporal.PlainDate {
  return date.add({ months })
}

/**
 * Add years to a date
 *
 * @category Time
 * @param date - The base date
 * @param years - Number of years to add (can be negative)
 * @returns New date with years added
 * @example
 * ```
 * addYears(Temporal.PlainDate.from('2023-01-01'), 1) // 2024-01-01
 * addYears(Temporal.PlainDate.from('2020-02-29'), 1) // 2021-02-28
 * ```
 */
export function addYears(date: Temporal.PlainDate, years: number): Temporal.PlainDate {
  return date.add({ years })
}

/**
 * Add hours to a datetime
 *
 * @category Time
 * @param dateTime - The base datetime
 * @param hours - Number of hours to add (can be negative)
 * @returns New datetime with hours added
 * @example
 * ```
 * addHours(Temporal.PlainDateTime.from('2023-01-01T10:30:00'), 2) // 2023-01-01T12:30:00
 * addHours(Temporal.PlainDateTime.from('2023-01-01T10:30:00'), -3) // 2023-01-01T07:30:00
 * ```
 */
export function addHours(dateTime: Temporal.PlainDateTime, hours: number): Temporal.PlainDateTime {
  return dateTime.add({ hours })
}

/**
 * Calculate the number of days between two dates
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days between dates
 * @example
 * ```
 * daysBetween(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-05')
 * ) // 4
 * ```
 */
export function daysBetween(date1: Temporal.PlainDate, date2: Temporal.PlainDate): number {
  return date1.until(date2).days
}

/**
 * Calculate the number of months between two dates
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of months between dates
 * @example
 * ```
 * monthsBetween(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-03-01')
 * ) // 2
 * ```
 */
export function monthsBetween(date1: Temporal.PlainDate, date2: Temporal.PlainDate): number {
  return date1.until(date2, { largestUnit: 'month' }).months
}

/**
 * Calculate the number of years between two dates
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of years between dates
 * @example
 * ```
 * yearsBetween(
 *   Temporal.PlainDate.from('2020-01-01'),
 *   Temporal.PlainDate.from('2023-01-01')
 * ) // 3
 * ```
 */
export function yearsBetween(date1: Temporal.PlainDate, date2: Temporal.PlainDate): number {
  return date1.until(date2, { largestUnit: 'year' }).years
}

/**
 * Check if a year, month, day combination is valid
 *
 * @category Time
 * @param year - Year to validate
 * @param month - Month to validate (1-12)
 * @param day - Day to validate
 * @returns True if the date is valid
 * @example
 * ```
 * isValidDate(2023, 1, 31) // true
 * isValidDate(2023, 2, 29) // false (not a leap year)
 * isValidDate(2023, 13, 1) // false (invalid month)
 * ```
 */
export function isValidDate(year: number, month: number, day: number): boolean {
  try {
    Temporal.PlainDate.from({ year, month, day })
    return true
  }
  catch {
    return false
  }
}

/**
 * Check if an hour, minute, second combination is valid
 *
 * @category Time
 * @param hour - Hour to validate (0-23)
 * @param minute - Minute to validate (0-59)
 * @param second - Second to validate (0-59)
 * @returns True if the time is valid
 * @example
 * ```
 * isValidTime(10, 30, 45) // true
 * isValidTime(25, 0, 0) // false (invalid hour)
 * isValidTime(10, 60, 0) // false (invalid minute)
 * ```
 */
export function isValidTime(hour: number, minute: number, second: number): boolean {
  try {
    Temporal.PlainTime.from({ hour, minute, second })
    return true
  }
  catch {
    return false
  }
}

/**
 * Check if a year is a leap year
 *
 * @category Time
 * @param year - Year to check
 * @returns True if the year is a leap year
 * @example
 * ```
 * isLeapYear(2020) // true
 * isLeapYear(2021) // false
 * isLeapYear(2000) // true (divisible by 400)
 * isLeapYear(1900) // false (divisible by 100 but not 400)
 * ```
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/**
 * Check if two dates are the same day
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if the dates are the same
 * @example
 * ```
 * isSameDay(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-01')
 * ) // true
 * ```
 */
export function isSameDay(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean {
  return date1.equals(date2)
}

/**
 * Check if two dates are in the same month
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if the dates are in the same month
 * @example
 * ```
 * isSameMonth(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-15')
 * ) // true
 * ```
 */
export function isSameMonth(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean {
  return date1.year === date2.year && date1.month === date2.month
}

/**
 * Check if two dates are in the same year
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if the dates are in the same year
 * @example
 * ```
 * isSameYear(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-12-31')
 * ) // true
 * ```
 */
export function isSameYear(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean {
  return date1.year === date2.year
}

/**
 * Check if the first date is before the second date
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if date1 is before date2
 * @example
 * ```
 * isBefore(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-02')
 * ) // true
 * ```
 */
export function isBefore(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(date1, date2) < 0
}

/**
 * Check if the first date is after the second date
 *
 * @category Time
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if date1 is after date2
 * @example
 * ```
 * isAfter(
 *   Temporal.PlainDate.from('2023-01-02'),
 *   Temporal.PlainDate.from('2023-01-01')
 * ) // true
 * ```
 */
export function isAfter(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(date1, date2) > 0
}

/**
 * Get the start of a day (00:00:00) as a PlainDateTime
 *
 * @category Time
 * @param date - The date to get the start of
 * @returns PlainDateTime at 00:00:00 of the given date
 * @example
 * ```
 * getStartOfDay(Temporal.PlainDate.from('2023-01-01')) // 2023-01-01T00:00:00
 * ```
 */
export function getStartOfDay(date: Temporal.PlainDate): Temporal.PlainDateTime {
  return date.toPlainDateTime(Temporal.PlainTime.from({ hour: 0, minute: 0, second: 0 }))
}

/**
 * Get the end of a day (23:59:59) as a PlainDateTime
 *
 * @category Time
 * @param date - The date to get the end of
 * @returns PlainDateTime at 23:59:59 of the given date
 * @example
 * ```
 * getEndOfDay(Temporal.PlainDate.from('2023-01-01')) // 2023-01-01T23:59:59
 * ```
 */
export function getEndOfDay(date: Temporal.PlainDate): Temporal.PlainDateTime {
  return date.toPlainDateTime(Temporal.PlainTime.from({ hour: 23, minute: 59, second: 59 }))
}

// export function getStartOfMonth(date: Temporal.PlainDate): Temporal.PlainDate {
//   return date.with({ day: 1 })
// }

// export function getEndOfMonth(date: Temporal.PlainDate): Temporal.PlainDate {
//   return date.with({ day: date.daysInMonth })
// }

/**
 * Get the first day of the year for a given date
 *
 * @category Time
 * @param date - The date to get the year start for
 * @returns PlainDate representing January 1st of the year
 * @example
 * ```
 * getStartOfYear(Temporal.PlainDate.from('2023-06-15')) // 2023-01-01
 * ```
 */
export function getStartOfYear(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.with({ month: 1, day: 1 })
}

/**
 * Get the last day of the year for a given date
 *
 * @category Time
 * @param date - The date to get the year end for
 * @returns PlainDate representing December 31st of the year
 * @example
 * ```
 * getEndOfYear(Temporal.PlainDate.from('2023-06-15')) // 2023-12-31
 * ```
 */
export function getEndOfYear(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.with({ month: 12, day: 31 })
}

/**
 * Get the first day of the month for a given date
 *
 * @category Time
 * @param date - The date to get the month start for
 * @returns PlainDate representing the 1st day of the month
 * @example
 * ```
 * getFirstDayOfMonth(Temporal.PlainDate.from('2023-06-15')) // 2023-06-01
 * ```
 */
export function getFirstDayOfMonth(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.with({ day: 1 })
}

/**
 * Get the last day of the month for a given date
 *
 * @category Time
 * @param date - The date to get the month end for
 * @returns PlainDate representing the last day of the month
 * @example
 * ```
 * getLastDayOfMonth(Temporal.PlainDate.from('2023-06-15')) // 2023-06-30
 * getLastDayOfMonth(Temporal.PlainDate.from('2023-02-15')) // 2023-02-28
 * ```
 */
export function getLastDayOfMonth(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.with({ day: date.daysInMonth })
}

/**
 * Get the first day of the year for a given date
 *
 * @category Time
 * @param date - The date to get the year start for
 * @returns PlainDate representing January 1st of the year
 * @example
 * ```
 * getFirstDayOfYear(Temporal.PlainDate.from('2023-06-15')) // 2023-01-01
 * ```
 */
export function getFirstDayOfYear(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.with({ month: 1, day: 1 })
}

/**
 * Get the last day of the year for a given date
 *
 * @category Time
 * @param date - The date to get the year end for
 * @returns PlainDate representing December 31st of the year
 * @example
 * ```
 * getLastDayOfYear(Temporal.PlainDate.from('2023-06-15')) // 2023-12-31
 * ```
 */
export function getLastDayOfYear(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.with({ month: 12, day: 31 })
}

/**
 * Generate an array of dates between start and end (inclusive)
 *
 * @category Time
 * @param start - Start date
 * @param end - End date
 * @returns Array of PlainDate objects
 * @example
 * ```
 * dateRange(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-03')
 * ) // [2023-01-01, 2023-01-02, 2023-01-03]
 * ```
 */
export function dateRange(start: Temporal.PlainDate, end: Temporal.PlainDate): Temporal.PlainDate[] {
  const result: Temporal.PlainDate[] = []
  let current = start
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    result.push(current)
    current = current.add({ days: 1 })
  }
  return result
}

/**
 * Generate an array of year-months between start and end (inclusive)
 *
 * @category Time
 * @param start - Start year-month
 * @param end - End year-month
 * @returns Array of PlainYearMonth objects
 * @example
 * ```
 * monthRange(
 *   Temporal.PlainYearMonth.from('2023-01'),
 *   Temporal.PlainYearMonth.from('2023-03')
 * ) // [2023-01, 2023-02, 2023-03]
 * ```
 */
export function monthRange(start: Temporal.PlainYearMonth, end: Temporal.PlainYearMonth): Temporal.PlainYearMonth[] {
  const result: Temporal.PlainYearMonth[] = []
  let current = start
  while (Temporal.PlainYearMonth.compare(current, end) <= 0) {
    result.push(current)
    current = current.add({ months: 1 })
  }
  return result
}

/**
 * Generate an array of years between start and end (inclusive)
 *
 * @category Time
 * @param start - Start year
 * @param end - End year
 * @returns Array of year numbers
 * @example
 * ```
 * yearRange(2020, 2023) // [2020, 2021, 2022, 2023]
 * ```
 */
export function yearRange(start: number, end: number): number[] {
  const result: number[] = []
  for (let year = start; year <= end; year++) {
    result.push(year)
  }
  return result
}

/**
 * Generator function to iterate over dates between start and end (inclusive)
 *
 * @category Time
 * @param start - Start date
 * @param end - End date
 * @yields PlainDate objects one by one
 * @example
 * ```
 * for (const day of eachDay(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-03')
 * )) {
 *   console.log(day.toString())
 * }
 * ```
 */
export function* eachDay(start: Temporal.PlainDate, end: Temporal.PlainDate): Generator<Temporal.PlainDate> {
  let current = start
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    yield current
    current = current.add({ days: 1 })
  }
}

/**
 * Generator function to iterate over year-months between start and end (inclusive)
 *
 * @category Time
 * @param start - Start year-month
 * @param end - End year-month
 * @yields PlainYearMonth objects one by one
 * @example
 * ```
 * for (const month of eachMonth(
 *   Temporal.PlainYearMonth.from('2023-01'),
 *   Temporal.PlainYearMonth.from('2023-03')
 * )) {
 *   console.log(month.toString())
 * }
 * ```
 */
export function* eachMonth(start: Temporal.PlainYearMonth, end: Temporal.PlainYearMonth): Generator<Temporal.PlainYearMonth> {
  let current = start
  while (Temporal.PlainYearMonth.compare(current, end) <= 0) {
    yield current
    current = current.add({ months: 1 })
  }
}

/**
 * Generator function to iterate over years between start and end (inclusive)
 *
 * @category Time
 * @param start - Start year
 * @param end - End year
 * @yields Year numbers one by one
 * @example
 * ```
 * for (const year of eachYear(2020, 2023)) {
 *   console.log(year)
 * }
 * ```
 */
export function* eachYear(start: number, end: number): Generator<number> {
  for (let year = start; year <= end; year++) {
    yield year
  }
}

/**
 * Convert a PlainDateTime to a ZonedDateTime in the specified timezone
 *
 * @category Time
 * @param dateTime - The datetime to convert
 * @param timeZone - Target timezone (e.g., "America/New_York")
 * @returns ZonedDateTime in the specified timezone
 * @example
 * ```
 * convertToTimeZone(
 *   Temporal.PlainDateTime.from('2023-01-01T10:00:00'),
 *   'America/New_York'
 * )
 * ```
 */
export function convertToTimeZone(dateTime: Temporal.PlainDateTime, timeZone: string): Temporal.ZonedDateTime {
  return dateTime.toZonedDateTime(timeZone)
}

/**
 * Convert a ZonedDateTime to a different timezone
 *
 * @category Time
 * @param zonedDateTime - The zoned datetime to convert
 * @param timeZone - Target timezone (e.g., "America/New_York")
 * @returns ZonedDateTime in the new timezone
 * @example
 * ```
 * convertFromTimeZone(
 *   Temporal.ZonedDateTime.from('2023-01-01T10:00:00[America/Los_Angeles]'),
 *   'America/New_York'
 * )
 * ```
 */
export function convertFromTimeZone(zonedDateTime: Temporal.ZonedDateTime, timeZone: string): Temporal.ZonedDateTime {
  return zonedDateTime.withTimeZone(timeZone)
}

/**
 * Get the current system timezone
 *
 * @category Time
 * @returns Current timezone identifier
 * @example
 * ```
 * getCurrentTimeZone() // "America/New_York"
 * ```
 */
export function getCurrentTimeZone(): string {
  return Temporal.Now.timeZoneId()
}

/**
 * Get all available timezone identifiers
 *
 * @category Time
 * @returns Array of timezone identifiers
 * @example
 * ```
 * getAvailableTimeZones() // ["America/New_York", "Europe/London", ...]
 * ```
 */
export function getAvailableTimeZones(): string[] {
  return Intl.supportedValuesOf('timeZone')
}

/**
 * Get the current date and time in a specific timezone
 *
 * @category Time
 * @param timeZone - Target timezone (e.g., "America/New_York")
 * @returns Current ZonedDateTime in the specified timezone
 * @example
 * ```
 * nowInTimeZone('America/New_York')
 * nowInTimeZone('Europe/London')
 * ```
 */
export function nowInTimeZone(timeZone: string): Temporal.ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO(timeZone)
}

/**
 * Get today's date in a specific timezone
 *
 * @category Time
 * @param timeZone - Target timezone (e.g., "America/New_York")
 * @returns Today's PlainDate in the specified timezone
 * @example
 * ```
 * todayInTimeZone('America/New_York')
 * todayInTimeZone('Europe/London')
 * ```
 */
export function todayInTimeZone(timeZone: string): Temporal.PlainDate {
  return Temporal.Now.plainDateISO(timeZone)
}

/**
 * Create a Duration from individual time components
 *
 * @category Time
 * @param days - Number of days
 * @param hours - Number of hours
 * @param minutes - Number of minutes
 * @param seconds - Number of seconds
 * @returns Duration object
 * @example
 * ```
 * createDuration(1, 2, 30, 45) // 1 day, 2 hours, 30 minutes, 45 seconds
 * createDuration(0, 0, 0, 3600) // 1 hour (in seconds)
 * ```
 */
export function createDuration(days?: number, hours?: number, minutes?: number, seconds?: number): Temporal.Duration {
  return Temporal.Duration.from({ days, hours, minutes, seconds })
}

/**
 * Format a Duration as a string
 *
 * @category Time
 * @param duration - Duration to format
 * @returns Formatted duration string
 * @example
 * ```
 * formatDuration(Temporal.Duration.from({ days: 1, hours: 2 })) // "P1DT2H"
 * ```
 */
export function formatDuration(duration: Temporal.Duration): string {
  return duration.toString()
}

/**
 * Add two durations together
 *
 * @category Time
 * @param duration1 - First duration
 * @param duration2 - Second duration
 * @returns Combined duration
 * @example
 * ```
 * addDurations(
 *   Temporal.Duration.from({ hours: 2 }),
 *   Temporal.Duration.from({ minutes: 30 })
 * ) // 2 hours 30 minutes
 * ```
 */
export function addDurations(duration1: Temporal.Duration, duration2: Temporal.Duration): Temporal.Duration {
  return duration1.add(duration2)
}

/**
 * Subtract one duration from another
 *
 * @category Time
 * @param duration1 - Duration to subtract from
 * @param duration2 - Duration to subtract
 * @returns Resulting duration
 * @example
 * ```
 * subtractDurations(
 *   Temporal.Duration.from({ hours: 3 }),
 *   Temporal.Duration.from({ minutes: 30 })
 * ) // 2 hours 30 minutes
 * ```
 */
export function subtractDurations(duration1: Temporal.Duration, duration2: Temporal.Duration): Temporal.Duration {
  return duration1.subtract(duration2)
}

/**
 * Convert a duration to total milliseconds
 *
 * @category Time
 * @param duration - Duration to convert
 * @returns Total milliseconds
 * @example
 * ```
 * durationToMilliseconds(Temporal.Duration.from({ seconds: 1 })) // 1000
 * durationToMilliseconds(Temporal.Duration.from({ minutes: 1 })) // 60000
 * ```
 */
export function durationToMilliseconds(duration: Temporal.Duration): number {
  return duration.total('millisecond')
}

/**
 * Convert a duration to total seconds
 *
 * @category Time
 * @param duration - Duration to convert
 * @returns Total seconds
 * @example
 * ```
 * durationToSeconds(Temporal.Duration.from({ minutes: 1 })) // 60
 * durationToSeconds(Temporal.Duration.from({ hours: 1 })) // 3600
 * ```
 */
export function durationToSeconds(duration: Temporal.Duration): number {
  return duration.total('second')
}

/**
 * Convert a duration to total minutes
 *
 * @category Time
 * @param duration - Duration to convert
 * @returns Total minutes
 * @example
 * ```
 * durationToMinutes(Temporal.Duration.from({ hours: 1 })) // 60
 * durationToMinutes(Temporal.Duration.from({ days: 1 })) // 1440
 * ```
 */
export function durationToMinutes(duration: Temporal.Duration): number {
  return duration.total('minute')
}

/**
 * Convert a duration to total hours
 *
 * @category Time
 * @param duration - Duration to convert
 * @returns Total hours
 * @example
 * ```
 * durationToHours(Temporal.Duration.from({ days: 1 })) // 24
 * durationToHours(Temporal.Duration.from({ days: 2 })) // 48
 * ```
 */
export function durationToHours(duration: Temporal.Duration): number {
  return duration.total('hour')
}

/**
 * Convert a duration to total days
 *
 * @category Time
 * @param duration - Duration to convert
 * @returns Total days
 * @example
 * ```
 * durationToDays(Temporal.Duration.from({ weeks: 1 })) // 7
 * durationToDays(Temporal.Duration.from({ months: 1 })) // ~30
 * ```
 */
export function durationToDays(duration: Temporal.Duration): number {
  return duration.total('day')
}

/**
 * Get the number of days in a specific month
 *
 * @category Time
 * @param year - Year
 * @param month - Month (1-12)
 * @returns Number of days in the month
 * @example
 * ```
 * getDaysInMonth(2023, 1) // 31 (January)
 * getDaysInMonth(2023, 2) // 28 (February, not leap year)
 * getDaysInMonth(2020, 2) // 29 (February, leap year)
 * ```
 */
export function getDaysInMonth(year: number, month: number): number {
  const date = Temporal.PlainDate.from({ year, month, day: 1 })
  return date.daysInMonth
}

/**
 * Get the number of days in a specific year
 *
 * @category Time
 * @param year - Year
 * @returns Number of days in the year (365 or 366)
 * @example
 * ```
 * getDaysInYear(2023) // 365
 * getDaysInYear(2020) // 366 (leap year)
 * ```
 */
export function getDaysInYear(year: number): number {
  const date = Temporal.PlainDate.from({ year, month: 1, day: 1 })
  return date.daysInYear
}

/**
 * Get the week number of the year for a given date
 *
 * @category Time
 * @param date - Date to get week number for
 * @returns Week number (1-53)
 * @example
 * ```
 * getWeekOfYear(Temporal.PlainDate.from('2023-01-01')) // 1
 * getWeekOfYear(Temporal.PlainDate.from('2023-12-31')) // 52 or 53
 * ```
 */
export function getWeekOfYear(date: Temporal.PlainDate): number {
  return date.weekOfYear ?? 1
}

/**
 * Get the day number of the year for a given date
 *
 * @category Time
 * @param date - Date to get day number for
 * @returns Day number (1-366)
 * @example
 * ```
 * getDayOfYear(Temporal.PlainDate.from('2023-01-01')) // 1
 * getDayOfYear(Temporal.PlainDate.from('2023-12-31')) // 365
 * getDayOfYear(Temporal.PlainDate.from('2020-12-31')) // 366 (leap year)
 * ```
 */
export function getDayOfYear(date: Temporal.PlainDate): number {
  return date.dayOfYear
}

/**
 * Get the next weekday (Monday-Friday) from a given date
 *
 * @category Time
 * @param date - Starting date
 * @returns Next weekday
 * @example
 * ```
 * getNextWeekday(Temporal.PlainDate.from('2023-01-01')) // 2023-01-02 (Monday)
 * getNextWeekday(Temporal.PlainDate.from('2023-01-06')) // 2023-01-09 (Monday)
 * ```
 */
export function getNextWeekday(date: Temporal.PlainDate): Temporal.PlainDate {
  let next = date.add({ days: 1 })
  while (next.dayOfWeek === 6 || next.dayOfWeek === 7) {
    next = next.add({ days: 1 })
  }
  return next
}

/**
 * Get the previous weekday (Monday-Friday) from a given date
 *
 * @category Time
 * @param date - Starting date
 * @returns Previous weekday
 * @example
 * ```
 * getPreviousWeekday(Temporal.PlainDate.from('2023-01-02')) // 2022-12-30 (Friday)
 * getPreviousWeekday(Temporal.PlainDate.from('2023-01-01')) // 2022-12-30 (Friday)
 * ```
 */
export function getPreviousWeekday(date: Temporal.PlainDate): Temporal.PlainDate {
  let prev = date.subtract({ days: 1 })
  while (prev.dayOfWeek === 6 || prev.dayOfWeek === 7) {
    prev = prev.subtract({ days: 1 })
  }
  return prev
}

/**
 * Get the same date in the next month
 *
 * @category Time
 * @param date - Starting date
 * @returns Same date in next month
 * @example
 * ```
 * getNextMonth(Temporal.PlainDate.from('2023-01-15')) // 2023-02-15
 * getNextMonth(Temporal.PlainDate.from('2023-01-31')) // 2023-02-28 (or 29)
 * ```
 */
export function getNextMonth(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.add({ months: 1 })
}

/**
 * Get the same date in the previous month
 *
 * @category Time
 * @param date - Starting date
 * @returns Same date in previous month
 * @example
 * ```
 * getPreviousMonth(Temporal.PlainDate.from('2023-02-15')) // 2023-01-15
 * getPreviousMonth(Temporal.PlainDate.from('2023-03-31')) // 2023-02-28 (or 29)
 * ```
 */
export function getPreviousMonth(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.subtract({ months: 1 })
}

/**
 * Add business days (Monday-Friday) to a date
 *
 * @category Time
 * @param date - Starting date
 * @param days - Number of business days to add
 * @returns Date after adding business days
 * @example
 * ```
 * addBusinessDays(Temporal.PlainDate.from('2023-01-01'), 5) // 2023-01-09
 * addBusinessDays(Temporal.PlainDate.from('2023-01-01'), 1) // 2023-01-02
 * ```
 */
export function addBusinessDays(date: Temporal.PlainDate, days: number): Temporal.PlainDate {
  let result = date
  let remaining = days
  while (remaining > 0) {
    result = result.add({ days: 1 })
    if (isBusinessDay(result)) {
      remaining--
    }
  }
  return result
}

/**
 * Subtract business days (Monday-Friday) from a date
 *
 * @category Time
 * @param date - Starting date
 * @param days - Number of business days to subtract
 * @returns Date after subtracting business days
 * @example
 * ```
 * subtractBusinessDays(Temporal.PlainDate.from('2023-01-09'), 5) // 2023-01-02
 * subtractBusinessDays(Temporal.PlainDate.from('2023-01-02'), 1) // 2022-12-30
 * ```
 */
export function subtractBusinessDays(date: Temporal.PlainDate, days: number): Temporal.PlainDate {
  let result = date
  let remaining = days
  while (remaining > 0) {
    result = result.subtract({ days: 1 })
    if (isBusinessDay(result)) {
      remaining--
    }
  }
  return result
}

/**
 * Count the number of business days between two dates (inclusive)
 *
 * @category Time
 * @param start - Start date
 * @param end - End date
 * @returns Number of business days between dates
 * @example
 * ```
 * getBusinessDaysBetween(
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-07')
 * ) // 5 (Monday to Friday)
 * ```
 */
export function getBusinessDaysBetween(start: Temporal.PlainDate, end: Temporal.PlainDate): number {
  let count = 0
  let current = start
  while (Temporal.PlainDate.compare(current, end) <= 0) {
    if (isBusinessDay(current)) {
      count++
    }
    current = current.add({ days: 1 })
  }
  return count
}

/**
 * Check if a date is a business day (Monday-Friday)
 *
 * @category Time
 * @param date - Date to check
 * @returns True if the date is a business day
 * @example
 * ```
 * isBusinessDay(Temporal.PlainDate.from('2023-01-01')) // false (Sunday)
 * isBusinessDay(Temporal.PlainDate.from('2023-01-02')) // true (Monday)
 * isBusinessDay(Temporal.PlainDate.from('2023-01-07')) // false (Saturday)
 * ```
 */
export function isBusinessDay(date: Temporal.PlainDate): boolean {
  const dayOfWeek = date.dayOfWeek
  return dayOfWeek >= 1 && dayOfWeek <= 5
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 *
 * @category Time
 * @param date - Date to check
 * @returns True if the date is a weekend
 * @example
 * ```
 * isWeekend(Temporal.PlainDate.from('2023-01-01')) // true (Sunday)
 * isWeekend(Temporal.PlainDate.from('2023-01-02')) // false (Monday)
 * isWeekend(Temporal.PlainDate.from('2023-01-07')) // true (Saturday)
 * ```
 */
export function isWeekend(date: Temporal.PlainDate): boolean {
  const dayOfWeek = date.dayOfWeek
  return dayOfWeek === 6 || dayOfWeek === 7
}

/**
 * Clamp a date to be within a minimum and maximum range
 *
 * @category Time
 * @param date - Date to clamp
 * @param min - Minimum date
 * @param max - Maximum date
 * @returns Clamped date
 * @example
 * ```
 * clampDate(
 *   Temporal.PlainDate.from('2023-06-15'),
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-12-31')
 * ) // 2023-06-15 (unchanged)
 * ```
 */
export function clampDate(date: Temporal.PlainDate, min: Temporal.PlainDate, max: Temporal.PlainDate): Temporal.PlainDate {
  if (Temporal.PlainDate.compare(date, min) < 0)
    return min
  if (Temporal.PlainDate.compare(date, max) > 0)
    return max
  return date
}

/**
 * Clamp a datetime to be within a minimum and maximum range
 *
 * @category Time
 * @param dateTime - DateTime to clamp
 * @param min - Minimum datetime
 * @param max - Maximum datetime
 * @returns Clamped datetime
 * @example
 * ```
 * clampDateTime(
 *   Temporal.PlainDateTime.from('2023-06-15T10:00:00'),
 *   Temporal.PlainDateTime.from('2023-01-01T00:00:00'),
 *   Temporal.PlainDateTime.from('2023-12-31T23:59:59')
 * ) // 2023-06-15T10:00:00 (unchanged)
 * ```
 */
export function clampDateTime(dateTime: Temporal.PlainDateTime, min: Temporal.PlainDateTime, max: Temporal.PlainDateTime): Temporal.PlainDateTime {
  if (Temporal.PlainDateTime.compare(dateTime, min) < 0)
    return min
  if (Temporal.PlainDateTime.compare(dateTime, max) > 0)
    return max
  return dateTime
}

/**
 * Clamp a time to be within a minimum and maximum range
 *
 * @category Time
 * @param time - Time to clamp
 * @param min - Minimum time
 * @param max - Maximum time
 * @returns Clamped time
 * @example
 * ```
 * clampTime(
 *   Temporal.PlainTime.from('10:30:00'),
 *   Temporal.PlainTime.from('09:00:00'),
 *   Temporal.PlainTime.from('17:00:00')
 * ) // 10:30:00 (unchanged)
 * ```
 */
export function clampTime(time: Temporal.PlainTime, min: Temporal.PlainTime, max: Temporal.PlainTime): Temporal.PlainTime {
  if (Temporal.PlainTime.compare(time, min) < 0)
    return min
  if (Temporal.PlainTime.compare(time, max) > 0)
    return max
  return time
}

/**
 * Sort an array of dates in ascending order
 *
 * @category Time
 * @param dates - Array of dates to sort
 * @returns Sorted array of dates
 * @example
 * ```
 * sortDates([
 *   Temporal.PlainDate.from('2023-01-15'),
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-10')
 * ]) // [2023-01-01, 2023-01-10, 2023-01-15]
 * ```
 */
export function sortDates(dates: Temporal.PlainDate[]): Temporal.PlainDate[] {
  return [...dates].sort((a, b) => Temporal.PlainDate.compare(a, b))
}

/**
 * Sort an array of datetimes in ascending order
 *
 * @category Time
 * @param dateTimes - Array of datetimes to sort
 * @returns Sorted array of datetimes
 * @example
 * ```
 * sortDateTimes([
 *   Temporal.PlainDateTime.from('2023-01-15T10:00:00'),
 *   Temporal.PlainDateTime.from('2023-01-01T10:00:00'),
 *   Temporal.PlainDateTime.from('2023-01-10T10:00:00')
 * ]) // [2023-01-01T10:00:00, 2023-01-10T10:00:00, 2023-01-15T10:00:00]
 * ```
 */
export function sortDateTimes(dateTimes: Temporal.PlainDateTime[]): Temporal.PlainDateTime[] {
  return [...dateTimes].sort((a, b) => Temporal.PlainDateTime.compare(a, b))
}

/**
 * Filter dates to only include those within a specified range (inclusive)
 *
 * @category Time
 * @param dates - Array of dates to filter
 * @param start - Start date of range
 * @param end - End date of range
 * @returns Filtered array of dates within range
 * @example
 * ```
 * filterDatesInRange(
 *   [
 *     Temporal.PlainDate.from('2023-01-01'),
 *     Temporal.PlainDate.from('2023-01-15'),
 *     Temporal.PlainDate.from('2023-02-01')
 *   ],
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-31')
 * ) // [2023-01-01, 2023-01-15]
 * ```
 */
export function filterDatesInRange(dates: Temporal.PlainDate[], start: Temporal.PlainDate, end: Temporal.PlainDate): Temporal.PlainDate[] {
  return dates.filter(date =>
    Temporal.PlainDate.compare(date, start) >= 0
    && Temporal.PlainDate.compare(date, end) <= 0,
  )
}

/**
 * Get unique dates from an array, removing duplicates
 *
 * @category Time
 * @param dates - Array of dates that may contain duplicates
 * @returns Array of unique dates
 * @example
 * ```
 * getUniqueDates([
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-01'),
 *   Temporal.PlainDate.from('2023-01-02')
 * ]) // [2023-01-01, 2023-01-02]
 * ```
 */
export function getUniqueDates(dates: Temporal.PlainDate[]): Temporal.PlainDate[] {
  return uniq(dates)
}
