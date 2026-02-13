import { fetchVideoDetails } from '../../integrations/youtube/youtube.client.js';
import { nowISO } from '../../utils/time.js';
import { logger } from '../../utils/logger.js';
import * as videosRepo from '../../db/repositories/videos.repo.js';
import { classifyVideo } from '../classify.service.js';
import { syncVideoComments } from './comments-sync.js';
import type { SyncVideoOptions } from './types.js';

export async function syncVideo(options: SyncVideoOptions) {
  const { videoId, maxComments = 2000, dryRun = false } = options;

  logger.info({ videoId, dryRun }, 'Syncing single video');

  const videos = await fetchVideoDetails([videoId]);
  if (videos.length === 0) {
    throw new Error(`Video not found: ${videoId}`);
  }

  const video = videos[0];
  const channelId = options.channelId ?? video.channelId;

  if (!dryRun) {
    await videosRepo.upsertVideo({ ...video, lastSyncedAt: nowISO() });
  }

  const commentCount = await syncVideoComments(
    videoId,
    channelId,
    maxComments,
    dryRun,
  );

  if (!dryRun) {
    await classifyVideo(videoId);
  }

  return { videoId, title: video.title, commentsSynced: commentCount, dryRun };
}
