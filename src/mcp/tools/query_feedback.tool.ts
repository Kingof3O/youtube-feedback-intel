import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { queryFeedback } from '../../services/query.service.js';

export function registerQueryFeedbackTool(server: McpServer) {
  server.tool(
    'query_feedback',
    'Query classified feedback comments with filters',
    {
      channelId: z.string().optional().describe('Filter by channel ID'),
      videoId: z.string().optional().describe('Filter by video ID'),
      category: z.string().optional().describe('Filter by category'),
      contains: z.string().optional().describe('Filter comments containing text'),
      minLikes: z.number().optional().describe('Minimum like count'),
      since: z.string().optional().describe('From date (YYYY-MM-DD)'),
      until: z.string().optional().describe('Until date (YYYY-MM-DD)'),
      limit: z.number().optional().default(50).describe('Max results'),
    },
    async (params) => {
      const results = await queryFeedback(params);
      const output = results.map((r) => ({
        videoTitle: r.videoTitle,
        author: r.comment.authorDisplayName,
        text: r.comment.textOriginal.slice(0, 500),
        likes: r.comment.likeCount,
        date: r.comment.publishedAt.slice(0, 10),
        labels: r.labels.map((l) => ({
          category: l.category,
          score: l.score,
          keywords: l.matchedKeywords,
          lang: l.matchedLanguage,
        })),
      }));
      return { content: [{ type: 'text' as const, text: JSON.stringify(output, null, 2) }] };
    },
  );
}
