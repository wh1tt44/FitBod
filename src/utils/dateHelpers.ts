/**
 * Date Utilities
 * Handles date calculations and formatting
 */

/**
 * Calculates days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.floor((date2.getTime() - date1.getTime()) / oneDay);
}

/**
 * Gets start of day in UTC
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets end of day in UTC
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/**
 * Checks if date is today
 */
export function isToday(date: Date): boolean {
  return daysBetween(getStartOfDay(), getStartOfDay(date)) === 0;
}

/**
 * Formats date to ISO string
 */
export function toISO(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Parses ISO string to Date
 */
export function fromISO(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Gets readable date format
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}
