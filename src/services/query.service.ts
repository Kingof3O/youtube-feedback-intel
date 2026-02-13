import { logger } from '../utils/logger.js';
import type { FeedbackResult } from '../domain/types/index.js';
import { queryAllFeedback } from './query/query-all.js';
import { queryClassifiedFeedback } from './query/query-classified.js';
import type { QueryOptions } from './query/types.js';

export type { QueryOptions } from './query/types.js';

export async function queryFeedback(
  options: QueryOptions,
): Promise<FeedbackResult[]> {
  logger.info(options, 'Querying feedback');

  const results =
    options.mode === 'all'
      ? await queryAllFeedback(options)
      : await queryClassifiedFeedback(options);

  logger.info({ results: results.length }, 'Query complete');
  return results;
}
