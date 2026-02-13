-- 003_create_comment_threads.sql
CREATE TABLE IF NOT EXISTS comment_threads (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  video_id VARCHAR(64) NOT NULL,
  channel_id VARCHAR(64) NOT NULL,
  top_level_comment_id VARCHAR(64) NOT NULL,
  total_reply_count INT NOT NULL DEFAULT 0,
  fetched_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_threads_video (video_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
