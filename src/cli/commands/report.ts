import { Command } from 'commander';
import { exportReport } from '../../services/report.service.js';
import { runWithEnv } from '../shared/run-with-env.js';
import { printLine } from '../shared/output.js';

export function registerReportCommands(program: Command) {
  program
    .command('report')
    .description('Generate a feedback report')
    .requiredOption('--channelId <id>', 'YouTube channel ID')
    .requiredOption('--since <date>', 'From date (YYYY-MM-DD)')
    .option(
      '--until <date>',
      'Until date (YYYY-MM-DD)',
      new Date().toISOString().slice(0, 10),
    )
    .option('--format <fmt>', 'Report format: md or jsonl', 'md')
    .action(async (opts) => {
      await runWithEnv(async () => {
        const filePath = await exportReport({
          channelId: opts.channelId,
          since: opts.since,
          until: opts.until,
          format: opts.format as 'md' | 'jsonl',
        });
        printLine(`Report saved to: ${filePath}`);
      });
    });
}
