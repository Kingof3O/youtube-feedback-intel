-- 007_create_sync_state.sql
CREATE TABLE IF NOT EXISTS sync_state (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('channel','video') NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  last_page_token VARCHAR(256),
  last_synced_at DATETIME,
  items_synced INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sync_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
