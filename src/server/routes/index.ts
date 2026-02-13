import type { Express } from 'express';
import { registerDashboardRoutes } from './dashboard.routes.js';
import { registerChannelsRoutes } from './channels.routes.js';
import { registerSyncRoutes } from './sync.routes.js';
import { registerFeedbackRoutes } from './feedback.routes.js';
import { registerRulesRoutes } from './rules.routes.js';

export function registerRoutes(app: Express): void {
  registerDashboardRoutes(app);
  registerChannelsRoutes(app);
  registerSyncRoutes(app);
  registerFeedbackRoutes(app);
  registerRulesRoutes(app);
}
