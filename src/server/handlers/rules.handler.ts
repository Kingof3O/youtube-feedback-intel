import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Request, Response, NextFunction } from 'express';
import * as yaml from 'yaml';
import * as rulesRepo from '../../db/repositories/rules.repo.js';
import { importRulesFromFile } from '../../services/classify.service.js';
import { logger } from '../../utils/logger.js';
import { ruleSetSchema } from '../../config/rules.schema.js';
import { isRuleNameSafe, resolveRulesFile } from './rules-file-utils.js';

interface ActivateRuleBody {
  name?: string;
}

interface UpdateRuleBody {
  content?: string;
  format?: 'yaml' | 'json';
}

export async function listRules(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rules = await rulesRepo.listRuleSets();
    res.json(rules);
  } catch (err) {
    next(err);
  }
}

export function getRuleContent(
  req: Request<{ name: string }>,
  res: Response,
): void {
  try {
    const { name } = req.params;
    if (!isRuleNameSafe(name)) {
      res.status(400).json({ error: 'Invalid rule name' });
      return;
    }

    const resolved = resolveRulesFile(name);
    if (!resolved.filePath || !resolved.format) {
      res.status(404).json({ error: 'Rule file not found' });
      return;
    }

    const content = readFileSync(resolved.filePath, 'utf-8');
    res.json({ name, format: resolved.format, content });
  } catch (err) {
    logger.error({ err }, 'Failed to get rule content');
    res.status(500).json({ error: 'Failed to get rule content' });
  }
}

export function updateRuleContent(
  req: Request<{ name: string }, unknown, UpdateRuleBody>,
  res: Response,
): void {
  try {
    const { name } = req.params;
    const { content, format } = req.body;

    if (!isRuleNameSafe(name)) {
      res.status(400).json({ error: 'Invalid rule name' });
      return;
    }

    if (!content || !format) {
      res.status(400).json({ error: 'content and format are required' });
      return;
    }

    try {
      const parsed = format === 'json' ? JSON.parse(content) : yaml.parse(content);
      ruleSetSchema.parse(parsed);
    } catch (validationError) {
      const errorMessage =
        validationError instanceof Error
          ? validationError.message
          : 'Validation failed';

      res.status(400).json({
        error: 'Validation failed',
        details: errorMessage,
      });
      return;
    }

    const ext = format === 'json' ? 'json' : 'yml';
    let filePath = join(process.cwd(), 'rules', `${name}.${ext}`);
    const prefixedPath = join(process.cwd(), 'rules', `rules.${name}.${ext}`);
    if (!existsSync(filePath) && existsSync(prefixedPath)) {
      filePath = prefixedPath;
    }

    writeFileSync(filePath, content, 'utf-8');
    res.json({ success: true, message: 'Rule set updated' });
  } catch (err) {
    logger.error({ err }, 'Failed to update rule content');
    res.status(500).json({ error: 'Failed to update rule content' });
  }
}

export async function importDefaultRules(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const defaultPath = join(process.cwd(), 'rules', 'rules.default.yml');
    await importRulesFromFile(defaultPath);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function activateRules(
  req: Request<unknown, unknown, ActivateRuleBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Rule name required' });
      return;
    }
    await rulesRepo.activateRuleSet(name);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
