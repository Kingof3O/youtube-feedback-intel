-- 002_create_videos.sql
CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  channel_id VARCHAR(64) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  published_at DATETIME NOT NULL,
  thumbnail_url VARCHAR(512),
  view_count BIGINT,
  like_count BIGINT,
  comment_count BIGINT,
  duration VARCHAR(32),
  tags JSON,
  last_synced_at DATETIME,
  fetched_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_videos_channel_published (channel_id, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
