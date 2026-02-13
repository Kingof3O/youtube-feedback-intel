import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { ruleSetSchema, type RuleSetConfig } from './rules.schema.js';
import { ConfigError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Load and validate a rules file (YAML or JSON).
 */
export function loadRulesFromFile(filePath: string): RuleSetConfig {
  logger.info({ filePath }, 'Loading rules file');

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new ConfigError(`Cannot read rules file: ${filePath} — ${(err as Error).message}`);
  }

  let parsed: unknown;
  if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
    parsed = parseYaml(raw);
  } else {
    parsed = JSON.parse(raw);
  }

  const result = ruleSetSchema.safeParse(parsed);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new ConfigError(`Rules validation failed:\n${issues}`);
  }

  logger.info(
    { name: result.data.ruleSet.name, version: result.data.ruleSet.version },
    'Rules loaded successfully',
  );
  return result.data;
}
