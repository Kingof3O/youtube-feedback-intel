import { getPool } from '../mysql.pool.js';
import type { Video } from '../../domain/types/index.js';

export async function upsertVideo(video: Video): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO videos (id, channel_id, title, description, published_at, thumbnail_url,
      view_count, like_count, comment_count, duration, tags, last_synced_at, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       description = VALUES(description),
       thumbnail_url = VALUES(thumbnail_url),
       view_count = VALUES(view_count),
       like_count = VALUES(like_count),
       comment_count = VALUES(comment_count),
       duration = VALUES(duration),
       tags = VALUES(tags),
       last_synced_at = VALUES(last_synced_at),
       fetched_at = VALUES(fetched_at)`,
    [
      video.id,
      video.channelId,
      video.title,
      video.description,
      video.publishedAt,
      video.thumbnailUrl ?? null,
      video.viewCount ?? null,
      video.likeCount ?? null,
      video.commentCount ?? null,
      video.duration ?? null,
      video.tags ? JSON.stringify(video.tags) : null,
      video.lastSyncedAt ?? null,
      video.fetchedAt,
    ],
  );
}

export async function upsertVideos(videos: Video[]): Promise<void> {
  for (const v of videos) {
    await upsertVideo(v);
  }
}

export async function getVideosByChannelId(
  channelId: string,
  options?: { since?: string; until?: string; limit?: number },
): Promise<Video[]> {
  const pool = getPool();
  let sql = 'SELECT * FROM videos WHERE channel_id = ?';
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

export async function getVideo(id: string): Promise<Video | null> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [id]);
  const arr = rows as Array<Record<string, unknown>>;
  if (arr.length === 0) return null;
  return mapRow(arr[0]);
}

export async function getVideosByIds(ids: string[]): Promise<Video[]> {
  if (ids.length === 0) return [];
  const pool = getPool();
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.execute(`SELECT * FROM videos WHERE id IN (${placeholders})`, ids);
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

function mapRow(row: Record<string, unknown>): Video {
  return {
    id: row.id as string,
    channelId: row.channel_id as string,
    title: row.title as string,
    description: (row.description as string) ?? '',
    publishedAt: String(row.published_at),
    thumbnailUrl: row.thumbnail_url as string | undefined,
    viewCount: row.view_count as number | undefined,
    likeCount: row.like_count as number | undefined,
    commentCount: row.comment_count as number | undefined,
    duration: row.duration as string | undefined,
    tags: row.tags ? (JSON.parse(row.tags as string) as string[]) : undefined,
    lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : undefined,
    fetchedAt: String(row.fetched_at),
  };
}
