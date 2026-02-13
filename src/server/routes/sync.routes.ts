import type { Express } from 'express';
import { syncChannelHandler } from '../handlers/sync.handler.js';

export function registerSyncRoutes(app: Express): void {
  app.post('/api/sync/channel', syncChannelHandler);
}
