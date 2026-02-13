import { fetch } from 'undici';
import { logger } from '../../utils/logger.js';
import { YouTubeApiError } from '../../utils/errors.js';
import { withRetry } from './youtube.retry.js';
import {
  channelUrl,
  playlistItemsUrl,
  videosUrl,
  commentThreadsUrl,
} from './youtube.endpoints.js';
import { mapChannel, mapVideo, mapCommentThread } from './youtube.mappers.js';
import type { PaginatedResult } from './youtube.pagination.js';
import type { Channel, Video, CommentThread, Comment } from '../../domain/types/index.js';
import type {
  ChannelApiResponse,
  PlaylistItemsApiResponse,
  VideosApiResponse,
  CommentThreadsApiResponse,
} from './youtube.api-types.js';

async function ytGet<T>(url: string): Promise<T> {
  const logUrl = url.replace(/key=[^&]+/, 'key=***');
  logger.debug({ url: logUrl }, 'YouTube API request');

  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    logger.error({ status: response.status, body: body.slice(0, 500) }, 'YouTube API error');
    throw new YouTubeApiError(
      `YouTube API returned ${response.status}: ${body.slice(0, 200)}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

export async function fetchChannel(channelId: string): Promise<Channel> {
  const data = await withRetry(
    () => ytGet<ChannelApiResponse>(channelUrl(channelId)),
    `channel:${channelId}`,
  );

  if (!data.items || data.items.length === 0) {
    throw new YouTubeApiError(`Channel not found: ${channelId}`, 404);
  }

  return mapChannel(data.items[0]);
}

export async function fetchPlaylistPage(
  playlistId: string,
  pageToken?: string,
): Promise<PaginatedResult<string>> {
  const data = await withRetry(
    () => ytGet<PlaylistItemsApiResponse>(playlistItemsUrl(playlistId, 50, pageToken)),
    `playlist:${playlistId}`,
  );

  return {
    items: (data.items ?? []).map((item) => item.contentDetails.videoId),
    nextPageToken: data.nextPageToken,
    totalResults: data.pageInfo?.totalResults,
  };
}

export async function fetchVideoDetails(videoIds: string[]): Promise<Video[]> {
  if (videoIds.length === 0) return [];

  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50));
  }

  const results: Video[] = [];
  for (const batch of batches) {
    const data = await withRetry(
      () => ytGet<VideosApiResponse>(videosUrl(batch)),
      `videos:${batch.length} ids`,
    );

    for (const item of data.items ?? []) {
      results.push(mapVideo(item));
    }
  }

  return results;
}

export async function fetchCommentThreads(
  videoId: string,
  channelId: string,
  maxComments = 2000,
): Promise<{ threads: CommentThread[]; comments: Comment[] }> {
  const allThreads: CommentThread[] = [];
  const allComments: Comment[] = [];
  let pageToken: string | undefined;
  let totalFetched = 0;

  logger.info({ videoId, maxComments }, 'Fetching comment threads');

  while (totalFetched < maxComments) {
    const data = await withRetry(
      () => ytGet<CommentThreadsApiResponse>(commentThreadsUrl(videoId, 100, pageToken)),
      `comments:${videoId}`,
    );

    if (!data.items || data.items.length === 0) break;

    for (const item of data.items) {
      const { thread, comments } = mapCommentThread(item, channelId);
      allThreads.push(thread);
      allComments.push(...comments);
      totalFetched += comments.length;
      if (totalFetched >= maxComments) break;
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  logger.info(
    { videoId, threads: allThreads.length, comments: allComments.length },
    'Comment threads fetched',
  );
  return { threads: allThreads, comments: allComments };
}
