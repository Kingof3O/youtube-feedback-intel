# Demo Seeding and Screenshot Workflow

## 1) Seed Deterministic Demo Data
Run:
```powershell
npm run seed:demo -- --reset
```

This seeds:
- `channels`
- `videos`
- `comment_threads`
- `comments`
- `rule_sets` (active demo ruleset)
- `comment_labels`
- `sync_state`

## 2) Verify Data in MySQL
```sql
SELECT id, title FROM channels WHERE id = 'demo_channel_001';
SELECT id, title, published_at FROM videos WHERE channel_id = 'demo_channel_001' ORDER BY published_at DESC;
SELECT category, COUNT(*) AS c FROM comment_labels WHERE channel_id = 'demo_channel_001' GROUP BY category ORDER BY c DESC;
SELECT entity_type, entity_id, items_synced FROM sync_state WHERE entity_id = 'demo_channel_001' OR entity_id LIKE 'demo_video_%';
```

## 3) Start App
```powershell
npm run dev
```

## 4) Screenshot Checklist
Capture and store images in `docs/screenshots/`:
1. `dashboard-overview.png`
2. `sync-channels-table.png`
3. `explorer-classified.png`
4. `explorer-raw.png`
5. `rules-list.png`
6. `rules-editor-visual.png`
7. `rules-editor-code.png`
8. `mysql-demo-data.png` (from your DB client)

## 5) Notes
- Re-run seed with `--reset` before capturing final screenshots to keep counts stable.
- Do not capture real API keys or sensitive local data in screenshots.
