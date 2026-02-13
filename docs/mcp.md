# Model Context Protocol (MCP) Server

This project includes an MCP server implementation that exposes tools for syncing YouTube data, classifying comments, and querying feedback intelligence directly to MCP-compatible clients (like Claude Desktop).

## Prerequisites

Before running the MCP server, ensure you have built the project:

```bash
npm install
npm run build
```

## Running the Server

The server communicates via standard input/output (stdio). You can run it directly using:

```bash
npm run mcp
```

Or manually:

```bash
node dist/mcp/server.js
```

## Client Configuration

### Claude Desktop

To use these tools with Claude Desktop, add the following configuration to your MCP settings file (typically located at `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS).

Replace `YOUR_PROJECT_PATH` with the absolute path to your project directory.

```json
{
  "mcpServers": {
    "youtube-feedback-intel": {
      "command": "node",
      "args": [
        "YOUR_PROJECT_PATH/dist/mcp/server.js"
      ],
      "env": {
        "YOUTUBE_API_KEY": "your_api_key",
        "MYSQL_HOST": "localhost",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "",
        "MYSQL_DATABASE": "youtube_feedback_intel"
      }
    }
  }
}
```

### Windsurf / Codeium

To use these tools with Windsurf, add the following configuration to your MCP settings file (typically located at `~/.codeium/windsurf/mcp_config.json` or `%USERPROFILE%\.codeium\windsurf\mcp_config.json` on Windows).

Replace `YOUR_PROJECT_PATH` with the absolute path to your project directory.

```json
{
  "mcpServers": {
    "youtube-feedback-intel": {
      "command": "node",
      "args": [
        "YOUR_PROJECT_PATH/dist/mcp/server.js"
      ],
      "env": {
        "YOUTUBE_API_KEY": "your_api_key",
        "MYSQL_HOST": "localhost",
        "MYSQL_USER": "root",
        "MYSQL_PASSWORD": "",
        "MYSQL_DATABASE": "youtube_feedback_intel"
      }
    }
  }
}
```

> **Note:** Ensure all required environment variables (like `DATABASE_URL` and `YOUTUBE_API_KEY`) are either set in your system environment or provided in the `env` configuration block as shown above. The server also attempts to load `.env` from the project root.

## Available Tools

The following tools are exposed by the MCP server:

### Syncing
- **`sync_channel`**: Syncs a YouTube channel's metadata and videos.
- **`sync_video`**: Syncs a specific video and its comments.
- **`sync_videos_list`**: Syncs a list of videos by ID.
- **`sync_videos_range`**: Syncs videos from a channel within a specific date range.

### Classification
- **`classify_channel`**: Classifies comments for all videos in a channel.
- **`classify_video`**: Classifies comments for a specific video.

### Analysis & Reporting
- **`query_feedback`**: Queries classified feedback based on filters (sentiment, category, etc.).
- **`export_report`**: Generates a feedback report (Markdown/JSON) for a given time range.
- **`rules_manage`**: Manages the classification rules.
