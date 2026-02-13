import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { getPool, closePool } from './mysql.pool.js';
import { loadEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MIGRATIONS_DIR = join(__dirname, 'migrations');

async function ensureMigrationsTable(): Promise<void> {
  const pool = getPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT name FROM _migrations ORDER BY id');
  return new Set((rows as Array<{ name: string }>).map((r) => r.name));
}

async function applyMigration(name: string, sql: string): Promise<void> {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Split by semicolon for multi-statement migrations
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await conn.execute(stmt);
    }
    await conn.execute('INSERT INTO _migrations (name) VALUES (?)', [name]);
    await conn.commit();
    logger.info({ migration: name }, 'Migration applied');
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function runMigrations(): Promise<void> {
  loadEnv();
  logger.info('Running database migrations…');

  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) {
      logger.debug({ migration: file }, 'Already applied, skipping');
      continue;
    }

    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    await applyMigration(file, sql);
    count++;
  }

  if (count === 0) {
    logger.info('No new migrations to apply');
  } else {
    logger.info({ count }, 'Migrations complete');
  }
}

// Allow running directly: tsx src/db/migrate.ts
const isDirectRun = process.argv[1]?.includes('migrate');
if (isDirectRun) {
  runMigrations()
    .then(() => closePool())
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error(err, 'Migration failed');
      closePool().finally(() => process.exit(1));
    });
}
