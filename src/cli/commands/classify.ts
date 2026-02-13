import { Command } from 'commander';
import { classifyChannel, classifyVideo } from '../../services/classify.service.js';
import { runWithEnv } from '../shared/run-with-env.js';
import { printJson } from '../shared/output.js';

export function registerClassifyCommands(program: Command) {
  const classify = program.command('classify').description('Classify comments using rules');

  classify
    .command('channel')
    .description('Classify all comments for a channel')
    .requiredOption('--channelId <id>', 'YouTube channel ID')
    .option('--ruleSetName <name>', 'Rule set name (default: active)')
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await classifyChannel(opts.channelId, opts.ruleSetName);
        printJson('Classification complete', result);
      });
    });

  classify
    .command('video')
    .description('Classify all comments for a video')
    .requiredOption('--videoId <id>', 'YouTube video ID')
    .option('--ruleSetName <name>', 'Rule set name (default: active)')
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await classifyVideo(opts.videoId, opts.ruleSetName);
        printJson('Classification complete', result);
      });
    });
}
