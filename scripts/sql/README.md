# รัน migration บน remote ด้วยมือ (เมื่อ `npm run db:push` ใช้ไม่ได้)

โปรเจกต์: **uutbvwyoivqojozrangi**

เปิด [SQL Editor](https://supabase.com/dashboard/project/uutbvwyoivqojozrangi/sql/new) แล้วรันไฟล์ตามลำดับ

## ลำดับที่แนะนำ (ชุดงานล่าสุด)

1. `supabase/migrations/20260604180000_notifications_cashout_prep.sql`
2. `supabase/migrations/20260604220000_admin_operations.sql`
3. `supabase/migrations/20260604230000_fix_cashout_paid_status.sql`
4. `supabase/migrations/20260604240000_public_feed_stats.sql`
5. *(demo สำหรับทดสอบ UX)* `20260604130100_seed_community_catalog.sql` แล้ว `20260604200000_seed_art_design_enriched.sql`

ลบ demo ภายหลัง: `purge-demo-users.sql`

## ตั้ง admin

รัน `grant-admin-role.sql` หลังแก้ `YOUR_USER_UUID`

## หลังรัน SQL

```bash
npx supabase gen types typescript --project-id uutbvwyoivqojozrangi > src/integrations/supabase/types.ts
```
