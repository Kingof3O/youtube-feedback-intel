-- 001_create_channels.sql
CREATE TABLE IF NOT EXISTS channels (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  custom_url VARCHAR(255),
  published_at DATETIME,
  uploads_playlist_id VARCHAR(64),
  subscriber_count BIGINT,
  video_count INT,
  view_count BIGINT,
  thumbnail_url VARCHAR(512),
  fetched_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
