import { Command } from 'commander';
import { importRulesFromFile } from '../../services/classify.service.js';
import * as rulesRepo from '../../db/repositories/rules.repo.js';
import { runWithEnv } from '../shared/run-with-env.js';
import { printJson, printLine, printSection } from '../shared/output.js';

export function registerRulesCommands(program: Command) {
  const rules = program.command('rules').description('Manage rule sets');

  rules
    .command('import')
    .description('Import rules from a YAML/JSON file')
    .requiredOption('--file <path>', 'Path to rules file')
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await importRulesFromFile(opts.file);
        printJson('Rules imported', result);
      });
    });

  rules
    .command('list')
    .description('List all rule sets')
    .action(async () => {
      await runWithEnv(async () => {
        const sets = await rulesRepo.listRuleSets();
        if (sets.length === 0) {
          printLine('No rule sets found. Import one with: rules import --file <path>');
          return;
        }

        printSection('Rule Sets');
        for (const ruleSet of sets) {
          const active = ruleSet.isActive ? ' [ACTIVE]' : '';
          printLine(
            `- ${ruleSet.name} v${ruleSet.version} (hash: ${ruleSet.rulesHash})${active}`,
          );
        }
        printLine('');
      });
    });

  rules
    .command('activate')
    .description('Activate a rule set by name')
    .requiredOption('--name <name>', 'Rule set name')
    .action(async (opts) => {
      await runWithEnv(async () => {
        const ok = await rulesRepo.activateRuleSet(opts.name);
        if (ok) {
          printLine(`Rule set "${opts.name}" activated`);
          return;
        }
        printLine(`Rule set "${opts.name}" not found`);
      });
    });
}
