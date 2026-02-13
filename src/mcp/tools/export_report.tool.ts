import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { exportReport } from '../../services/report.service.js';

export function registerExportReportTool(server: McpServer) {
  server.tool(
    'export_report',
    'Generate and export a feedback report (Markdown or JSONL)',
    {
      channelId: z.string().describe('YouTube channel ID'),
      since: z.string().describe('From date (YYYY-MM-DD)'),
      until: z.string().describe('Until date (YYYY-MM-DD)'),
      format: z.enum(['md', 'jsonl']).default('md').describe('Report format'),
      ruleSetName: z.string().optional().describe('Rule set name'),
    },
    async ({ channelId, since, until, format }) => {
      const filePath = await exportReport({ channelId, since, until, format });
      return {
        content: [{ type: 'text' as const, text: `Report saved to: ${filePath}` }],
      };
    },
  );
}
