import type { LanguageCode } from '../../config/rules.schema.js';

export interface RuleCategory {
  name: string;
  score: number;
  keywords: Record<string, string[]>;
}

export interface RuleSet {
  name: string;
  version: string;
  languages: LanguageCode[];
  minScore: number;
  negativeKeywords: string[];
  categories: RuleCategory[];
}

export interface MatchResult {
  category: string;
  score: number;
  matchedKeywords: string[];
  matchedLanguage: string;
}
