/**
 * Parse a date string (YYYY-MM-DD) into a Date object at midnight UTC.
 */
export function parseDate(dateStr: string): Date {
  const d = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  return d;
}

/**
 * Get a Date that is `days` days ago from now.
 */
export function daysAgo(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a Date as ISO 8601 string for YouTube API (RFC 3339).
 */
export function toRfc3339(date: Date): string {
  return date.toISOString();
}

/**
 * Format a Date as YYYY-MM-DD.
 */
export function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Check if a date falls within [from, to] range (inclusive).
 */
export function isWithinRange(date: Date, from: Date, to: Date): boolean {
  return date >= from && date <= to;
}

/**
 * Current timestamp as ISO string.
 */
export function nowISO(): string {
  return new Date().toISOString();
}
