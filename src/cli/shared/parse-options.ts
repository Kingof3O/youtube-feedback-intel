import { parseDate } from '../../utils/time.js';

export function parseNumber(value: string, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number for ${field}: ${value}`);
  }
  return parsed;
}

export function parseNumberOrUndefined(
  value: string | undefined,
  field: string,
): number | undefined {
  if (value === undefined) return undefined;
  return parseNumber(value, field);
}

export function parseCsv(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseDateOption(value: string): Date {
  return parseDate(value);
}
