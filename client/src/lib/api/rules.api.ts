import { getJson, postJson, putJson } from './http';
import type { RuleSet, RuleFileContent } from './types';

export function fetchRules(): Promise<RuleSet[]> {
  return getJson<RuleSet[]>('/api/rules');
}

export function activateRule(name: string): Promise<unknown> {
  return postJson('/api/rules/activate', { name });
}

export function fetchRuleContent(name: string): Promise<RuleFileContent> {
  return getJson<RuleFileContent>(`/api/rules/${name}/content`);
}

export function saveRuleContent(
  name: string,
  payload: { content: string; format: 'yaml' | 'json' },
): Promise<unknown> {
  return putJson(`/api/rules/${name}/content`, payload);
}

export function importDefaultRules(): Promise<unknown> {
  return postJson('/api/rules/import-default');
}
