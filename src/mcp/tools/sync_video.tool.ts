import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { syncVideo } from '../../services/sync.service.js';

export function registerSyncVideoTool(server: McpServer) {
  server.tool(
    'sync_video',
    'Sync a single YouTube video and its comments',
    {
      videoId: z.string().describe('YouTube video ID'),
      maxComments: z.number().optional().default(2000).describe('Max comments to fetch'),
      dryRun: z.boolean().optional().default(false).describe('Preview without writing'),
    },
    async ({ videoId, maxComments, dryRun }) => {
      const result = await syncVideo({ videoId, maxComments, dryRun });
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
