import type { Express } from 'express';
import { listChannels } from '../handlers/channels.handler.js';

export function registerChannelsRoutes(app: Express): void {
  app.get('/api/channels', listChannels);
}
