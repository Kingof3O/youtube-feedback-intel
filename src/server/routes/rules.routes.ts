import type { Express } from 'express';
import {
  listRules,
  getRuleContent,
  updateRuleContent,
  importDefaultRules,
  activateRules,
} from '../handlers/rules.handler.js';

export function registerRulesRoutes(app: Express): void {
  app.get('/api/rules', listRules);
  app.get('/api/rules/:name/content', getRuleContent);
  app.put('/api/rules/:name/content', updateRuleContent);
  app.post('/api/rules/import-default', importDefaultRules);
  app.post('/api/rules/activate', activateRules);
}
