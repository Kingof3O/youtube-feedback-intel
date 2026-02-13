import { loadEnv } from '../../config/env.js';
import { closePool } from '../../db/mysql.pool.js';

export async function runWithEnv(action: () => Promise<void>): Promise<void> {
  loadEnv();
  try {
    await action();
  } finally {
    await closePool();
  }
}
