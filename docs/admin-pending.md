# Admin & Platform — สถานะ (อัปเดต 2026-06)

---

## ทำแล้วใน repo

| รายการ | หน้า / ไฟล์ |
|--------|-------------|
| Admin CRUD (users, projects, comments, collections, jobs) | `/admin/*` |
| มอนิเตอร์กิจกรรมทั้งเว็บ | `/admin/activity` |
| Dashboard KPI + แถบ "ต้องดูแล" | `/admin` |
| **platform_events** + DB triggers | `supabase/migrations/20260604270000_platform_events_admin_features.sql` |
| **สัญญา** | `/admin/contracts` |
| **กระเป๋า & Ledger** | `/admin/wallet` |
| **ใบสมัครงาน** | `/admin/applications` |
| **Analytics funnel / retention** | `/admin/analytics` |
| **Admin alerts** (toast + banner + badge sidebar) | report/cashout/KYC/AML |
| Notifications / Gifts / AML / KYC / Reports | โค้ดพร้อม |

---

## ต้อง push migration บน remote

โปรเจกต์ unified: **`rvnzjiskqliexysicfmh`**

```bash
export SUPABASE_ACCESS_TOKEN=sbp_...
npm run db:push
```

ไฟล์สำคัญ (รวมถึงรอบล่าสุด):

- `20260604270000_platform_events_admin_features.sql` — events, alerts, analytics RPCs
- `20260604260000_fix_unsplash_art_ids.sql`
- `20260604220000_admin_operations.sql`

หลัง push:

```bash
npx supabase gen types typescript --project-id rvnzjiskqliexysicfmh > src/integrations/supabase/types.ts
```

---

## ยังไม่ทำ (เลื่อน)

| รายการ | เหตุผล |
|--------|--------|
| **Stripe** cashout จริง | รอ payment integration |
| Admin แก้/ลบ สตูดิโอ, hiring, collab, แชต | ยังไม่มี RPC |
| Session / page views analytics | ต้อง consent + tracking SDK |
| Email/Slack webhook นอกแอป | ตอนนี้แจ้งในแอป (notification + toast) |
| Realtime ครบทุก schema (`anthem.*`) | บาง subscription ยังชี้ `public` |

---

## สรุป

**Admin monitor ครบวงจรพร้อมใน repo — ใช้งานเต็มหลัง `db:push` + ตั้ง role admin**
