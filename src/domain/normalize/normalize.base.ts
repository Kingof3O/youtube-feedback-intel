import { collapseWhitespace } from '../../utils/text.js';

/**
 * Base normalizer: collapse whitespace + trim.
 */
export function normalizeBase(text: string): string {
  return collapseWhitespace(text);
}
