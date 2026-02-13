import { getPool } from '../mysql.pool.js';
import type { CommentThread } from '../../domain/types/index.js';

export async function upsertThread(thread: CommentThread): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO comment_threads (id, video_id, channel_id, top_level_comment_id, total_reply_count, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       total_reply_count = VALUES(total_reply_count),
       fetched_at = VALUES(fetched_at)`,
    [
      thread.id,
      thread.videoId,
      thread.channelId,
      thread.topLevelCommentId,
      thread.totalReplyCount,
      thread.fetchedAt,
    ],
  );
}

export async function upsertThreads(threads: CommentThread[]): Promise<void> {
  for (const t of threads) {
    await upsertThread(t);
  }
}
