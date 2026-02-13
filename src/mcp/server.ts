import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadEnv } from '../config/env.js';
import { registerSyncChannelTool } from './tools/sync_channel.tool.js';
import { registerSyncVideoTool } from './tools/sync_video.tool.js';
import { registerSyncVideosListTool } from './tools/sync_videos_list.tool.js';
import { registerSyncVideosRangeTool } from './tools/sync_videos_range.tool.js';
import { registerClassifyChannelTool } from './tools/classify_channel.tool.js';
import { registerClassifyVideoTool } from './tools/classify_video.tool.js';
import { registerQueryFeedbackTool } from './tools/query_feedback.tool.js';
import { registerExportReportTool } from './tools/export_report.tool.js';
import { registerRulesManageTool } from './tools/rules_manage.tool.js';
import { logger } from '../utils/logger.js';

async function main() {
  loadEnv();

  const server = new McpServer({
    name: 'youtube-feedback-intel',
    version: '1.0.0',
  });

  // Register all tools
  registerSyncChannelTool(server);
  registerSyncVideoTool(server);
  registerSyncVideosListTool(server);
  registerSyncVideosRangeTool(server);
  registerClassifyChannelTool(server);
  registerClassifyVideoTool(server);
  registerQueryFeedbackTool(server);
  registerExportReportTool(server);
  registerRulesManageTool(server);

  // Start stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info('MCP server started on stdio');
}

main().catch((err) => {
  logger.error(err, 'MCP server failed to start');
  process.exit(1);
});

export { z };
