# Admin & Platform — สิ่งที่เหลือ (อัปเดต 2026-06)

เมื่อถามว่า **“ตอนนี้เหลืออะไร”** ให้ดูสองตารางด้านล่าง

---

## ทำได้เลยใน repo (ไม่ต้องรอ remote) — สถานะ

| รายการ | สถานะ |
|--------|--------|
| หน้า admin CRUD (users, projects, comments, collections, jobs) | โค้ดพร้อม |
| Notifications / Gifts (catalog, limits, cashout UI) | โค้ดพร้อม |
| AML KPI keys | แก้แล้ว |
| หน้า **Inspire** (`/admin/inspire`) + sidebar | โค้ดพร้อม |
| Export CSV + ค้นหา: สตูดิโอ, จ้าง, คอลแลป, แชต, audit | โค้ดพร้อม |
| Migration `20260604230000_fix_cashout_paid_status.sql` | ใน repo (รอ push) |
| เอกสาร manual SQL / grant admin | `scripts/sql/README.md`, `grant-admin-role.sql` |
| Build production | รัน `npm run build` หลังแก้ไข |

---

## ต้องรอคุณลงมือ (บล็อก production)

### 1. Supabase remote — สำคัญที่สุด

โปรเจกต์: **`uutbvwyoivqojozrangi`**

| ขั้นตอน | ทำอย่างไร |
|---------|-----------|
| A. Login ด้วยบัญชี **เจ้าของโปรเจกต์** | `npx supabase login` หรือ token จาก [Account Tokens](https://supabase.com/dashboard/account/tokens) |
| B. Push migrations | `export SUPABASE_ACCESS_TOKEN=sbp_...` แล้ว `npm run db:push` |
| C. หรือรัน SQL เอง | ตามลำดับใน `scripts/sql/README.md` |

ไฟล์ที่มักยังไม่ขึ้น remote:

- `20260604180000_notifications_cashout_prep.sql`
- `20260604200000_seed_art_design_enriched.sql` (ถ้าต้องการ demo data)
- `20260604220000_admin_operations.sql`
- `20260604230000_fix_cashout_paid_status.sql` (หลัง push รอบก่อน)

**หมายเหตุ:** token ที่ไม่มีสิทธิ์ใน org จะได้ error `does not have the necessary privileges`

### 2. ตั้งบัญชี admin บน remote

รัน SQL (แก้ `YOUR_USER_UUID`):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

ดู UUID จาก Dashboard → Authentication → Users

### 3. Types หลัง push

```bash
npx supabase gen types typescript --project-id uutbvwyoivqojozrangi > src/integrations/supabase/types.ts
```

### 4. ความปลอดภัย

- Revoke token ที่เคยส่งในแชท แล้วสร้างใหม่
- อย่าใส่ `sbp_...` ใน `.env` ของ Vite

---

## ยังไม่ทำ (เลื่อน / ต้องออกแบบเพิ่ม)

| รายการ | เหตุผล |
|--------|--------|
| **Stripe** | ยังไม่พร้อม — cashout จริงรอ payment |
| Admin แก้/ลบ สตูดิโอ, hiring, collab, แชต | ยังไม่มี RPC |
| Contracts / wallet ledger ใน admin | ยังไม่มีหน้า |
| Job applications แยกใน admin | ยังไม่มีหน้า |
| Seed demo บน remote | รันหลัง migration + ต้องการข้อมูลทดสอบ |

---

## สรุปหนึ่งบรรทัด

**โค้ด admin ใน repo พร้อม deploy ได้ — ฟีเจอร์ write บน production ใช้ได้หลังคุณ push DB + ตั้ง role admin เท่านั้น**
