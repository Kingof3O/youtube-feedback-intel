import { fetchChannel } from '../../integrations/youtube/youtube.client.js';
import { getEnv } from '../../config/env.js';
import { daysAgo, nowISO } from '../../utils/time.js';
import { logger } from '../../utils/logger.js';
import * as channelsRepo from '../../db/repositories/channels.repo.js';
import * as videosRepo from '../../db/repositories/videos.repo.js';
import * as syncstateRepo from '../../db/repositories/syncstate.repo.js';
import { classifyChannel } from '../classify.service.js';
import { syncVideoComments } from './comments-sync.js';
import { fetchVideosFromPlaylist } from './video-selection.js';
import type { SyncChannelOptions } from './types.js';

export async function syncChannel(options: SyncChannelOptions) {
  const env = getEnv();
  const {
    channelId,
    days = 14,
    maxVideos = env.SYNC_MAX_VIDEOS,
    maxCommentsPerVideo = env.SYNC_MAX_COMMENTS_PER_VIDEO,
    dryRun = false,
  } = options;

  logger.info(
    { channelId, days, maxVideos, maxCommentsPerVideo, dryRun },
    'Starting channel sync',
  );

  const channel = await fetchChannel(channelId);
  if (!dryRun) {
    await channelsRepo.upsertChannel(channel);
  }

  const sinceDate = daysAgo(days);
  const videos = await fetchVideosFromPlaylist(
    channel.uploadsPlaylistId,
    sinceDate,
    new Date(),
    maxVideos,
  );

  if (!dryRun) {
    await videosRepo.upsertVideos(videos);
  }

  let totalComments = 0;
  for (const video of videos) {
    totalComments += await syncVideoComments(
      video.id,
      channelId,
      maxCommentsPerVideo,
      dryRun,
    );
  }

  if (!dryRun) {
    await syncstateRepo.upsertSyncState({
      entityType: 'channel',
      entityId: channelId,
      lastSyncedAt: nowISO(),
      itemsSynced: videos.length,
    });
    await classifyChannel(channelId);
  }

  const summary = {
    channelId,
    channelTitle: channel.title,
    videosSynced: videos.length,
    commentsSynced: totalComments,
    dryRun,
  };
  logger.info(summary, 'Channel sync complete');
  return summary;
}
