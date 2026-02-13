import { getPool } from '../mysql.pool.js';

export interface DashboardStats {
  channels: number;
  videos: number;
  comments: number;
  feedback: number;
}

async function count(query: string): Promise<number> {
  const pool = getPool();
  const [rows] = await pool.execute(query);
  const data = rows as Array<{ c: number }>;
  return data[0]?.c ?? 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [channels, videos, comments, feedback] = await Promise.all([
    count('SELECT COUNT(*) AS c FROM channels'),
    count('SELECT COUNT(*) AS c FROM videos'),
    count('SELECT COUNT(*) AS c FROM comments'),
    count('SELECT COUNT(*) AS c FROM comment_labels'),
  ]);

  return { channels, videos, comments, feedback };
}
