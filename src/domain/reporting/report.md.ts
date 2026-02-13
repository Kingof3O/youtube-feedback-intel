import type { ReportData, FeedbackResult } from '../types/index.js';
import { toDateString } from '../../utils/time.js';

/**
 * Generate a Markdown report from report data.
 */
export function generateMarkdownReport(data: ReportData): string {
  const lines: string[] = [];

  lines.push(`# Feedback Report: ${data.channelTitle}`);
  lines.push('');
  lines.push(`**Channel ID:** ${data.channelId}`);
  lines.push(`**Period:** ${data.since} → ${data.until}`);
  lines.push(`**Generated:** ${toDateString(new Date())}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Comments Analyzed | ${data.totalComments} |`);
  lines.push(`| Feedback Detected | ${data.totalFeedback} |`);
  lines.push('');

  if (Object.keys(data.categorySummary).length > 0) {
    lines.push('### By Category');
    lines.push('');
    lines.push('| Category | Count |');
    lines.push('|----------|-------|');
    for (const [cat, count] of Object.entries(data.categorySummary).sort(
      (a, b) => b[1] - a[1],
    )) {
      lines.push(`| ${cat} | ${count} |`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Feedback Details');
  lines.push('');

  if (data.items.length === 0) {
    lines.push('_No feedback found for this period._');
  } else {
    for (const item of data.items) {
      lines.push(formatFeedbackItem(item));
      lines.push('');
    }
  }

  return lines.join('\n');
}

function formatFeedbackItem(item: FeedbackResult): string {
  const lines: string[] = [];
  const truncatedText =
    item.comment.textOriginal.length > 300
      ? item.comment.textOriginal.slice(0, 300) + '…'
      : item.comment.textOriginal;

  lines.push(`### 💬 [${item.videoTitle}]`);
  lines.push('');
  lines.push(`> ${truncatedText.replace(/\n/g, '\n> ')}`);
  lines.push('');
  lines.push(`- **Author:** ${item.comment.authorDisplayName}`);
  lines.push(`- **Likes:** ${item.comment.likeCount}`);
  lines.push(`- **Date:** ${item.comment.publishedAt.slice(0, 10)}`);

  for (const label of item.labels) {
    lines.push(
      `- **Category:** \`${label.category}\` (score: ${label.score}, keywords: ${label.matchedKeywords.join(', ')}, lang: ${label.matchedLanguage})`,
    );
  }

  return lines.join('\n');
}
