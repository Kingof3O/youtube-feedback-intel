import mysql from 'mysql2/promise';
import { getEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';

let pool: mysql.Pool | undefined;

export function getPool(): mysql.Pool {
  if (pool) return pool;

  const env = getEnv();

  pool = mysql.createPool({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    timezone: '+00:00',
  });

  logger.info('MySQL connection pool created');
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
    logger.info('MySQL connection pool closed');
  }
}

export async function withConnection<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>,
): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    return await fn(conn);
  } finally {
    conn.release();
  }
}
