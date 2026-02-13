import { fetchCommentThreads } from '../../integrations/youtube/youtube.client.js';
import { nowISO } from '../../utils/time.js';
import { logger } from '../../utils/logger.js';
import * as threadsRepo from '../../db/repositories/threads.repo.js';
import * as commentsRepo from '../../db/repositories/comments.repo.js';
import * as syncstateRepo from '../../db/repositories/syncstate.repo.js';

export async function syncVideoComments(
  videoId: string,
  channelId: string,
  maxComments: number,
  dryRun: boolean,
): Promise<number> {
  try {
    const { threads, comments } = await fetchCommentThreads(
      videoId,
      channelId,
      maxComments,
    );

    if (!dryRun) {
      await threadsRepo.upsertThreads(threads);
      await commentsRepo.upsertComments(comments);
      await syncstateRepo.upsertSyncState({
        entityType: 'video',
        entityId: videoId,
        lastSyncedAt: nowISO(),
        itemsSynced: comments.length,
      });
    }

    return comments.length;
  } catch (err) {
    logger.warn({ videoId, error: (err as Error).message }, 'Failed to sync comments');
    return 0;
  }
}
