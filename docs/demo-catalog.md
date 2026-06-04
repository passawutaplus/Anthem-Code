# Demo Catalog (ชุมชนตัวอย่าง)

ข้อมูล demo สำหรับดูภาพรวมเว็บ — **ลบทีหลังได้** โดยลบ auth users ที่อีเมลลงท้าย `@demo.an1hem.app` และแถวที่อ้าง `_catalog_demo_uid`

## รัน seed

### วิธีที่ 1: SQL migration (แนะนำ)

ใน Supabase SQL Editor หรือ CLI:

```bash
supabase db push
```

ไฟล์ที่เกี่ยวข้อง:

1. `20260604130100_seed_community_catalog.sql` — users, profiles, projects, studios, jobs
2. `20260604200000_seed_art_design_enriched.sql` — ภาพ art/design, follows, likes, **โฆษณา active**

### วิธีที่ 2: Node script (ต้องมี service role)

```bash
# สร้าง scripts/ecosystem/.env.seed.local
# SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...

node scripts/run-seed.mjs
```

## เข้าสู่ระบบทดสอบ

| ฟิลด์ | ค่า |
|--------|-----|
| อีเมล | `{username}@demo.an1hem.app` เช่น `phatsawut@demo.an1hem.app` |
| รหัสผ่าน | `an1hem-demo-seed` |

รายชื่อ username: `phatsawut`, `napatsara`, `pimchanok`, … (20 คน — ดูใน migration)

UUID คงที่: `00000000-0000-0000-0000-00000000a001` … `a014` (hex ต่อท้าย)

## สิ่งที่ seed สร้าง

- **20 ครีเอเตอร์** สาย art / design / illustration / UI / photo
- **20 ผลงาน Published** — รูปจาก Unsplash (art & design) กล้อง 3 รูปต่อโปรเจกต์
- **10 สตูดิโอ** พร้อม slug `/s/doi-studio` ฯลฯ
- **12 ประกาศงาน**
- **ติดตาม + ไลค์** จำลอง social graph
- **6 แคมเปญโฆษณา `active`** แสดงในฟีด (`AdCard`)

## โฆษณาในฟีด

- ดึงจาก RPC `get_active_ads` — สถานะ `active` และยังไม่หมดอายุ
- ผู้ลงโฆษณาจริง: `/advertise` (mock ชำระเงิน)
- Demo: seed ใส่ `ad_campaigns` โดยตรง + ข้อความ `โฆษณาตัวอย่าง — ข้อมูล demo`

## Sitemap

```bash
npm run sitemap:gen
```

สร้าง `public/sitemap.xml` รวมหน้า static + `/project/{id}` + `/u/{id}` + `/s/{slug}` ของ demo

ตั้ง `VITE_SITE_URL` ให้ตรงโดเมนจริงก่อน generate

## ลบข้อมูล demo (ภายหลัง)

```sql
-- ลำดับคร่าว ๆ (ปรับตาม FK จริง)
DELETE FROM public.ad_events WHERE ad_id IN (SELECT id FROM public.ad_campaigns WHERE id::text LIKE '00000000-0000-0000-0004-%');
DELETE FROM public.ad_campaigns WHERE id::text LIKE '00000000-0000-0000-0004-%';
DELETE FROM public.project_likes WHERE project_id::text LIKE '00000000-0000-0000-0002-%';
DELETE FROM public.follows WHERE follower_id::text LIKE '00000000-0000-0000-0000-00000000a0%';
DELETE FROM public.projects WHERE id::text LIKE '00000000-0000-0000-0002-%';
DELETE FROM public.job_posts WHERE id::text LIKE '00000000-0000-0000-0003-%';
-- studios, members, profiles, auth.users ...
```

ลบ `auth.users` ที่ `email LIKE '%@demo.an1hem.app'` ผ่าน Dashboard → Authentication
