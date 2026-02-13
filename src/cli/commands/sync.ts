import { Command } from 'commander';
import {
  syncChannel,
  syncVideo,
  syncVideosList,
  syncRange,
} from '../../services/sync.service.js';
import {
  parseCsv,
  parseDateOption,
  parseNumber,
} from '../shared/parse-options.js';
import { runWithEnv } from '../shared/run-with-env.js';
import { printJson } from '../shared/output.js';

export function registerSyncCommands(program: Command) {
  const sync = program.command('sync').description('Sync YouTube data');

  sync
    .command('channel')
    .description('Sync a channel: videos + comments')
    .requiredOption('--channelId <id>', 'YouTube channel ID')
    .option('--days <n>', 'Days to look back', '14')
    .option('--maxVideos <n>', 'Max videos to sync', '50')
    .option('--maxCommentsPerVideo <n>', 'Max comments per video', '2000')
    .option('--dryRun', 'Preview without writing to DB', false)
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await syncChannel({
          channelId: opts.channelId,
          days: parseNumber(opts.days, 'days'),
          maxVideos: parseNumber(opts.maxVideos, 'maxVideos'),
          maxCommentsPerVideo: parseNumber(
            opts.maxCommentsPerVideo,
            'maxCommentsPerVideo',
          ),
          dryRun: opts.dryRun,
        });
        printJson('Channel sync complete', result);
      });
    });

  sync
    .command('video')
    .description('Sync a single video + comments')
    .requiredOption('--videoId <id>', 'YouTube video ID')
    .option('--maxComments <n>', 'Max comments', '2000')
    .option('--dryRun', 'Preview without writing to DB', false)
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await syncVideo({
          videoId: opts.videoId,
          maxComments: parseNumber(opts.maxComments, 'maxComments'),
          dryRun: opts.dryRun,
        });
        printJson('Video sync complete', result);
      });
    });

  sync
    .command('videos')
    .description('Sync multiple videos by IDs')
    .requiredOption('--videoIds <ids>', 'Comma-separated video IDs')
    .option('--maxCommentsPerVideo <n>', 'Max comments per video', '2000')
    .option('--dryRun', 'Preview without writing to DB', false)
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await syncVideosList(
          parseCsv(opts.videoIds),
          parseNumber(opts.maxCommentsPerVideo, 'maxCommentsPerVideo'),
          opts.dryRun,
        );
        printJson('Videos sync complete', result);
      });
    });

  sync
    .command('range')
    .description('Sync videos within a date range')
    .requiredOption('--channelId <id>', 'YouTube channel ID')
    .requiredOption('--from <date>', 'Start date (YYYY-MM-DD)')
    .requiredOption('--to <date>', 'End date (YYYY-MM-DD)')
    .option('--maxVideos <n>', 'Max videos', '500')
    .option('--maxCommentsPerVideo <n>', 'Max comments per video', '2000')
    .option('--dryRun', 'Preview without writing to DB', false)
    .action(async (opts) => {
      await runWithEnv(async () => {
        const result = await syncRange({
          channelId: opts.channelId,
          from: parseDateOption(opts.from),
          to: parseDateOption(opts.to),
          maxVideos: parseNumber(opts.maxVideos, 'maxVideos'),
          maxCommentsPerVideo: parseNumber(
            opts.maxCommentsPerVideo,
            'maxCommentsPerVideo',
          ),
          dryRun: opts.dryRun,
        });
        printJson('Range sync complete', result);
      });
    });
}
