You are a senior engineer building an open-source project:
“youtube-feedback-intel”

Goal
- Collect videos + comments for a YouTube channel using ONLY the official YouTube Data API v3 (no scraping).
- Detect “tech/work feedback” comments relevant to the developer’s work across MULTIPLE LANGUAGES:
  Arabic, English, French, Spanish, German.
- Store everything in MySQL.
- Provide BOTH:
  1) A CLI for local usage on Windows (sync/query/classify/report)
  2) An MCP server so Windsurf (or any MCP client) can call tools.
- Keywords/rules MUST be configurable (file + DB), not hard-coded.

Target environment
- Windows local dev machine (no Docker).
- Assume MySQL is already installed locally OR via XAMPP/WAMP.
- Provide setup steps for Windows PowerShell and MySQL CLI.
- Use Node.js 20+ and TypeScript.

Hard requirements
1) Use only YouTube Data API v3.
2) No secrets in code/repo. Use .env + .env.example.
3) Modular architecture: no god files; each module has one job; strict typing.
4) Idempotent sync: safe to re-run; upserts everywhere.
5) Robust pagination + retry/backoff on 429/5xx.
6) Multi-language rules support + normalization per language.
7) Open-source ready: MIT, README, CONTRIBUTING, lint, format, tests, CI workflow.

Inputs (for testing only)
- channelId: UCDqwX3rguC2xrz3-ovEqLDCS
- YOUTUBE_API_KEY via env var only
- MySQL credentials via env vars

Tech stack (required)
- TypeScript + Node.js 20+
- HTTP: undici (fetch) preferred
- Validation: zod
- Logging: pino
- MySQL: mysql2/promise + custom migration runner OR Prisma
  - Choose ONE. If Prisma: include schema + migrations. If custom: include migrations SQL + runner.
- CLI: commander
- Tests: vitest + nock (mock YouTube API)
- Lint/format: eslint + prettier

Architecture (clean and modular)
Use layered modules, keep files small:
 /src
  /config
    env.ts (zod validated env)
    rules.loader.ts (load rules from YAML/JSON)
    rules.schema.ts (zod schema for rules)
  /integrations/youtube
    youtube.client.ts (HTTP wrapper)
    youtube.endpoints.ts (build URLs + params)
    youtube.pagination.ts (pageToken helpers)
    youtube.mappers.ts (map API -> domain DTOs)
    youtube.retry.ts (backoff/jitter)
  /db
    mysql.pool.ts
    migrations/
    migrate.ts (migration runner)
    repositories/
      channels.repo.ts
      videos.repo.ts
      threads.repo.ts
      comments.repo.ts
      rules.repo.ts
      labels.repo.ts
      syncstate.repo.ts
  /domain
    types/
    normalize/
      normalize.base.ts
      normalize.ar.ts
      normalize.latn.ts (en/fr/es/de)
    rules/
      rule-engine.ts (matchers, scoring)
      rule-types.ts
    reporting/
      report.md.ts
      report.jsonl.ts
  /services
    sync.service.ts (channel->videos->comments)
    classify.service.ts
    query.service.ts
    report.service.ts
  /cli
    index.ts
    commands/
      sync.ts
      classify.ts
      query.ts
      report.ts
      rules.ts (import/list/activate rulesets)
  /mcp
    server.ts
    tools/
      sync_channel.tool.ts
      sync_videos_range.tool.ts
      sync_videos_list.tool.ts
      sync_video.tool.ts
      classify_channel.tool.ts
      classify_video.tool.ts
      query_feedback.tool.ts
      export_report.tool.ts
      rules_manage.tool.ts
  /utils
    time.ts
    logger.ts
    text.ts
    errors.ts

Rules / keywords configuration (NOT hard-coded)
- Support languages: ar, en, fr, es, de
- Provide both:
  A) File rules: /rules/rules.default.yml (editable)
  B) DB rulesets: rule_sets table stores rules_json and an active flag.
- The system loads the active ruleset from DB; if empty, it imports from rules.default.yml.
- Must store rule version/hash used for each label.

Rules schema example (YAML)
ruleSet:
  name: "default"
  version: "1.0.0"
  languages: ["ar","en","fr","es","de"]
  global:
    minScore: 1
    negativeKeywords: ["giveaway","spam","subscribe"]
  categories:
    bug:
      score: 3
      keywords:
        en: ["bug","broken","error","crash","fix","issue"]
        ar: ["مشكلة","باظ","خطأ","بيهنج","كراش","مش شغال","صلّح","تهنيج"]
        fr: ["bug","erreur","plante","crash","corriger"]
        es: ["error","se cae","crash","arreglar","bug"]
        de: ["fehler","absturz","bug","kaputt","fix"]
    performance:
      score: 2
      keywords:
        en: ["lag","slow","delay","fps","ping","loading"]
        ar: ["لاجي","بطئ","تأخير","تحميل","فريمات","بينزل فريم"]
        fr: ["lent","latence","lag","fps","chargement"]
        es: ["lento","latencia","lag","carga","fps"]
        de: ["langsam","latenz","lag","lädt","fps"]
    ui_ux:
      score: 2
      keywords:
        en: ["ui","ux","design","layout","overlay","button","responsive"]
        ar: ["واجهة","تصميم","زر","مش واضح","ترتيب","أوفرلاي","مش متجاوب"]
        fr: ["interface","design","bouton","mise en page","overlay"]
        es: ["interfaz","diseño","botón","overlay","responsivo"]
        de: ["oberfläche","design","button","layout","overlay"]
    feature_request:
      score: 2
      keywords:
        en: ["add","please","can you","feature","would be nice"]
        ar: ["ضيف","ممكن","ينفع","عايز","خاصية","ياريت"]
        fr: ["ajouter","s'il te plaît","fonctionnalité","ce serait bien"]
        es: ["agregar","por favor","función","sería bueno"]
        de: ["hinzufügen","bitte","funktion","wäre gut"]
    integration:
      score: 2
      keywords:
        en: ["obs","discord","nginx","cloudflare","r2","s3","api","websocket","ws"]
        ar: ["ديسكورد","أو بي إس","ويب سوكيت","سيرفر","كلودفلير","API"]
        fr: ["obs","discord","api","websocket","serveur"]
        es: ["obs","discord","api","websocket","servidor"]
        de: ["obs","discord","api","websocket","server"]

Matching/scoring
- Normalize text before matching:
  - Latin: lowercase, remove diacritics, collapse whitespace.
  - Arabic: normalize Alef forms, remove tatweel/diacritics, unify ya/ى, collapse whitespace.
- Match per-language keywords; support phrase keywords.
- Optional “matchAllLanguages” mode to match across all enabled languages when language is unclear.

Database schema (MySQL) + migrations
- Use utf8mb4 for multilingual support.
- Create migrations for:
  channels, videos, comment_threads, comments, rule_sets, comment_labels, sync_state
- Upserts with unique keys on ids.
- Index:
  videos(channel_id, published_at)
  comments(video_id, published_at)
  comment_labels(category, labeled_at)

Video selection features (NEW REQUIREMENT)
Must support syncing:
1) A specific video by ID.
2) Multiple videos by IDs.
3) Videos within a date range (e.g., 2024-01-01 to 2026-01-01).
4) Recent videos by “days” window (existing).

Implementation requirements for video selection (quota-friendly):
- Primary method (preferred): uploads playlist listing via playlistItems.list, then filter by publishedAt after fetching video details in batches using videos.list.
- Range sync algorithm:
  - Iterate uploads playlist pages.
  - For each page, collect videoIds.
  - Fetch details for those ids (videos.list).
  - Keep only videos where publishedAt is within [from, to].
  - Stop early when publishedAt is older than “from” and playlist is reverse chronological (uploads are newest->oldest).
- Multi-video list:
  - Accept array of videoIds; fetch details and sync comments for each.
- Persist all videos and mark last_synced_at per video.

CLI commands (Windows-friendly)
Provide commands:
- sync channel --channelId <id> --days 14 --maxVideos 50 --maxCommentsPerVideo 2000
- sync video --videoId <id>
- sync videos --videoIds <id1,id2,id3>
- sync range --channelId <id> --from 2024-01-01 --to 2026-01-01 --maxVideos 500
- rules import --file rules.default.yml
- rules activate --name default
- classify channel --channelId <id>
- classify video --videoId <id>
- query --channelId <id> --category bug --since 2026-01-01 --minLikes 2 --contains "website"
- report --channelId <id> --since 2026-01-01 --until 2026-02-01 --format md

MCP Server tools
Expose MCP tools (each in its own file):
1) sync_channel({ channelId, days, maxVideos?, maxCommentsPerVideo?, dryRun? })
2) sync_video({ videoId, maxComments?, dryRun? })
3) sync_videos_list({ videoIds: string[], maxCommentsPerVideo?, dryRun? })
4) sync_videos_range({ channelId, from: "YYYY-MM-DD", to: "YYYY-MM-DD", maxVideos?, maxCommentsPerVideo?, dryRun? })
5) rules_import({ filePath })
6) rules_list({})
7) rules_activate({ name })
8) classify_channel({ channelId, ruleSetName? })
9) classify_video({ videoId, ruleSetName? })
10) query_feedback({ channelId?, videoId?, category?, contains?, minLikes?, since?, until?, limit? })
11) export_report({ channelId, since, until, format: "md"|"jsonl", ruleSetName? })

Windows setup docs (no Docker)
In README, include:
- Install Node 20+
- Install MySQL locally (XAMPP/WAMP/MySQL Installer)
- Create database and user via MySQL CLI commands
- Copy .env.example to .env
- Run migrations: npm run migrate
- Run sync/classify/report commands
- Run MCP server: npm run mcp

Security
- Never log the API key.
- Document API key restrictions in Google Cloud.
- .gitignore for .env, logs, generated reports.

Testing
- Unit tests: normalization + classifier + rules validation
- Integration test: YouTube pagination mock, ensure range sync stops early and is idempotent.

Deliverables
- Full TypeScript codebase with the above structure.
- Migrations and migration runner.
- rules.default.yml + docs.
- .env.example (NO real secrets).
- README + CONTRIBUTING + LICENSE.
- GitHub Actions workflow: lint + test on push/PR.

Now implement end-to-end:
1) propose final file tree
2) write migrations
3) implement YouTube client + repositories + services
4) implement CLI + MCP server tools
5) add rules config support (file + DB)
6) add tests + docs
