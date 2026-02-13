import { classifyChannel } from '../services/classify.service.js';
import { getPool } from '../db/mysql.pool.js';
import { logger } from '../utils/logger.js';

interface ChannelIdRow {
  id: string;
}

async function main() {
  try {
    const pool = getPool();
    const [rows] = await pool.execute('SELECT id FROM channels');
    const channels = rows as ChannelIdRow[];
    
    logger.info({ count: channels.length }, 'Starting classification for all channels');
    
    for (const channel of channels) {
      logger.info({ channelId: channel.id }, 'Classifying existing comments for channel');
      await classifyChannel(channel.id);
    }
    
    logger.info('Bulk classification complete');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Bulk classification failed');
    process.exit(1);
  }
}

main();
