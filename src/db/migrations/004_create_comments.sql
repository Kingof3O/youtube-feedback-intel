-- 004_create_comments.sql
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  thread_id VARCHAR(64) NOT NULL,
  video_id VARCHAR(64) NOT NULL,
  channel_id VARCHAR(64) NOT NULL,
  author_display_name VARCHAR(255),
  author_channel_id VARCHAR(64),
  text_original TEXT NOT NULL,
  text_display TEXT NOT NULL,
  like_count INT NOT NULL DEFAULT 0,
  published_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  is_reply BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id VARCHAR(64),
  fetched_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_comments_video_published (video_id, published_at),
  INDEX idx_comments_channel (channel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
