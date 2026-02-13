import type { Express } from 'express';
import { getDashboard } from '../handlers/dashboard.handler.js';

export function registerDashboardRoutes(app: Express): void {
  app.get('/api/dashboard', getDashboard);
}
