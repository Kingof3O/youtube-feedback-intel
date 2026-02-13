# YouTube Feedback Intel

Collect YouTube comments with the official YouTube Data API v3, classify multi-language feedback, and explore results through CLI, API, and web UI.

## What It Includes
- YouTube sync for channel, single video, multiple videos, and date ranges.
- Rule-based classification for `ar`, `en`, `fr`, `es`, and `de`.
- MySQL persistence with idempotent upserts.
- Backend API (`/api/*`) used by the React frontend.
- CLI (`ytfi`) for sync/classify/query/report/rules/demo-seed workflows.
- MCP server tools for agent integrations.

## Tech Stack
- Node.js 20+
- TypeScript
- Express
- mysql2/promise
- commander
- React + Vite + React Query
- Vitest

## Project Structure
```text
src/
  cli/
  config/
  db/
  domain/
  integrations/
  mcp/
  server/
  services/
  scripts/
  utils/
client/
  src/
  .env.example
rules/
docs/
```

## Prerequisites (Windows)
1. Install Node.js 20 or newer.
2. Install MySQL locally (MySQL Installer, XAMPP, or WAMP).
3. Create a YouTube Data API v3 key and restrict it to YouTube Data API v3.

## Setup
1. Install dependencies:
```powershell
npm install
npm --prefix client install
```

2. Configure backend env:
```powershell
Copy-Item .env.example .env
```

3. Configure frontend env:
```powershell
Copy-Item client/.env.example client/.env
```

4. Run DB migrations:
```powershell
npm run migrate
```

5. Import default rules (optional first run):
```powershell
npm run cli -- rules import --file rules/rules.default.yml
```

## Run
- Full dev mode (API + frontend):
```powershell
npm run dev
```

- API only:
```powershell
npm run server
```

- Frontend only:
```powershell
npm run client
```

## Key Scripts
- `npm run lint` runs server + client lint.
- `npm run test` runs backend tests.
- `npm run build` builds server + client.
- `npm run migrate` runs SQL migrations.
- `npm run seed:demo -- --reset` seeds deterministic demo data for screenshots.
- `npm run check:modules` enforces module size guardrails.

## CLI Usage
Run CLI commands through:
```powershell
npm run cli -- <command>
```

Examples:
```powershell
npm run cli -- sync channel --channelId UCDqwX3rguC2xrz3-ovEqLDCS --days 14 --maxVideos 50 --maxCommentsPerVideo 2000
npm run cli -- sync video --videoId VIDEO_ID
npm run cli -- sync videos --videoIds id1,id2,id3
npm run cli -- sync range --channelId UCDqwX3rguC2xrz3-ovEqLDCS --from 2024-01-01 --to 2026-01-01 --maxVideos 500
npm run cli -- classify channel --channelId UCDqwX3rguC2xrz3-ovEqLDCS
npm run cli -- query --channelId UCDqwX3rguC2xrz3-ovEqLDCS --category bug --since 2026-01-01 --minLikes 2 --contains website
npm run cli -- report --channelId UCDqwX3rguC2xrz3-ovEqLDCS --since 2026-01-01 --until 2026-02-01 --format md
npm run cli -- demo seed --reset
```

## API Endpoints (Frontend Contract)
- `GET /api/dashboard`
- `GET /api/channels`
- `POST /api/sync/channel`
- `GET /api/feedback`
- `GET /api/rules`
- `GET /api/rules/:name/content`
- `PUT /api/rules/:name/content`
- `POST /api/rules/import-default`
- `POST /api/rules/activate`

## Demo Data + Screenshots
Use deterministic fake data:
```powershell
npm run seed:demo -- --reset
```

Detailed screenshot workflow is documented in `docs/seeding-and-screenshots.md`.

## MCP Server
Build and run:
```powershell
npm run build
npm run mcp
```

## Validation Checklist
```powershell
npm run lint
npm test
npm run build
npm run migrate
npm run seed:demo -- --reset
```

## License
MIT (`LICENSE`)
