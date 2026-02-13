import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';
import { ConfigError } from '../utils/errors.js';

// Load .env file
dotenvConfig();

const envSchema = z.object({
  YOUTUBE_API_KEY: z.string().min(1, 'YOUTUBE_API_KEY is required'),
  MYSQL_HOST: z.string().default('localhost'),
  MYSQL_PORT: z.coerce.number().default(3306),
  MYSQL_USER: z.string().default('root'),
  MYSQL_PASSWORD: z.string().default(''),
  MYSQL_DATABASE: z.string().default('youtube_feedback_intel'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DEFAULT_CHANNEL_ID: z.string().optional(),
  SYNC_MAX_VIDEOS: z.coerce.number().default(500),
  SYNC_MAX_COMMENTS_PER_VIDEO: z.coerce.number().default(2000),
});

export type EnvConfig = z.infer<typeof envSchema>;

let _env: EnvConfig | undefined;

export function loadEnv(): EnvConfig {
  if (_env) return _env;

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new ConfigError(`Environment validation failed:\n${issues}`);
  }

  _env = result.data;
  return _env;
}

export function getEnv(): EnvConfig {
  if (!_env) return loadEnv();
  return _env;
}
