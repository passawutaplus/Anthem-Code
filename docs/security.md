# Security — Threat model & posture

## Architecture

```text
Browser (React 18 + Vite)
  │
  ├─ Supabase JS client  ──►  Postgres + RLS (public, shared schemas)
  │                            └─ SECURITY DEFINER RPCs (admin_*, wallet_*, has_role)
  └─ supabase.functions.invoke ──►  Edge Functions (Deno)
                                     ├─ generate-contract   (auth required)
                                     ├─ similar-images      (auth required)
                                     ├─ embed-project       (owner/admin only)
                                     └─ job-match-dispatch  (internal, from DB trigger)
```

## Trust boundaries

| From | To | Trust |
|---|---|---|
| Anonymous browser | Public tables (profiles, projects, studios, gifts catalog) | Read-only via RLS |
| Authenticated browser | Own wallet, own messages, own collections | RLS scoped to `auth.uid()` |
| Authenticated browser | Admin RPCs | Internal `has_role(_, 'admin')` check |
| Edge function (service role) | Any table | Trusted — all input validated with zod |
| DB trigger → pg_net | `job-match-dispatch` | Internal-only payload (`{ job_id }`) |

## AuthN / AuthZ

- Email/password + Google OAuth (Supabase Auth).
- HIBP leaked-password check **enabled**.
- Email verification **required** before access (`RequireAuth` gates protected routes).
- Roles stored in `public.user_roles` (NOT on profiles) — admin check via `has_role()` SECURITY DEFINER.
- Admin gate (`AdminGuard`) waits for the role query to resolve before rendering — no localStorage trust.

## Sensitive data inventory

| Data | Table | Access |
|---|---|---|
| Email | `auth.users`, `profiles.email` | Owner + admin |
| Wallet balance, lifetime earned/spent | `wallets` | Owner + admin (was public — fixed) |
| Gift history | `gift_transactions` | Sender + recipient |
| Cashout bank info | `cashout_requests.bank_info` (jsonb) | Owner + admin |
| Private messages | `messages` | Conversation participants |
| User roles | `user_roles` | Owner + admin (insert/update: admin only) |

## RLS posture

- All sensitive tables RLS-enabled.
- Public-read tables: `profiles`, `studios`, `studio_members`, `project_comments`, `inspire_boards`, `inspire_items`, `image_shares`, `gifts` (catalog), `follows` — intentional.
- Write policies always scope to `auth.uid()` or `has_role()`.
- No `WITH CHECK (true)` on INSERT/UPDATE/DELETE for any user-mutable table.

## Edge function hardening

Every public-facing edge function:
1. CORS preflight handled
2. JWT validated via `supabase.auth.getClaims()` (where user-bound)
3. Input parsed + validated with **zod**
4. Errors returned generically (no stack traces / internal messages)
5. Service-role client used only after authorization passes

## Accepted risks

- `SECURITY DEFINER` RPCs callable by authenticated users (admin_*, wallet ops) — each function performs its own `has_role()` / ownership check internally. Linter warnings 0028/0029 are by design.
- `pgvector` extension installed in `public` schema (Supabase default; moving requires extension re-create).
- `job-match-dispatch` is invoked by a DB trigger via `pg_net` without a JWT (DB is the trusted caller). Input is a single validated UUID.
- Mock payment endpoints (`topup_wallet_mock`, `mock_pay_ad_application`) exist for the staging environment. Must be removed before going live with real payments.

## Known gaps (open for reviewer)

- No application-level rate limiting on edge functions yet (Supabase platform limits apply).
- CSP not yet enforced (only baseline headers via meta).
- No automated dependency vulnerability gate in CI.

## Report & Feedback

- **`user_reports` / `app_feedback`**: RLS — เจ้าของอ่านได้เฉพาะของตัวเอง, admin อ่าน/เขียนได้ทั้งหมดผ่าน `has_role(uid, 'admin')`
- **Rate limit / Anti-spam**: ใช้ SECURITY DEFINER RPC `create_report` และ `submit_feedback` ที่ตรวจ window-based count ก่อน insert (ลด surface สำหรับ flood/spam จาก client โดยตรง)
- **Unique partial index** บน `user_reports(reporter_id, target_type, target_id) WHERE status='open'` — ป้องกัน duplicate report ที่ยังเปิดอยู่
- **Storage `report-evidence`** (private bucket): policy อนุญาตให้ authenticated upload เฉพาะ path ของตัวเอง (`auth.uid()::text = (storage.foldername(name))[1]`); read/delete จำกัดเฉพาะ owner + admin
- **Evidence URL validation**: ฝั่ง client validate `safeHttpUrl()` ก่อนส่ง; ฝั่ง server schema ยอมเฉพาะ http(s)
- **Admin notification trigger**: AFTER INSERT บน `user_reports` / `app_feedback` เรียก `shared.push_notification` ให้ admins — ไม่เปิดเผยรายละเอียดรายงานในข้อความ (ใช้ deep link ไปหน้า admin เท่านั้น)
