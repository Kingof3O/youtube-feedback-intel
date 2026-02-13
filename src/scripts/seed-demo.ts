import { createHash } from 'node:crypto';
import { getPool, closePool } from '../db/mysql.pool.js';
import { loadEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';

const DEMO_CHANNEL_ID = 'demo_channel_001';
const DEMO_VIDEO_IDS = ['demo_video_001', 'demo_video_002', 'demo_video_003'];
const DEMO_THREAD_IDS = ['demo_thread_001', 'demo_thread_002', 'demo_thread_003'];
const DEMO_COMMENT_IDS = [
  'demo_comment_001',
  'demo_comment_002',
  'demo_comment_003',
  'demo_comment_004',
  'demo_comment_005',
  'demo_comment_006',
];
const DEMO_RULESET_NAME = 'demo-default';

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

async function resetDemoData(): Promise<void> {
  const pool = getPool();
  await pool.execute('DELETE FROM comment_labels WHERE channel_id = ?', [DEMO_CHANNEL_ID]);
  await pool.execute('DELETE FROM comments WHERE channel_id = ?', [DEMO_CHANNEL_ID]);
  await pool.execute('DELETE FROM comment_threads WHERE channel_id = ?', [DEMO_CHANNEL_ID]);
  await pool.execute('DELETE FROM videos WHERE channel_id = ?', [DEMO_CHANNEL_ID]);
  await pool.execute('DELETE FROM channels WHERE id = ?', [DEMO_CHANNEL_ID]);
  await pool.execute('DELETE FROM sync_state WHERE entity_id = ?', [DEMO_CHANNEL_ID]);
  await pool.execute(
    "DELETE FROM sync_state WHERE entity_type = 'video' AND entity_id IN (?, ?, ?)",
    DEMO_VIDEO_IDS,
  );
  await pool.execute('DELETE FROM rule_sets WHERE name = ?', [DEMO_RULESET_NAME]);
}

export async function seedDemoData(reset: boolean): Promise<void> {
  loadEnv();
  const pool = getPool();
  const now = '2026-02-10 10:00:00';

  if (reset) {
    await resetDemoData();
  }

  await pool.execute(
    `INSERT INTO channels
      (id, title, description, custom_url, published_at, uploads_playlist_id, subscriber_count, video_count, view_count, thumbnail_url, fetched_at)
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
      DEMO_CHANNEL_ID,
      'Demo Creator Channel',
      'Demo data for screenshots and local validation',
      '@demo-creator',
      '2025-01-01 00:00:00',
      'demo_uploads_playlist',
      128000,
      3,
      7600000,
      'https://i.ytimg.com/vi/demo/default.jpg',
      now,
    ],
  );

  const videos = [
    {
      id: DEMO_VIDEO_IDS[0],
      title: 'Website Build Log #1',
      description: 'Backend and frontend implementation walkthrough',
      publishedAt: '2026-01-28 12:00:00',
      views: 110000,
      likes: 7200,
      comments: 350,
      tags: ['backend', 'frontend', 'release'],
    },
    {
      id: DEMO_VIDEO_IDS[1],
      title: 'Optimization and Bug Fix Session',
      description: 'Performance work and crash fixes',
      publishedAt: '2026-02-02 12:00:00',
      views: 98000,
      likes: 6400,
      comments: 290,
      tags: ['performance', 'bugfix', 'typescript'],
    },
    {
      id: DEMO_VIDEO_IDS[2],
      title: 'UI Refactor and Integration Setup',
      description: 'UI polish and Discord webhook integration',
      publishedAt: '2026-02-06 12:00:00',
      views: 86000,
      likes: 6100,
      comments: 240,
      tags: ['ui', 'integration', 'react'],
    },
  ];

  for (const video of videos) {
    await pool.execute(
      `INSERT INTO videos
        (id, channel_id, title, description, published_at, thumbnail_url, view_count, like_count, comment_count, duration, tags, last_synced_at, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        published_at = VALUES(published_at),
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
        DEMO_CHANNEL_ID,
        video.title,
        video.description,
        video.publishedAt,
        `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
        video.views,
        video.likes,
        video.comments,
        'PT12M00S',
        JSON.stringify(video.tags),
        now,
        now,
      ],
    );
  }

  for (let i = 0; i < DEMO_THREAD_IDS.length; i += 1) {
    await pool.execute(
      `INSERT INTO comment_threads
        (id, video_id, channel_id, top_level_comment_id, total_reply_count, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        total_reply_count = VALUES(total_reply_count),
        fetched_at = VALUES(fetched_at)`,
      [
        DEMO_THREAD_IDS[i],
        DEMO_VIDEO_IDS[i],
        DEMO_CHANNEL_ID,
        DEMO_COMMENT_IDS[i * 2],
        1,
        now,
      ],
    );
  }

  const comments = [
    {
      id: DEMO_COMMENT_IDS[0],
      threadId: DEMO_THREAD_IDS[0],
      videoId: DEMO_VIDEO_IDS[0],
      author: 'AlexDev',
      text: 'Great build, but there is a bug in the signup flow.',
      likes: 34,
      category: 'bug',
      lang: 'en',
      keywords: ['bug', 'signup'],
    },
    {
      id: DEMO_COMMENT_IDS[1],
      threadId: DEMO_THREAD_IDS[0],
      videoId: DEMO_VIDEO_IDS[0],
      author: 'MinaAR',
      text: 'في مشكلة في الواجهة والزر مش واضح.',
      likes: 18,
      category: 'ui_ux',
      lang: 'ar',
      keywords: ['واجهة', 'زر'],
    },
    {
      id: DEMO_COMMENT_IDS[2],
      threadId: DEMO_THREAD_IDS[1],
      videoId: DEMO_VIDEO_IDS[1],
      author: 'Francois',
      text: 'Le jeu est lent, gros souci de performance.',
      likes: 21,
      category: 'performance',
      lang: 'fr',
      keywords: ['lent', 'performance'],
    },
    {
      id: DEMO_COMMENT_IDS[3],
      threadId: DEMO_THREAD_IDS[1],
      videoId: DEMO_VIDEO_IDS[1],
      author: 'MariaES',
      text: 'Podrias agregar una funcion para exportar datos?',
      likes: 15,
      category: 'feature_request',
      lang: 'es',
      keywords: ['agregar', 'funcion'],
    },
    {
      id: DEMO_COMMENT_IDS[4],
      threadId: DEMO_THREAD_IDS[2],
      videoId: DEMO_VIDEO_IDS[2],
      author: 'LukasDE',
      text: 'Discord webhook integration waere super.',
      likes: 29,
      category: 'integration',
      lang: 'de',
      keywords: ['discord', 'webhook'],
    },
    {
      id: DEMO_COMMENT_IDS[5],
      threadId: DEMO_THREAD_IDS[2],
      videoId: DEMO_VIDEO_IDS[2],
      author: 'SaraBuilder',
      text: 'Backend and frontend work is impressive.',
      likes: 11,
      category: 'development',
      lang: 'en',
      keywords: ['backend', 'frontend'],
    },
  ];

  for (const comment of comments) {
    await pool.execute(
      `INSERT INTO comments
        (id, thread_id, video_id, channel_id, author_display_name, author_channel_id, text_original, text_display, like_count, published_at, updated_at, is_reply, parent_id, fetched_at)
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
        DEMO_CHANNEL_ID,
        comment.author,
        null,
        comment.text,
        comment.text,
        comment.likes,
        now,
        now,
        false,
        null,
        now,
      ],
    );
  }

  const demoRules = {
    ruleSet: {
      name: DEMO_RULESET_NAME,
      version: '1.0.0',
      languages: ['ar', 'en', 'fr', 'es', 'de'],
      global: {
        minScore: 1,
        negativeKeywords: ['spam'],
      },
      categories: {
        bug: { score: 3, keywords: { en: ['bug'], ar: ['مشكلة'] } },
        performance: { score: 2, keywords: { fr: ['lent'], en: ['slow'] } },
        ui_ux: { score: 2, keywords: { ar: ['واجهة'], en: ['ui'] } },
        feature_request: { score: 2, keywords: { es: ['agregar'], en: ['add'] } },
        integration: { score: 2, keywords: { de: ['discord'], en: ['webhook'] } },
        development: { score: 2, keywords: { en: ['backend', 'frontend'] } },
      },
    },
  };
  const rulesJson = JSON.stringify(demoRules);
  const rulesHash = sha256(rulesJson);

  await pool.execute('UPDATE rule_sets SET is_active = FALSE WHERE is_active = TRUE');
  await pool.execute(
    `INSERT INTO rule_sets (name, version, rules_json, rules_hash, is_active)
     VALUES (?, ?, ?, ?, TRUE)
     ON DUPLICATE KEY UPDATE
      version = VALUES(version),
      rules_json = VALUES(rules_json),
      rules_hash = VALUES(rules_hash),
      is_active = TRUE`,
    [DEMO_RULESET_NAME, '1.0.0', rulesJson, rulesHash],
  );

  for (const comment of comments) {
    await pool.execute(
      `INSERT INTO comment_labels
        (comment_id, video_id, channel_id, category, score, matched_keywords, matched_language, rule_set_name, rule_set_version, rule_set_hash, labeled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        score = VALUES(score),
        matched_keywords = VALUES(matched_keywords),
        matched_language = VALUES(matched_language),
        rule_set_version = VALUES(rule_set_version),
        labeled_at = VALUES(labeled_at)`,
      [
        comment.id,
        comment.videoId,
        DEMO_CHANNEL_ID,
        comment.category,
        2,
        JSON.stringify(comment.keywords),
        comment.lang,
        DEMO_RULESET_NAME,
        '1.0.0',
        rulesHash,
        now,
      ],
    );
  }

  await pool.execute(
    `INSERT INTO sync_state (entity_type, entity_id, last_page_token, last_synced_at, items_synced)
     VALUES ('channel', ?, NULL, ?, ?)
     ON DUPLICATE KEY UPDATE
      last_synced_at = VALUES(last_synced_at),
      items_synced = VALUES(items_synced)`,
    [DEMO_CHANNEL_ID, now, DEMO_VIDEO_IDS.length],
  );

  for (const videoId of DEMO_VIDEO_IDS) {
    await pool.execute(
      `INSERT INTO sync_state (entity_type, entity_id, last_page_token, last_synced_at, items_synced)
       VALUES ('video', ?, NULL, ?, ?)
       ON DUPLICATE KEY UPDATE
        last_synced_at = VALUES(last_synced_at),
        items_synced = VALUES(items_synced)`,
      [videoId, now, 2],
    );
  }

  logger.info(
    { channelId: DEMO_CHANNEL_ID, videos: DEMO_VIDEO_IDS.length, comments: comments.length },
    'Demo data seeded',
  );
}

async function main(): Promise<void> {
  const reset = process.argv.includes('--reset');
  try {
    await seedDemoData(reset);
    await closePool();
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Demo seeding failed');
    await closePool();
    process.exit(1);
  }
}

const isDirectRun = process.argv[1]?.includes('seed-demo');
if (isDirectRun) {
  void main();
}
