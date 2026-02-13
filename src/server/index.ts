import express from 'express';
import cors from 'cors';
import { loadEnv } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { closePool } from '../db/mysql.pool.js';
import { registerRoutes } from './routes/index.js';

const app = express();
loadEnv();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'API Request');
  next();
});

// Register routes
registerRoutes(app);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err, 'API Error');
  res.status(500).json({ error: err.message });
});

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'API Server started');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down...');
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down...');
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
});
