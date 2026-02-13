import { loadRulesFromFile } from '../../config/rules.loader.js';
import { ruleSetSchema } from '../../config/rules.schema.js';
import {
  computeRuleSetHash,
  parseRuleSet,
} from '../../domain/rules/rule-engine.js';
import type { RuleSetRecord } from '../../domain/types/index.js';
import * as rulesRepo from '../../db/repositories/rules.repo.js';
import { logger } from '../../utils/logger.js';
import type { RuleSet } from '../../domain/rules/rule-types.js';

interface ParsedRuleSetResult {
  record: RuleSetRecord;
  parsed: RuleSet;
}

async function ensureActiveRuleSet(): Promise<RuleSetRecord> {
  let record = await rulesRepo.getActiveRuleSet();
  if (record) return record;

  logger.info('No active rule set in DB, importing default');
  const defaultPath = new URL('../../../rules/rules.default.yml', import.meta.url)
    .pathname;
  const filePath =
    process.platform === 'win32' ? defaultPath.replace(/^\//, '') : defaultPath;
  await importRulesFromFile(filePath);

  record = await rulesRepo.getActiveRuleSet();
  if (!record) {
    throw new Error('Failed to load default rules');
  }
  return record;
}

export async function importRulesFromFile(filePath: string) {
  const config = loadRulesFromFile(filePath);
  const rulesJson = JSON.stringify(config);
  const hash = computeRuleSetHash(rulesJson);

  const record: RuleSetRecord = {
    name: config.ruleSet.name,
    version: config.ruleSet.version,
    rulesJson,
    rulesHash: hash,
    isActive: true,
  };

  await rulesRepo.upsertRuleSet(record);
  await rulesRepo.activateRuleSet(record.name);

  logger.info(
    { name: record.name, version: record.version },
    'Rules imported and activated',
  );
  return { name: record.name, version: record.version, hash };
}

export async function resolveParsedRuleSet(
  ruleSetName?: string,
): Promise<ParsedRuleSetResult> {
  const record = ruleSetName
    ? await rulesRepo.getRuleSetByName(ruleSetName)
    : await ensureActiveRuleSet();

  if (!record) {
    throw new Error(`Rule set not found: ${ruleSetName ?? 'active'}`);
  }

  const config = ruleSetSchema.parse(JSON.parse(record.rulesJson));
  return { record, parsed: parseRuleSet(config) };
}
