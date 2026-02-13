# Architecture

## Layers
- `config`: environment and rules file loading/validation.
- `integrations`: YouTube API client, endpoint builders, mappers, retry logic.
- `db`: migrations, connection pool, repositories.
- `domain`: normalization, rule engine, report formatting, shared DTOs.
- `services`: orchestration/business workflows (`sync`, `classify`, `query`, `report`).
- `server`: HTTP routes, handlers, and response mappers.
- `cli`: command registration + shared command helpers.
- `mcp`: MCP server and tool adapters.

## Key Design Decisions
- API contract preserved for existing frontend endpoints.
- Service facades retained (`sync.service.ts`, `classify.service.ts`, `query.service.ts`) for compatibility.
- Route layer split into thin modules and handlers.
- Frontend network calls centralized in `client/src/lib/api`.
- Page state/data fetching moved into hooks.

## Modularity Guardrails
- Prefer composition over large files.
- Keep page and route files orchestration-focused.
- Put reusable UI behavior into hooks/components.
- Enforce size limits via `npm run check:modules`.

## Data Flow
1. Sync workflows fetch YouTube data and upsert DB tables.
2. Classification loads active rule set and writes labels.
3. Query/report workflows join comments, labels, and video metadata.
4. API maps backend models to frontend response shapes.
5. Frontend hooks consume typed API clients.
