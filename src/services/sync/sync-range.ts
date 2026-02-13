import { fetchChannel } from '../../integrations/youtube/youtube.client.js';
import { logger } from '../../utils/logger.js';
import * as channelsRepo from '../../db/repositories/channels.repo.js';
import * as videosRepo from '../../db/repositories/videos.repo.js';
import { syncVideoComments } from './comments-sync.js';
import { fetchVideosFromPlaylist } from './video-selection.js';
import type { SyncRangeOptions } from './types.js';

export async function syncRange(options: SyncRangeOptions) {
  const {
    channelId,
    from,
    to,
    maxVideos = 500,
    maxCommentsPerVideo = 2000,
    dryRun = false,
  } = options;

  logger.info(
    { channelId, from: from.toISOString(), to: to.toISOString(), dryRun },
    'Range sync',
  );

  const channel = await fetchChannel(channelId);
  if (!dryRun) {
    await channelsRepo.upsertChannel(channel);
  }

  const videos = await fetchVideosFromPlaylist(
    channel.uploadsPlaylistId,
    from,
    to,
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

  return {
    channelId,
    from: from.toISOString(),
    to: to.toISOString(),
    videosSynced: videos.length,
    commentsSynced: totalComments,
    dryRun,
  };
}
