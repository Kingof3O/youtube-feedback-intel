-- 006_create_comment_labels.sql
CREATE TABLE IF NOT EXISTS comment_labels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id VARCHAR(64) NOT NULL,
  video_id VARCHAR(64) NOT NULL,
  channel_id VARCHAR(64) NOT NULL,
  category VARCHAR(64) NOT NULL,
  score INT NOT NULL,
  matched_keywords JSON NOT NULL,
  matched_language VARCHAR(8) NOT NULL,
  rule_set_name VARCHAR(128) NOT NULL,
  rule_set_version VARCHAR(32) NOT NULL,
  rule_set_hash VARCHAR(64) NOT NULL,
  labeled_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_labels_category (category, labeled_at),
  INDEX idx_labels_comment (comment_id),
  INDEX idx_labels_video (video_id),
  INDEX idx_labels_channel (channel_id),
  UNIQUE KEY uq_label (comment_id, category, rule_set_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
