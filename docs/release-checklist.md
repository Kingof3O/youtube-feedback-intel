# Release Checklist

## Quality Gates
1. `npm run lint`
2. `npm test`
3. `npm run build`
4. `npm run check:modules`

## Database
1. Confirm `.env` points to the intended MySQL instance.
2. Run `npm run migrate`.
3. If preparing demo screenshots, run `npm run seed:demo -- --reset`.

## Manual Verification
1. Start app with `npm run dev`.
2. Validate:
- Dashboard loads counts.
- Sync page lists channels and sync modal works.
- Explorer filters and infinite scroll work.
- Rules page can activate and edit rule sets.
3. Run representative CLI flows:
- `sync channel`
- `classify channel`
- `query`
- `report`
- `demo seed --reset`

## Documentation
1. Ensure README commands match `package.json`.
2. Update docs under `docs/` if APIs or workflows changed.
3. If UI changed, refresh screenshots in `docs/screenshots/`.

## CI
1. Confirm `.github/workflows/ci.yml` still reflects intended checks.
2. Verify no local-only assumptions in scripts/docs.
