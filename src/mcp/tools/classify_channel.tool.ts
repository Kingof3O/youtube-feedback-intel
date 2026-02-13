import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { classifyChannel } from '../../services/classify.service.js';

export function registerClassifyChannelTool(server: McpServer) {
  server.tool(
    'classify_channel',
    'Classify all comments for a YouTube channel using rules',
    {
      channelId: z.string().describe('YouTube channel ID'),
      ruleSetName: z.string().optional().describe('Rule set name (default: active)'),
    },
    async ({ channelId, ruleSetName }) => {
      const result = await classifyChannel(channelId, ruleSetName);
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
    },
  );
}
