# Supabase — an1hem (Anthem-Code)

**Canonical backend lives in Solo-Code.** This app shares the unified Supabase project with So1o.

| Resource | Location |
|----------|----------|
| Migrations | [`Solo-Code/supabase/migrations/`](../../Solo-Code/supabase/migrations/) |
| Edge Functions | [`Solo-Code/supabase/functions/`](../../Solo-Code/supabase/functions/) |
| Ecosystem docs | [`Solo-Code/supabase/ECOSYSTEM.md`](../../Solo-Code/supabase/ECOSYSTEM.md) |

## Deploy edge functions

From `Solo-Code/`:

```bash
supabase functions deploy embed-project similar-images generate-contract job-match-dispatch sync-so1o-tier \
  --project-ref rvnzjiskqliexysicfmh
```

Do **not** deploy from `Anthem-Code/supabase/functions/` — that directory was removed to avoid stale copies with weaker auth.

## Push migrations

```bash
cd Solo-Code
./scripts/supabase-push-via-api.sh
```

Or use `npm run db:push` in Anthem-Code (delegates to Solo-Code).
