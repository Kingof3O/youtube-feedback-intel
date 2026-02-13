import type { Express } from 'express';
import { getFeedback } from '../handlers/feedback.handler.js';

export function registerFeedbackRoutes(app: Express): void {
  app.get('/api/feedback', getFeedback);
}
