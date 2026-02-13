import { getPool } from '../mysql.pool.js';
import type { Channel } from '../../domain/types/index.js';

export async function upsertChannel(channel: Channel): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO channels (id, title, description, custom_url, published_at, uploads_playlist_id,
      subscriber_count, video_count, view_count, thumbnail_url, fetched_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       description = VALUES(description),
       custom_url = VALUES(custom_url),
       uploads_playlist_id = VALUES(uploads_playlist_id),
       subscriber_count = VALUES(subscriber_count),
       video_count = VALUES(video_count),
       view_count = VALUES(view_count),
       thumbnail_url = VALUES(thumbnail_url),
       fetched_at = VALUES(fetched_at)`,
    [
      channel.id,
      channel.title,
      channel.description,
      channel.customUrl ?? null,
      channel.publishedAt,
      channel.uploadsPlaylistId,
      channel.subscriberCount ?? null,
      channel.videoCount ?? null,
      channel.viewCount ?? null,
      channel.thumbnailUrl ?? null,
      channel.fetchedAt,
    ],
  );
}

export async function getChannel(id: string): Promise<Channel | null> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM channels WHERE id = ?', [id]);
  const arr = rows as Array<Record<string, unknown>>;
  if (arr.length === 0) return null;
  return mapRow(arr[0]);
}

function mapRow(row: Record<string, unknown>): Channel {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    customUrl: row.custom_url as string | undefined,
    publishedAt: String(row.published_at),
    uploadsPlaylistId: row.uploads_playlist_id as string,
    subscriberCount: row.subscriber_count as number | undefined,
    videoCount: row.video_count as number | undefined,
    viewCount: row.view_count as number | undefined,
    thumbnailUrl: row.thumbnail_url as string | undefined,
    fetchedAt: String(row.fetched_at),
  };
}
