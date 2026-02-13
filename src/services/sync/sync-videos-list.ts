import { fetchVideoDetails } from '../../integrations/youtube/youtube.client.js';
import { nowISO } from '../../utils/time.js';
import { logger } from '../../utils/logger.js';
import * as videosRepo from '../../db/repositories/videos.repo.js';
import { syncVideoComments } from './comments-sync.js';

export async function syncVideosList(
  videoIds: string[],
  maxCommentsPerVideo = 2000,
  dryRun = false,
) {
  logger.info({ videoIds, dryRun }, 'Syncing video list');

  const videos = await fetchVideoDetails(videoIds);

  if (!dryRun) {
    for (const video of videos) {
      await videosRepo.upsertVideo({ ...video, lastSyncedAt: nowISO() });
    }
  }

  let totalComments = 0;
  for (const video of videos) {
    totalComments += await syncVideoComments(
      video.id,
      video.channelId,
      maxCommentsPerVideo,
      dryRun,
    );
  }

  return { videosSynced: videos.length, commentsSynced: totalComments, dryRun };
}
