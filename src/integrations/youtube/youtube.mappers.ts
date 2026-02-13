import type { Channel, Video, CommentThread, Comment } from '../../domain/types/index.js';
import { nowISO } from '../../utils/time.js';
import { stripHtml } from '../../utils/text.js';
import type {
  ChannelApiItem,
  VideoApiItem,
  CommentThreadApiItem,
  CommentApiItem,
} from './youtube.api-types.js';

export function mapChannel(item: ChannelApiItem): Channel {
  const { snippet, contentDetails, statistics } = item;
  return {
    id: item.id,
    title: snippet.title,
    description: snippet.description ?? '',
    customUrl: snippet.customUrl,
    publishedAt: snippet.publishedAt,
    uploadsPlaylistId: contentDetails?.relatedPlaylists?.uploads ?? '',
    subscriberCount: statistics?.subscriberCount
      ? Number(statistics.subscriberCount)
      : undefined,
    videoCount: statistics?.videoCount ? Number(statistics.videoCount) : undefined,
    viewCount: statistics?.viewCount ? Number(statistics.viewCount) : undefined,
    thumbnailUrl: snippet.thumbnails?.default?.url,
    fetchedAt: nowISO(),
  };
}

export function mapVideo(item: VideoApiItem): Video {
  const { snippet, statistics, contentDetails } = item;
  return {
    id: item.id,
    channelId: snippet.channelId,
    title: snippet.title,
    description: snippet.description ?? '',
    publishedAt: snippet.publishedAt,
    thumbnailUrl: snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url,
    viewCount: statistics?.viewCount ? Number(statistics.viewCount) : undefined,
    likeCount: statistics?.likeCount ? Number(statistics.likeCount) : undefined,
    commentCount: statistics?.commentCount ? Number(statistics.commentCount) : undefined,
    duration: contentDetails?.duration,
    tags: snippet.tags,
    fetchedAt: nowISO(),
  };
}

export function mapCommentThread(
  item: CommentThreadApiItem,
  channelId: string,
): {
  thread: CommentThread;
  comments: Comment[];
} {
  const videoId = item.snippet.videoId;
  const topComment = item.snippet.topLevelComment;
  const thread: CommentThread = {
    id: item.id,
    videoId,
    channelId,
    topLevelCommentId: topComment.id,
    totalReplyCount: item.snippet.totalReplyCount ?? 0,
    fetchedAt: nowISO(),
  };

  const comments: Comment[] = [];
  comments.push(mapSingleComment(topComment, item.id, videoId, channelId, false));

  for (const reply of item.replies?.comments ?? []) {
    comments.push(
      mapSingleComment(reply, item.id, videoId, channelId, true, topComment.id),
    );
  }

  return { thread, comments };
}

function mapSingleComment(
  comment: CommentApiItem,
  threadId: string,
  videoId: string,
  channelId: string,
  isReply: boolean,
  parentId?: string,
): Comment {
  const snippet = comment.snippet;
  return {
    id: comment.id,
    threadId,
    videoId,
    channelId,
    authorDisplayName: snippet.authorDisplayName ?? 'Unknown',
    authorChannelId: snippet.authorChannelId?.value,
    textOriginal: snippet.textOriginal ?? stripHtml(snippet.textDisplay ?? ''),
    textDisplay: snippet.textDisplay ?? '',
    likeCount: snippet.likeCount ?? 0,
    publishedAt: snippet.publishedAt,
    updatedAt: snippet.updatedAt ?? snippet.publishedAt,
    isReply,
    parentId,
    fetchedAt: nowISO(),
  };
}
