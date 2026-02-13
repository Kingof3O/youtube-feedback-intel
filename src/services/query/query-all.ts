import * as commentsRepo from '../../db/repositories/comments.repo.js';
import * as labelsRepo from '../../db/repositories/labels.repo.js';
import type { FeedbackResult } from '../../domain/types/index.js';
import { VideoTitleCache } from './video-title-cache.js';
import type { QueryOptions } from './types.js';

export async function queryAllFeedback(
  options: QueryOptions,
): Promise<FeedbackResult[]> {
  const comments = await commentsRepo.queryComments({
    channelId: options.channelId,
    videoId: options.videoId,
    search: options.contains,
    minLikes: options.minLikes,
    since: options.since,
    until: options.until,
    limit: options.limit ?? 20,
    offset: options.offset ?? 0,
  });
  if (comments.length === 0) return [];

  const commentIds = comments.map((c) => c.id);
  const labels = await labelsRepo.getLabelsByCommentIds(commentIds);
  const labelsByComment = new Map<string, typeof labels>();

  for (const label of labels) {
    const existing = labelsByComment.get(label.commentId) ?? [];
    existing.push(label);
    labelsByComment.set(label.commentId, existing);
  }

  const cache = new VideoTitleCache();
  const results: FeedbackResult[] = [];
  for (const comment of comments) {
    results.push({
      comment,
      labels: labelsByComment.get(comment.id) ?? [],
      videoTitle: await cache.get(comment.videoId),
    });
  }
  return results;
}
