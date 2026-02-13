import { getPool } from '../mysql.pool.js';
import type { CommentLabel } from '../../domain/types/index.js';

export async function upsertLabel(label: CommentLabel): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO comment_labels (comment_id, video_id, channel_id, category, score,
      matched_keywords, matched_language, rule_set_name, rule_set_version, rule_set_hash, labeled_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       score = VALUES(score),
       matched_keywords = VALUES(matched_keywords),
       matched_language = VALUES(matched_language),
       rule_set_version = VALUES(rule_set_version),
       labeled_at = VALUES(labeled_at)`,
    [
      label.commentId,
      label.videoId,
      label.channelId,
      label.category,
      label.score,
      JSON.stringify(label.matchedKeywords),
      label.matchedLanguage,
      label.ruleSetName,
      label.ruleSetVersion,
      label.ruleSetHash,
      label.labeledAt,
    ],
  );
}

export async function upsertLabels(labels: CommentLabel[]): Promise<void> {
  for (const l of labels) {
    await upsertLabel(l);
  }
}

export async function getLabelsByCommentId(commentId: string): Promise<CommentLabel[]> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM comment_labels WHERE comment_id = ?', [
    commentId,
  ]);
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function getLabelsByCommentIds(commentIds: string[]): Promise<CommentLabel[]> {
  if (commentIds.length === 0) return [];
  const pool = getPool();
  const placeholders = commentIds.map(() => '?').join(',');
  const [rows] = await pool.execute(
    `SELECT * FROM comment_labels WHERE comment_id IN (${placeholders})`,
    commentIds
  );
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function queryLabels(options: {
  channelId?: string;
  videoId?: string;
  category?: string;
  since?: string;
  until?: string;
  limit?: number;
}): Promise<CommentLabel[]> {
  const pool = getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (options.channelId) {
    conditions.push('channel_id = ?');
    params.push(options.channelId);
  }
  if (options.videoId) {
    conditions.push('video_id = ?');
    params.push(options.videoId);
  }
  if (options.category) {
    conditions.push('category = ?');
    params.push(options.category);
  }
  if (options.since) {
    conditions.push('labeled_at >= ?');
    params.push(options.since);
  }
  if (options.until) {
    conditions.push('labeled_at <= ?');
    params.push(options.until);
  }

  let sql = 'SELECT * FROM comment_labels';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY labeled_at DESC';

  if (options.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }

  const [rows] = await pool.execute(sql, params);
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function getCategorySummary(
  channelId: string,
  options?: { since?: string; until?: string },
): Promise<Record<string, number>> {
  const pool = getPool();
  let sql = 'SELECT category, COUNT(*) as cnt FROM comment_labels WHERE channel_id = ?';
  const params: unknown[] = [channelId];

  if (options?.since) {
    sql += ' AND labeled_at >= ?';
    params.push(options.since);
  }
  if (options?.until) {
    sql += ' AND labeled_at <= ?';
    params.push(options.until);
  }

  sql += ' GROUP BY category ORDER BY cnt DESC';

  const [rows] = await pool.execute(sql, params);
  const result: Record<string, number> = {};
  for (const row of rows as Array<{ category: string; cnt: number }>) {
    result[row.category] = row.cnt;
  }
  return result;
}

function mapRow(row: Record<string, unknown>): CommentLabel {
  const keywords = row.matched_keywords;
  let parsedKeywords: string[];
  if (typeof keywords === 'string') {
    parsedKeywords = JSON.parse(keywords) as string[];
  } else if (Array.isArray(keywords)) {
    parsedKeywords = keywords as string[];
  } else {
    parsedKeywords = [];
  }

  return {
    id: row.id as number,
    commentId: row.comment_id as string,
    videoId: row.video_id as string,
    channelId: row.channel_id as string,
    category: row.category as string,
    score: row.score as number,
    matchedKeywords: parsedKeywords,
    matchedLanguage: row.matched_language as string,
    ruleSetName: row.rule_set_name as string,
    ruleSetVersion: row.rule_set_version as string,
    ruleSetHash: row.rule_set_hash as string,
    labeledAt: String(row.labeled_at),
  };
}
