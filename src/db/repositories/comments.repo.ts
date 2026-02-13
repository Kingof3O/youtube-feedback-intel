import { getPool } from '../mysql.pool.js';
import type { Comment } from '../../domain/types/index.js';

export async function upsertComment(comment: Comment): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO comments (id, thread_id, video_id, channel_id, author_display_name, author_channel_id,
      text_original, text_display, like_count, published_at, updated_at, is_reply, parent_id, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       text_original = VALUES(text_original),
       text_display = VALUES(text_display),
       like_count = VALUES(like_count),
       updated_at = VALUES(updated_at),
       fetched_at = VALUES(fetched_at)`,
    [
      comment.id,
      comment.threadId,
      comment.videoId,
      comment.channelId,
      comment.authorDisplayName,
      comment.authorChannelId ?? null,
      comment.textOriginal,
      comment.textDisplay,
      comment.likeCount,
      comment.publishedAt,
      comment.updatedAt,
      comment.isReply,
      comment.parentId ?? null,
      comment.fetchedAt,
    ],
  );
}

export async function upsertComments(comments: Comment[]): Promise<void> {
  for (const c of comments) {
    await upsertComment(c);
  }
}

export async function getCommentsByVideoId(videoId: string): Promise<Comment[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM comments WHERE video_id = ? ORDER BY published_at DESC',
    [videoId],
  );
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function getCommentsByChannelId(
  channelId: string,
  options?: { since?: string; until?: string; limit?: number },
): Promise<Comment[]> {
  const pool = getPool();
  let sql = 'SELECT * FROM comments WHERE channel_id = ?';
  const params: unknown[] = [channelId];

  if (options?.since) {
    sql += ' AND published_at >= ?';
    params.push(options.since);
  }
  if (options?.until) {
    sql += ' AND published_at <= ?';
    params.push(options.until);
  }

  sql += ' ORDER BY published_at DESC';

  if (options?.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }

  const [rows] = await pool.execute(sql, params);
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function countCommentsByChannelId(
  channelId: string,
  options?: { since?: string; until?: string },
): Promise<number> {
  const pool = getPool();
  let sql = 'SELECT COUNT(*) as cnt FROM comments WHERE channel_id = ?';
  const params: unknown[] = [channelId];

  if (options?.since) {
    sql += ' AND published_at >= ?';
    params.push(options.since);
  }
  if (options?.until) {
    sql += ' AND published_at <= ?';
    params.push(options.until);
  }

  const [rows] = await pool.execute(sql, params);
  const arr = rows as Array<{ cnt: number }>;
  return arr[0].cnt;
}

export async function getCommentsByIds(ids: string[]): Promise<Comment[]> {
  if (ids.length === 0) return [];
  const pool = getPool();
  // Create placeholders ?, ?, ?
  const placeholders = ids.map(() => '?').join(',');
  const sql = `SELECT * FROM comments WHERE id IN (${placeholders})`;
  const [rows] = await pool.execute(sql, ids);
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function queryComments(options: {
  channelId?: string;
  videoId?: string;
  search?: string;
  minLikes?: number;
  since?: string;
  until?: string;
  limit?: number;
  offset?: number;
}): Promise<Comment[]> {
  const pool = getPool();
  let sql = 'SELECT * FROM comments WHERE 1=1';
  const params: unknown[] = [];

  if (options.channelId) {
    sql += ' AND channel_id = ?';
    params.push(options.channelId);
  }
  if (options.videoId) {
    sql += ' AND video_id = ?';
    params.push(options.videoId);
  }
  if (options.search) {
    sql += ' AND text_original LIKE ?';
    params.push(`%${options.search}%`);
  }
  if (options.minLikes) {
    sql += ' AND like_count >= ?';
    params.push(options.minLikes);
  }
  if (options.since) {
    sql += ' AND published_at >= ?';
    params.push(options.since);
  }
  if (options.until) {
    sql += ' AND published_at <= ?';
    params.push(options.until);
  }

  sql += ' ORDER BY published_at DESC';

  if (options.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }
  if (options.offset) {
    sql += ' OFFSET ?';
    params.push(options.offset);
  }

  const [rows] = await pool.execute(sql, params);
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

function mapRow(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    threadId: row.thread_id as string,
    videoId: row.video_id as string,
    channelId: row.channel_id as string,
    authorDisplayName: row.author_display_name as string,
    authorChannelId: row.author_channel_id as string | undefined,
    textOriginal: row.text_original as string,
    textDisplay: row.text_display as string,
    likeCount: row.like_count as number,
    publishedAt: String(row.published_at),
    updatedAt: String(row.updated_at),
    isReply: Boolean(row.is_reply),
    parentId: row.parent_id as string | undefined,
    fetchedAt: String(row.fetched_at),
  };
}
