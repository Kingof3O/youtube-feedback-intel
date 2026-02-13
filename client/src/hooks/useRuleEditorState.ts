import { useMemo, useState } from 'react';
import { parse, stringify } from 'yaml';
import type { RuleConfig } from '../components/rules/editor/types';

interface UseRuleEditorStateParams {
  content: string;
  format: 'yaml' | 'json';
  onChange: (content: string) => void;
}

export function useRuleEditorState({
  content,
  format,
  onChange,
}: UseRuleEditorStateParams) {
  const parseState = useMemo(() => {
    try {
      return {
        parsed: (format === 'yaml' ? parse(content) : JSON.parse(content)) as RuleConfig,
        parseError: null,
      };
    } catch {
      return {
        parsed: null,
        parseError:
          'Failed to parse rule content. Switch to Code Mode to fix syntax errors.',
      };
    }
  }, [content, format]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState('en');
  const [serializationError, setSerializationError] = useState<string | null>(null);

  const parsed = parseState.parsed;
  const error = parseState.parseError ?? serializationError;

  const categories = useMemo(() => Object.keys(parsed?.ruleSet?.categories ?? {}), [parsed]);
  const selectedCategory = useMemo(
    () => (activeCategory && categories.includes(activeCategory) ? activeCategory : categories[0] ?? null),
    [activeCategory, categories],
  );

  function serializeAndEmit(nextConfig: RuleConfig): void {
    try {
      const nextContent =
        format === 'yaml' ? stringify(nextConfig) : JSON.stringify(nextConfig, null, 2);
      onChange(nextContent);
      setSerializationError(null);
    } catch {
      setSerializationError('Failed to serialize changes.');
    }
  }

  function updateMinScore(value: string): void {
    if (!parsed) return;
    const next = structuredClone(parsed) as RuleConfig;
    next.ruleSet.global.minScore = parseInt(value, 10) || 0;
    serializeAndEmit(next);
  }

  function updateCategoryScore(category: string, value: string): void {
    if (!parsed) return;
    const next = structuredClone(parsed) as RuleConfig;
    next.ruleSet.categories[category].score = parseInt(value, 10) || 0;
    serializeAndEmit(next);
  }

  function updateKeywords(tags: string[]): void {
    if (!parsed || !selectedCategory) return;
    const next = structuredClone(parsed) as RuleConfig;
    if (!next.ruleSet.categories[selectedCategory].keywords) {
      next.ruleSet.categories[selectedCategory].keywords = {};
    }
    next.ruleSet.categories[selectedCategory].keywords[activeLang] = tags;
    serializeAndEmit(next);
  }

  function addCategory(rawName: string): { ok: boolean; name?: string; reason?: string } {
    if (!parsed) return { ok: false, reason: 'No parsed rules available' };
    const name = rawName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!name) return { ok: false, reason: 'Category name is required' };
    if (parsed.ruleSet.categories[name]) {
      return { ok: false, reason: `Category "${name}" already exists` };
    }

    const next = structuredClone(parsed) as RuleConfig;
    next.ruleSet.categories[name] = { score: 1, keywords: { [activeLang]: [] } };
    serializeAndEmit(next);
    setActiveCategory(name);
    return { ok: true, name };
  }

  function removeCategory(name: string): { ok: boolean } {
    if (!parsed) return { ok: false };
    const next = structuredClone(parsed) as RuleConfig;
    delete next.ruleSet.categories[name];
    serializeAndEmit(next);
    if (selectedCategory === name) {
      setActiveCategory(Object.keys(next.ruleSet.categories)[0] ?? null);
    }
    return { ok: true };
  }

  return {
    parsed,
    error,
    categories,
    activeCategory: selectedCategory,
    activeLang,
    setActiveCategory,
    setActiveLang,
    setError: setSerializationError,
    updateMinScore,
    updateCategoryScore,
    updateKeywords,
    addCategory,
    removeCategory,
  };
}
