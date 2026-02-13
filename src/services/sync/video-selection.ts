import { fetchPlaylistPage, fetchVideoDetails } from '../../integrations/youtube/youtube.client.js';
import { isWithinRange } from '../../utils/time.js';
import type { Video } from '../../domain/types/index.js';

export async function fetchVideosFromPlaylist(
  playlistId: string,
  from: Date,
  to: Date,
  maxVideos: number,
): Promise<Video[]> {
  const allVideos: Video[] = [];
  let pageToken: string | undefined;

  while (allVideos.length < maxVideos) {
    const page = await fetchPlaylistPage(playlistId, pageToken);
    if (page.items.length === 0) break;

    const details = await fetchVideoDetails(page.items);
    let stoppedEarly = false;

    for (const video of details) {
      const publishedAt = new Date(video.publishedAt);

      // Uploads playlist is newest -> oldest, so we can stop once below range.
      if (publishedAt < from) {
        stoppedEarly = true;
        break;
      }

      if (isWithinRange(publishedAt, from, to)) {
        allVideos.push(video);
        if (allVideos.length >= maxVideos) break;
      }
    }

    if (stoppedEarly) break;

    pageToken = page.nextPageToken;
    if (!pageToken) break;
  }

  return allVideos;
}
