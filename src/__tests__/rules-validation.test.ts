import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { ruleSetSchema } from '../config/rules.schema.js';

describe('rules.default.yml validation', () => {
  it('should be a valid rule set', () => {
    const raw = readFileSync(resolve('rules/rules.default.yml'), 'utf-8');
    const parsed = parseYaml(raw);
    const result = ruleSetSchema.safeParse(parsed);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ruleSet.name).toBe('default');
      expect(result.data.ruleSet.languages).toContain('ar');
      expect(result.data.ruleSet.languages).toContain('en');
      expect(Object.keys(result.data.ruleSet.categories).length).toBeGreaterThanOrEqual(5);
    }
  });

  it('should have keywords for all declared languages in each category', () => {
    const raw = readFileSync(resolve('rules/rules.default.yml'), 'utf-8');
    const parsed = parseYaml(raw);
    const result = ruleSetSchema.parse(parsed);
    const { languages, categories } = result.ruleSet;

    for (const [catName, cat] of Object.entries(categories)) {
      for (const lang of languages) {
        const keywords = cat.keywords[lang];
        expect(keywords, `${catName} missing keywords for ${lang}`).toBeDefined();
        expect(keywords!.length, `${catName} has empty keywords for ${lang}`).toBeGreaterThan(0);
      }
    }
  });
});
