import type { Request, Response, NextFunction } from 'express';
import { getPool } from '../../db/mysql.pool.js';

export async function listChannels(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT * FROM channels ORDER BY fetched_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
