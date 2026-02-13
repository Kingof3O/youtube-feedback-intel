# Contributing

## Local Setup
1. Install dependencies:
```powershell
npm install
npm --prefix client install
```
2. Configure env files:
```powershell
Copy-Item .env.example .env
Copy-Item client/.env.example client/.env
```
3. Run migrations:
```powershell
npm run migrate
```

## Development Commands
- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check:modules`

## Architecture Rules
- Keep layered boundaries:
`config -> integrations -> db -> domain -> services -> server/cli/mcp`.
- Keep API contracts backward compatible unless explicitly approved.
- Prefer small focused modules over large multi-purpose files.
- Keep route handlers thin; business logic belongs in services.
- Avoid `any`; use concrete types or `unknown` with narrowing.

## File Size Guardrails
- Target `<=150` lines for service/route/page modules.
- Target `<=100` lines for utility modules when practical.
- `npm run check:modules` is the enforcement script.

## Testing and Quality
Before opening a PR:
1. `npm run lint`
2. `npm test`
3. `npm run build`
4. If DB-affecting work: `npm run migrate`
5. If UI/demo work: `npm run seed:demo -- --reset` and verify manually.

## Pull Request Notes
- Explain behavior changes and compatibility impact.
- List updated commands/docs if developer workflow changed.
- Include screenshots for UI work (use demo seed workflow).

## License
By contributing, you agree your contributions are licensed under MIT.
