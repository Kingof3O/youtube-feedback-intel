import { logger } from '../../utils/logger.js';
import { YouTubeApiError } from '../../utils/errors.js';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

/**
 * Exponential backoff with jitter.
 */
function computeDelay(attempt: number): number {
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return exponential + jitter;
}

/**
 * Wrap a fetch call with retry logic for 429 and 5xx errors.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = MAX_RETRIES,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;

      if (err instanceof YouTubeApiError && err.isRetryable && attempt < maxRetries) {
        const delay = computeDelay(attempt);
        logger.warn(
          { attempt: attempt + 1, maxRetries, delay: Math.round(delay), label, status: err.httpStatus },
          'Retryable error, backing off',
        );
        await sleep(delay);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
