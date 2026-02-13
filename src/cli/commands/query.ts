import { Command } from 'commander';
import { queryFeedback } from '../../services/query.service.js';
import { runWithEnv } from '../shared/run-with-env.js';
import { parseNumberOrUndefined } from '../shared/parse-options.js';
import { printLine, printSection } from '../shared/output.js';

export function registerQueryCommands(program: Command) {
  program
    .command('query')
    .description('Query classified feedback')
    .option('--channelId <id>', 'Filter by channel ID')
    .option('--videoId <id>', 'Filter by video ID')
    .option('--category <cat>', 'Filter by category (bug, performance, etc.)')
    .option('--contains <text>', 'Filter comments containing text')
    .option('--minLikes <n>', 'Minimum like count')
    .option('--since <date>', 'From date (YYYY-MM-DD)')
    .option('--until <date>', 'Until date (YYYY-MM-DD)')
    .option('--limit <n>', 'Max results', '50')
    .action(async (opts) => {
      await runWithEnv(async () => {
        const results = await queryFeedback({
          channelId: opts.channelId,
          videoId: opts.videoId,
          category: opts.category,
          contains: opts.contains,
          minLikes: parseNumberOrUndefined(opts.minLikes, 'minLikes'),
          since: opts.since,
          until: opts.until,
          limit: parseNumberOrUndefined(opts.limit, 'limit'),
        });

        if (results.length === 0) {
          printLine('No feedback found matching your criteria.');
          return;
        }

        printSection(`Found ${results.length} feedback items`);
        for (const item of results) {
          const text =
            item.comment.textOriginal.length > 200
              ? `${item.comment.textOriginal.slice(0, 200)}...`
              : item.comment.textOriginal;

          printLine('-----------------------------');
          printLine(`Video: ${item.videoTitle}`);
          printLine(
            `Author: ${item.comment.authorDisplayName} | Likes: ${item.comment.likeCount} | ${item.comment.publishedAt.slice(0, 10)}`,
          );
          printLine(`Text: ${text}`);
          for (const label of item.labels) {
            printLine(
              `  - ${label.category} (score: ${label.score}) keywords: ${label.matchedKeywords.join(', ')} [${label.matchedLanguage}]`,
            );
          }
          printLine('');
        }
      });
    });
}
