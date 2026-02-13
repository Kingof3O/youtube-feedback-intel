import { getPool } from '../mysql.pool.js';
import type { RuleSetRecord } from '../../domain/types/index.js';

export async function upsertRuleSet(rs: RuleSetRecord): Promise<void> {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO rule_sets (name, version, rules_json, rules_hash, is_active)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       version = VALUES(version),
       rules_json = VALUES(rules_json),
       rules_hash = VALUES(rules_hash)`,
    [rs.name, rs.version, rs.rulesJson, rs.rulesHash, rs.isActive],
  );
}

export async function getActiveRuleSet(): Promise<RuleSetRecord | null> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM rule_sets WHERE is_active = TRUE LIMIT 1');
  const arr = rows as Array<Record<string, unknown>>;
  if (arr.length === 0) return null;
  return mapRow(arr[0]);
}

export async function getRuleSetByName(name: string): Promise<RuleSetRecord | null> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM rule_sets WHERE name = ?', [name]);
  const arr = rows as Array<Record<string, unknown>>;
  if (arr.length === 0) return null;
  return mapRow(arr[0]);
}

export async function listRuleSets(): Promise<RuleSetRecord[]> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM rule_sets ORDER BY created_at DESC');
  return (rows as Array<Record<string, unknown>>).map(mapRow);
}

export async function activateRuleSet(name: string): Promise<boolean> {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Deactivate all
    await conn.execute('UPDATE rule_sets SET is_active = FALSE');
    // Activate the one
    const [result] = await conn.execute('UPDATE rule_sets SET is_active = TRUE WHERE name = ?', [
      name,
    ]);
    await conn.commit();
    return (result as { affectedRows: number }).affectedRows > 0;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

function mapRow(row: Record<string, unknown>): RuleSetRecord {
  return {
    id: row.id as number,
    name: row.name as string,
    version: row.version as string,
    rulesJson: typeof row.rules_json === 'string' ? row.rules_json : JSON.stringify(row.rules_json),
    rulesHash: row.rules_hash as string,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}
