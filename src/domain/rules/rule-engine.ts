import type { RuleSetConfig } from '../../config/rules.schema.js';
import { normalizeForLanguage, normalizeLatin } from '../normalize/index.js';
import type { RuleSet, RuleCategory, MatchResult } from './rule-types.js';

/**
 * Convert a RuleSetConfig (from file/DB) into an internal RuleSet.
 */
export function parseRuleSet(config: RuleSetConfig): RuleSet {
  const rs = config.ruleSet;
  const categories: RuleCategory[] = Object.entries(rs.categories).map(([name, cat]) => ({
    name,
    score: cat.score,
    keywords: cat.keywords,
  }));

  return {
    name: rs.name,
    version: rs.version,
    languages: rs.languages,
    minScore: rs.global.minScore,
    negativeKeywords: rs.global.negativeKeywords,
    categories,
  };
}

/**
 * Check if text contains a keyword (supports phrase matching).
 */
function containsKeyword(normalizedText: string, normalizedKeyword: string): boolean {
  return normalizedText.includes(normalizedKeyword);
}

/**
 * Check if any negative keyword is present in the text.
 */
function hasNegativeKeyword(text: string, negativeKeywords: string[]): boolean {
  const normalizedText = normalizeLatin(text);
  return negativeKeywords.some((nk) => containsKeyword(normalizedText, normalizeLatin(nk)));
}

/**
 * Classify a single comment text against a RuleSet.
 * Returns all matching categories with scores >= minScore.
 */
export function classifyText(
  text: string,
  ruleSet: RuleSet,
  _matchAllLanguages = true,
): MatchResult[] {
  // Check negative keywords first
  if (hasNegativeKeyword(text, ruleSet.negativeKeywords)) {
    return [];
  }

  const results: MatchResult[] = [];

  for (const category of ruleSet.categories) {
    let bestMatch: { keywords: string[]; language: string; score: number } | null = null;

    for (const lang of ruleSet.languages) {
      const keywords = category.keywords[lang];
      if (!keywords || keywords.length === 0) continue;

      const normalizedText = normalizeForLanguage(text, lang);
      const matched: string[] = [];

      for (const kw of keywords) {
        const normalizedKw = normalizeForLanguage(kw, lang);
        if (containsKeyword(normalizedText, normalizedKw)) {
          matched.push(kw);
        }
      }

      if (matched.length > 0) {
        const score = matched.length * category.score;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { keywords: matched, language: lang, score };
        }
      }
    }

    if (bestMatch && bestMatch.score >= ruleSet.minScore) {
      results.push({
        category: category.name,
        score: bestMatch.score,
        matchedKeywords: bestMatch.keywords,
        matchedLanguage: bestMatch.language,
      });
    }
  }

  return results;
}

/**
 * Compute a simple hash of a rule set for version tracking.
 */
export function computeRuleSetHash(rulesJson: string): string {
  let hash = 0;
  for (let i = 0; i < rulesJson.length; i++) {
    const char = rulesJson.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}
