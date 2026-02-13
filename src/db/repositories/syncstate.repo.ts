import { getPool } from '../mysql.pool.js';
import type { SyncState } from '../../domain/types/index.js';

export async function upsertSyncState(state: SyncState): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO sync_state (entity_type, entity_id, last_page_token, last_synced_at, items_synced)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       last_page_token = VALUES(last_page_token),
       last_synced_at = VALUES(last_synced_at),
       items_synced = VALUES(items_synced)`,
    [
      state.entityType,
      state.entityId,
      state.lastPageToken ?? null,
      state.lastSyncedAt ?? null,
      state.itemsSynced,
    ],
  );
}

export async function getSyncState(
  entityType: 'channel' | 'video',
  entityId: string,
): Promise<SyncState | null> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT * FROM sync_state WHERE entity_type = ? AND entity_id = ?',
    [entityType, entityId],
  );
  const arr = rows as Array<Record<string, unknown>>;
  if (arr.length === 0) return null;
  return mapRow(arr[0]);
}

function mapRow(row: Record<string, unknown>): SyncState {
  return {
    id: row.id as number,
    entityType: row.entity_type as 'channel' | 'video',
    entityId: row.entity_id as string,
    lastPageToken: row.last_page_token as string | undefined,
    lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : undefined,
    itemsSynced: row.items_synced as number,
  };
}
