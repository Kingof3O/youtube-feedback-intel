import { describe, it, expect } from 'vitest';
import { normalizeArabic } from '../domain/normalize/normalize.ar.js';
import { normalizeLatin } from '../domain/normalize/normalize.latn.js';
import { normalizeForLanguage } from '../domain/normalize/index.js';

describe('normalizeArabic', () => {
  it('should normalize Alef forms to plain Alef', () => {
    expect(normalizeArabic('أحمد إبراهيم آمال')).toBe('احمد ابراهيم امال');
  });

  it('should remove tatweel', () => {
    expect(normalizeArabic('كتـــاب')).toBe('كتاب');
  });

  it('should remove Arabic diacritics (tashkeel)', () => {
    expect(normalizeArabic('كِتَابٌ')).toBe('كتاب');
  });

  it('should unify Alef Maksura to ya', () => {
    expect(normalizeArabic('مشى')).toBe('مشي');
  });

  it('should collapse whitespace', () => {
    expect(normalizeArabic('  كلمة   أخرى  ')).toBe('كلمة اخري');
  });
});

describe('normalizeLatin', () => {
  it('should lowercase text', () => {
    expect(normalizeLatin('Hello WORLD')).toBe('hello world');
  });

  it('should remove diacritics', () => {
    expect(normalizeLatin('café résumé naïve')).toBe('cafe resume naive');
  });

  it('should collapse whitespace', () => {
    expect(normalizeLatin('  hello   world  ')).toBe('hello world');
  });

  it('should handle German umlauts', () => {
    // NFD decomposition splits ü into u + combining diaeresis
    expect(normalizeLatin('Über Straße')).toBe('uber straße');
  });
});

describe('normalizeForLanguage', () => {
  it('should use Arabic normalizer for ar', () => {
    const result = normalizeForLanguage('أحمد', 'ar');
    expect(result).toBe('احمد');
  });

  it('should use Latin normalizer for en', () => {
    const result = normalizeForLanguage('Hello World', 'en');
    expect(result).toBe('hello world');
  });

  it('should use Latin normalizer for fr', () => {
    const result = normalizeForLanguage('Café', 'fr');
    expect(result).toBe('cafe');
  });
});
