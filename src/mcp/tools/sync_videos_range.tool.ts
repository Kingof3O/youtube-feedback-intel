import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { syncRange } from '../../services/sync.service.js';
import { parseDate } from '../../utils/time.js';

export function registerSyncVideosRangeTool(server: McpServer) {
  server.tool(
    'sync_videos_range',
    'Sync YouTube videos within a date range',
    {
      channelId: z.string().describe('YouTube channel ID'),
      from: z.string().describe('Start date (YYYY-MM-DD)'),
      to: z.string().describe('End date (YYYY-MM-DD)'),
      maxVideos: z.number().optional().default(500).describe('Max videos'),
      maxCommentsPerVideo: z.number().optional().default(2000).describe('Max comments per video'),
      dryRun: z.boolean().optional().default(false).describe('Preview without writing'),
    },
    async ({ channelId, from, to, maxVideos, maxCommentsPerVideo, dryRun }) => {
      const result = await syncRange({
        channelId,
        from: parseDate(from),
        to: parseDate(to),
        maxVideos,
        maxCommentsPerVideo,
        dryRun,
      });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
