import { describe, it, expect } from 'vitest';
import { parseDate, daysAgo, toDateString, isWithinRange } from '../utils/time.js';
import { stripHtml, collapseWhitespace, truncate } from '../utils/text.js';

describe('time utilities', () => {
  it('parseDate should parse YYYY-MM-DD', () => {
    const date = parseDate('2024-06-15');
    expect(date.getUTCFullYear()).toBe(2024);
    expect(date.getUTCMonth()).toBe(5); // 0-indexed
    expect(date.getUTCDate()).toBe(15);
  });

  it('parseDate should throw on invalid date', () => {
    expect(() => parseDate('not-a-date')).toThrow();
  });

  it('daysAgo should return a past date', () => {
    const d = daysAgo(7);
    const now = new Date();
    expect(d < now).toBe(true);
  });

  it('toDateString should format correctly', () => {
    const d = new Date('2024-03-15T10:30:00Z');
    expect(toDateString(d)).toBe('2024-03-15');
  });

  it('isWithinRange should work correctly', () => {
    const from = new Date('2024-01-01');
    const to = new Date('2024-12-31');
    expect(isWithinRange(new Date('2024-06-15'), from, to)).toBe(true);
    expect(isWithinRange(new Date('2025-01-01'), from, to)).toBe(false);
    expect(isWithinRange(new Date('2023-12-31'), from, to)).toBe(false);
  });
});

describe('text utilities', () => {
  it('stripHtml should remove tags', () => {
    expect(stripHtml('<b>bold</b> text')).toBe('bold text');
  });

  it('stripHtml should handle br tags', () => {
    expect(stripHtml('line1<br>line2')).toBe('line1\nline2');
  });

  it('stripHtml should decode entities', () => {
    expect(stripHtml('&amp; &lt; &gt; &quot;')).toBe('& < > "');
  });

  it('collapseWhitespace should trim and collapse', () => {
    expect(collapseWhitespace('  hello   world  ')).toBe('hello world');
  });

  it('truncate should truncate long strings', () => {
    expect(truncate('hello world', 8)).toBe('hello w…');
    expect(truncate('hello', 10)).toBe('hello');
  });
});
