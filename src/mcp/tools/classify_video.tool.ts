import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { classifyVideo } from '../../services/classify.service.js';

export function registerClassifyVideoTool(server: McpServer) {
  server.tool(
    'classify_video',
    'Classify all comments for a specific video using rules',
    {
      videoId: z.string().describe('YouTube video ID'),
      ruleSetName: z.string().optional().describe('Rule set name (default: active)'),
    },
    async ({ videoId, ruleSetName }) => {
      const result = await classifyVideo(videoId, ruleSetName);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
