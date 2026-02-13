import { getEnv } from '../../config/env.js';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface EndpointParams {
  [key: string]: string | number | boolean | undefined;
}

function buildUrl(path: string, params: EndpointParams): string {
  const env = getEnv();
  const url = new URL(`${BASE_URL}/${path}`);
  url.searchParams.set('key', env.YOUTUBE_API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export function channelUrl(channelId: string): string {
  return buildUrl('channels', {
    part: 'snippet,contentDetails,statistics',
    id: channelId,
  });
}

export function playlistItemsUrl(playlistId: string, maxResults = 50, pageToken?: string): string {
  return buildUrl('playlistItems', {
    part: 'contentDetails',
    playlistId,
    maxResults,
    pageToken,
  });
}

export function videosUrl(videoIds: string[]): string {
  return buildUrl('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoIds.join(','),
  });
}

export function commentThreadsUrl(
  videoId: string,
  maxResults = 100,
  pageToken?: string,
): string {
  return buildUrl('commentThreads', {
    part: 'snippet,replies',
    videoId,
    maxResults,
    pageToken,
    order: 'time',
  });
}
