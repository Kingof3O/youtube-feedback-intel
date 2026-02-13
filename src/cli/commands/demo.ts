import { Command } from 'commander';
import { runWithEnv } from '../shared/run-with-env.js';
import { printLine } from '../shared/output.js';
import { seedDemoData } from '../../scripts/seed-demo.js';

export function registerDemoCommands(program: Command) {
  const demo = program.command('demo').description('Demo data utilities');

  demo
    .command('seed')
    .description('Seed deterministic demo data for screenshots')
    .option('--reset', 'Delete previous demo data before seeding', false)
    .action(async (opts) => {
      await runWithEnv(async () => {
        await seedDemoData(Boolean(opts.reset));
        printLine('Demo data seeding complete');
      });
    });
}
