import { normalizeArabic } from './normalize.ar.js';
import { normalizeLatin } from './normalize.latn.js';
import type { LanguageCode } from '../../config/rules.schema.js';

export { normalizeArabic } from './normalize.ar.js';
export { normalizeLatin } from './normalize.latn.js';
export { normalizeBase } from './normalize.base.js';

/**
 * Normalize text for a specific language.
 */
export function normalizeForLanguage(text: string, lang: LanguageCode): string {
  if (lang === 'ar') return normalizeArabic(text);
  return normalizeLatin(text);
}
