import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../utils/logger.js';
import { generateMarkdownReport } from '../domain/reporting/report.md.js';
import { generateJsonlReport } from '../domain/reporting/report.jsonl.js';
import * as channelsRepo from '../db/repositories/channels.repo.js';
import * as commentsRepo from '../db/repositories/comments.repo.js';
import * as labelsRepo from '../db/repositories/labels.repo.js';
import * as videosRepo from '../db/repositories/videos.repo.js';
import type { ReportData, FeedbackResult } from '../domain/types/index.js';

export interface ReportOptions {
  channelId: string;
  since: string;
  until: string;
  format: 'md' | 'jsonl';
  ruleSetName?: string;
}

/**
 * Generate and save a report.
 */
export async function exportReport(options: ReportOptions): Promise<string> {
  logger.info(options, 'Generating report');

  const channel = await channelsRepo.getChannel(options.channelId);
  const channelTitle = channel?.title ?? options.channelId;

  // Count total comments in period
  const totalComments = await commentsRepo.countCommentsByChannelId(options.channelId, {
    since: options.since,
    until: options.until,
  });

  // Get category summary
  const categorySummary = await labelsRepo.getCategorySummary(options.channelId, {
    since: options.since,
    until: options.until,
  });

  // Get labeled comments
  const labels = await labelsRepo.queryLabels({
    channelId: options.channelId,
    since: options.since,
    until: options.until,
  });

  // Group by comment, fetch details
  const byComment = new Map<string, typeof labels>();
  for (const l of labels) {
    const existing = byComment.get(l.commentId) ?? [];
    existing.push(l);
    byComment.set(l.commentId, existing);
  }

  const items: FeedbackResult[] = [];
  const videoCache = new Map<string, string>();
  const allComments = await commentsRepo.getCommentsByChannelId(options.channelId, {
    since: options.since,
    until: options.until,
  });
  const commentMap = new Map(allComments.map((c) => [c.id, c]));

  for (const [commentId, commentLabels] of byComment) {
    const comment = commentMap.get(commentId);
    if (!comment) continue;

    let videoTitle = videoCache.get(comment.videoId);
    if (!videoTitle) {
      const video = await videosRepo.getVideo(comment.videoId);
      videoTitle = video?.title ?? 'Unknown';
      videoCache.set(comment.videoId, videoTitle);
    }

    items.push({ comment, labels: commentLabels, videoTitle });
  }

  const data: ReportData = {
    channelId: options.channelId,
    channelTitle,
    since: options.since,
    until: options.until,
    totalComments,
    totalFeedback: items.length,
    categorySummary,
    items,
  };

  // Generate content
  const content = options.format === 'md'
    ? generateMarkdownReport(data)
    : generateJsonlReport(data);

  // Save to file
  mkdirSync('reports', { recursive: true });
  const filename = `report_${options.channelId}_${options.since}_${options.until}.${options.format === 'md' ? 'md' : 'jsonl'}`;
  const filePath = join('reports', filename);
  writeFileSync(filePath, content, 'utf-8');

  logger.info({ filePath, items: items.length }, 'Report saved');
  return filePath;
}
