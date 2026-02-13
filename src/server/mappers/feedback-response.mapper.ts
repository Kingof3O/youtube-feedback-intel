import type { FeedbackResult } from '../../domain/types/index.js';

export interface FeedbackApiResponseItem {
  commentId: string;
  text: string;
  author: string;
  likes: number;
  date: string;
  videoId: string;
  videoTitle: string;
  labels: Array<{
    category: string;
    score: number;
    keywords: string[];
    lang: string;
  }>;
}

export function mapFeedbackResultsToApi(
  results: FeedbackResult[],
): FeedbackApiResponseItem[] {
  return results.map((r) => ({
    commentId: r.comment.id,
    text: r.comment.textOriginal,
    author: r.comment.authorDisplayName,
    likes: r.comment.likeCount,
    date: r.comment.publishedAt,
    videoId: r.comment.videoId,
    videoTitle: r.videoTitle,
    labels: r.labels.map((l) => ({
      category: l.category,
      score: l.score,
      keywords: l.matchedKeywords,
      lang: l.matchedLanguage,
    })),
  }));
}
