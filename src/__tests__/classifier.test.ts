import { describe, it, expect } from 'vitest';
import { classifyText, parseRuleSet, computeRuleSetHash } from '../domain/rules/rule-engine.js';
import type { RuleSetConfig } from '../config/rules.schema.js';

const mockConfig: RuleSetConfig = {
  ruleSet: {
    name: 'test',
    version: '1.0.0',
    languages: ['en', 'ar'],
    global: {
      minScore: 1,
      negativeKeywords: ['spam', 'giveaway'],
    },
    categories: {
      bug: {
        score: 3,
        keywords: {
          en: ['bug', 'broken', 'error', 'crash'],
          ar: ['مشكلة', 'خطأ', 'كراش'],
        },
      },
      performance: {
        score: 2,
        keywords: {
          en: ['lag', 'slow', 'fps'],
          ar: ['لاجي', 'بطئ'],
        },
      },
      feature_request: {
        score: 2,
        keywords: {
          en: ['add', 'feature', 'please'],
          ar: ['ضيف', 'ممكن'],
        },
      },
    },
  },
};

describe('classifyText', () => {
  const ruleSet = parseRuleSet(mockConfig);

  it('should detect bug keywords in English', () => {
    const results = classifyText('There is a bug in the app, it keeps crashing', ruleSet);
    expect(results.length).toBeGreaterThan(0);
    const bugResult = results.find((r) => r.category === 'bug');
    expect(bugResult).toBeDefined();
    expect(bugResult!.matchedLanguage).toBe('en');
    expect(bugResult!.matchedKeywords).toContain('bug');
  });

  it('should detect bug keywords in Arabic', () => {
    const results = classifyText('في مشكلة كبيرة والبرنامج فيه خطأ', ruleSet);
    const bugResult = results.find((r) => r.category === 'bug');
    expect(bugResult).toBeDefined();
    expect(bugResult!.matchedLanguage).toBe('ar');
  });

  it('should detect performance keywords', () => {
    const results = classifyText('The game is so laggy and slow', ruleSet);
    const perfResult = results.find((r) => r.category === 'performance');
    expect(perfResult).toBeDefined();
    expect(perfResult!.matchedKeywords).toContain('lag');
  });

  it('should detect multiple categories', () => {
    const results = classifyText('There is a bug and it is also very slow, please fix', ruleSet);
    expect(results.length).toBeGreaterThanOrEqual(2);
    const categories = results.map((r) => r.category);
    expect(categories).toContain('bug');
    expect(categories).toContain('performance');
  });

  it('should filter out comments with negative keywords', () => {
    const results = classifyText('This is spam, but there is a bug', ruleSet);
    expect(results.length).toBe(0);
  });

  it('should return empty for irrelevant comments', () => {
    const results = classifyText('Great video, thanks for sharing!', ruleSet);
    expect(results.length).toBe(0);
  });
});

describe('parseRuleSet', () => {
  it('should parse a valid config', () => {
    const rs = parseRuleSet(mockConfig);
    expect(rs.name).toBe('test');
    expect(rs.version).toBe('1.0.0');
    expect(rs.categories.length).toBe(3);
    expect(rs.negativeKeywords).toContain('spam');
  });
});

describe('computeRuleSetHash', () => {
  it('should produce consistent hashes', () => {
    const json = JSON.stringify(mockConfig);
    const hash1 = computeRuleSetHash(json);
    const hash2 = computeRuleSetHash(json);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different inputs', () => {
    const hash1 = computeRuleSetHash('config A');
    const hash2 = computeRuleSetHash('config B');
    expect(hash1).not.toBe(hash2);
  });
});
