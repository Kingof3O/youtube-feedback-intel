import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function isRuleNameSafe(name: string): boolean {
  return !name.includes('..') && !name.includes('/') && !name.includes('\\');
}

export function resolveRulesFile(name: string): {
  filePath: string | null;
  format: 'yaml' | 'json' | null;
} {
  const yamlPath = join(process.cwd(), 'rules', `${name}.yml`);
  const prefixedYamlPath = join(process.cwd(), 'rules', `rules.${name}.yml`);
  const jsonPath = join(process.cwd(), 'rules', `${name}.json`);
  const prefixedJsonPath = join(process.cwd(), 'rules', `rules.${name}.json`);

  if (existsSync(yamlPath)) return { filePath: yamlPath, format: 'yaml' };
  if (existsSync(prefixedYamlPath)) {
    return { filePath: prefixedYamlPath, format: 'yaml' };
  }
  if (existsSync(jsonPath)) return { filePath: jsonPath, format: 'json' };
  if (existsSync(prefixedJsonPath)) {
    return { filePath: prefixedJsonPath, format: 'json' };
  }

  return { filePath: null, format: null };
}
