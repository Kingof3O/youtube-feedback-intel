import { normalizeBase } from './normalize.base.js';

/**
 * Arabic-specific normalization:
 * - Normalize Alef forms (أ إ آ ٱ → ا)
 * - Remove tatweel (ـ)
 * - Remove Arabic diacritics (tashkeel)
 * - Unify ya (ي ى → ي)
 * - Collapse whitespace
 */
export function normalizeArabic(text: string): string {
  let t = text;

  // Normalize Alef forms
  t = t.replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627'); // آ أ إ ٱ → ا

  // Remove tatweel
  t = t.replace(/\u0640/g, '');

  // Remove Arabic diacritics (tashkeel) U+064B–U+065F
  t = t.replace(/[\u064B-\u065F]/g, '');

  // Unify ya: ى (Alef Maksura) → ي
  t = t.replace(/\u0649/g, '\u064A');

  return normalizeBase(t);
}
