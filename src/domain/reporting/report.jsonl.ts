import type { ReportData, FeedbackResult } from '../types/index.js';

/**
 * Generate a JSONL report (one JSON object per line).
 */
export function generateJsonlReport(data: ReportData): string {
  const lines: string[] = [];

  // Header line
  lines.push(
    JSON.stringify({
      type: 'header',
      channelId: data.channelId,
      channelTitle: data.channelTitle,
      since: data.since,
      until: data.until,
      totalComments: data.totalComments,
      totalFeedback: data.totalFeedback,
      categorySummary: data.categorySummary,
    }),
  );

  // One line per feedback item
  for (const item of data.items) {
    lines.push(JSON.stringify(formatItem(item)));
  }

  return lines.join('\n') + '\n';
}

function formatItem(item: FeedbackResult) {
  return {
    type: 'feedback',
    commentId: item.comment.id,
    videoId: item.comment.videoId,
    videoTitle: item.videoTitle,
    author: item.comment.authorDisplayName,
    text: item.comment.textOriginal,
    likeCount: item.comment.likeCount,
    publishedAt: item.comment.publishedAt,
    labels: item.labels.map((l) => ({
      category: l.category,
      score: l.score,
      matchedKeywords: l.matchedKeywords,
      matchedLanguage: l.matchedLanguage,
    })),
  };
}
