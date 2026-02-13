import type { Request, Response, NextFunction } from 'express';
import { getDashboardStats } from '../../db/repositories/dashboard.repo.js';

export async function getDashboard(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
