import { normalizeBase } from './normalize.base.js';

/**
 * Latin-script normalization for en/fr/es/de:
 * - Lowercase
 * - Remove diacritics (NFD decompose + strip combining marks)
 * - Collapse whitespace
 */
export function normalizeLatin(text: string): string {
  let t = text.toLowerCase();

  // NFD decompose then strip combining diacritical marks
  t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return normalizeBase(t);
}
