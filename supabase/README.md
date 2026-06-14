# Supabase — an1hem (Anthem-Code)

**Canonical backend lives in Solo-Code.** This app shares the unified Supabase project with So1o.

| Resource | Location |
|----------|----------|
| Project ID | `rvnzjiskqliexysicfmh` |
| Migrations (136) | [`Solo-Code/supabase/migrations/`](../../Solo-Code/supabase/migrations/) |
| Edge Functions (21) | [`Solo-Code/supabase/functions/`](../../Solo-Code/supabase/functions/) |
| Ecosystem docs | [`Solo-Code/supabase/ECOSYSTEM.md`](../../Solo-Code/supabase/ECOSYSTEM.md) |
| Notifications | [`docs/ecosystem-notifications.md`](../../docs/ecosystem-notifications.md) |

## Deploy edge functions

From `Solo-Code/`:

```bash
# Notify + LINE
supabase functions deploy \
  notify-anthem notify-anthem-chat notify-anthem-collab notify-hire-request \
  job-match-dispatch line-connect line-webhook line-queue-process \
  --project-ref rvnzjiskqliexysicfmh

# Anthem AI + search
supabase functions deploy embed-project similar-images generate-contract \
  anthem-assistant anthem-portfolio-assist ecosystem-ai-usage admin-ai-monitor admin-supabase-usage \
  --project-ref rvnzjiskqliexysicfmh

# Secret สำหรับ admin-supabase-usage (ชื่อต้องไม่ขึ้นต้น SUPABASE_)
supabase secrets set MGMT_ACCESS_TOKEN=sbp_... --project-ref rvnzjiskqliexysicfmh
```

Do **not** deploy from `Anthem-Code/supabase/functions/` — that directory was removed to avoid stale copies.

> `line-link-account` deprecated — ใช้ `line-connect` แทน

## Push migrations

```bash
cd Solo-Code
./scripts/supabase-push-via-api.sh
```

Or use `npm run db:push` in Anthem-Code (delegates to Solo-Code).

## Email templates

Canonical: `Anthem-Code/src/lib/email-templates/` — sync ไป So1o ตอน build

```bash
npm run email:preview   # preview HTML
npm run email:icons     # regenerate icons
```
