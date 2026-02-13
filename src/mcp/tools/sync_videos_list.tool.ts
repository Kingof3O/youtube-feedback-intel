import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { syncVideosList } from '../../services/sync.service.js';

export function registerSyncVideosListTool(server: McpServer) {
  server.tool(
    'sync_videos_list',
    'Sync multiple YouTube videos by their IDs',
    {
      videoIds: z.array(z.string()).describe('Array of YouTube video IDs'),
      maxCommentsPerVideo: z.number().optional().default(2000).describe('Max comments per video'),
      dryRun: z.boolean().optional().default(false).describe('Preview without writing'),
    },
    async ({ videoIds, maxCommentsPerVideo, dryRun }) => {
      const result = await syncVideosList(videoIds, maxCommentsPerVideo, dryRun);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
