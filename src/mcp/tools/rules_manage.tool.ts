import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { importRulesFromFile } from '../../services/classify.service.js';
import * as rulesRepo from '../../db/repositories/rules.repo.js';

export function registerRulesManageTool(server: McpServer) {
  server.tool(
    'rules_import',
    'Import a rules file (YAML/JSON) into the database',
    {
      filePath: z.string().describe('Path to rules file'),
    },
    async ({ filePath }) => {
      const result = await importRulesFromFile(filePath);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );

  server.tool(
    'rules_list',
    'List all available rule sets',
    {},
    async () => {
      const sets = await rulesRepo.listRuleSets();
      const output = sets.map((rs) => ({
        name: rs.name,
        version: rs.version,
        hash: rs.rulesHash,
        isActive: rs.isActive,
      }));
      return { content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }] };
    },
  );

  server.tool(
    'rules_activate',
    'Activate a rule set by name',
    {
      name: z.string().describe('Name of the rule set to activate'),
    },
    async ({ name }) => {
      const ok = await rulesRepo.activateRuleSet(name);
      return {
        content: [{ type: 'text' as const, text: ok ? `Rule set "${name}" activated` : `Rule set "${name}" not found` }],
      };
    },
  );
}
