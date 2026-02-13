import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { syncChannel } from '../../services/sync.service.js';

export function registerSyncChannelTool(server: McpServer) {
  server.tool(
    'sync_channel',
    'Sync a YouTube channel: fetch channel info, videos, and comments',
    {
      channelId: z.string().describe('YouTube channel ID'),
      days: z.number().optional().default(14).describe('Days to look back'),
      maxVideos: z.number().optional().default(50).describe('Max videos to sync'),
      maxCommentsPerVideo: z.number().optional().default(2000).describe('Max comments per video'),
      dryRun: z.boolean().optional().default(false).describe('Preview without writing'),
    },
    async ({ channelId, days, maxVideos, maxCommentsPerVideo, dryRun }) => {
      const result = await syncChannel({ channelId, days, maxVideos, maxCommentsPerVideo, dryRun });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
