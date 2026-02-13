import * as commentsRepo from '../../db/repositories/comments.repo.js';
import * as labelsRepo from '../../db/repositories/labels.repo.js';
import type { FeedbackResult } from '../../domain/types/index.js';
import { VideoTitleCache } from './video-title-cache.js';
import type { QueryOptions } from './types.js';

export async function queryClassifiedFeedback(
  options: QueryOptions,
): Promise<FeedbackResult[]> {
  const labels = await labelsRepo.queryLabels({
    channelId: options.channelId,
    videoId: options.videoId,
    category: options.category,
    since: options.since,
    until: options.until,
    limit: options.limit ?? 200,
  });
  if (labels.length === 0) return [];

  const labelsByComment = new Map<string, typeof labels>();
  for (const label of labels) {
    const existing = labelsByComment.get(label.commentId) ?? [];
    existing.push(label);
    labelsByComment.set(label.commentId, existing);
  }

  const ids = Array.from(labelsByComment.keys());
  const comments = await commentsRepo.getCommentsByIds(ids);
  const commentById = new Map(comments.map((comment) => [comment.id, comment]));

  const cache = new VideoTitleCache();
  const results: FeedbackResult[] = [];

  for (const [commentId, commentLabels] of labelsByComment.entries()) {
    const comment = commentById.get(commentId);
    if (!comment) continue;

    if (options.contains) {
      const lower = options.contains.toLowerCase();
      if (!comment.textOriginal.toLowerCase().includes(lower)) continue;
    }

    if (options.minLikes && comment.likeCount < options.minLikes) {
      continue;
    }

    results.push({
      comment,
      labels: commentLabels,
      videoTitle: await cache.get(comment.videoId),
    });
  }

  return results;
}
