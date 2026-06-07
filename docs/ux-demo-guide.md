# คู่มือ UX + ทดสอบด้วยข้อมูล Demo

## เปิดโหมดทดสอบบนเครื่อง

ใน `.env` (ไม่ commit):

```env
VITE_DEMO_MODE=true
```

จะแสดงแถบบนสุดพร้อมวิธี login demo

## รัน seed (ข้อมูลจริงจำลอง 20 ครีเอเตอร์)

```bash
npm run db:push
# หรือรัน SQL ตาม scripts/sql/README.md
```

| อีเมล | รหัส |
|--------|------|
| `phatsawut@demo.an1hem.app` (และ username อื่น ๆ) | `an1hem-demo-seed` |

ดูรายชื่อครบใน `docs/demo-catalog.md`

## เช็กลิสต์ UX หลัง seed

- [ ] หน้าแรก `/` — ฟีดโหลด skeleton ไม่กระพริบ "ไม่พบผลงาน"
- [ ] Hero แสดงตัวเลขดีไซเนอร์/ผลงาน (หลัง migration `public_feed_stats`)
- [ ] แท็บดีไซเนอร์ / สตูดิโอ — การ์ด + empty state ภาษาไทย
- [ ] เปิด `/u/{demo-uuid}` — โปรไฟล์ + ผลงาน Unsplash
- [ ] `/project/{id}` — รายละเอียด + จ้าง/คอลแลป
- [ ] `/jobs` — ประกาศจาก seed
- [ ] `/s/doi-studio` — สตูดิโอ demo
- [ ] Login demo → `/portfolio`, `/notifications`, `/admin` (ถ้ามี role admin)

## ลบ demo ก่อน production

`scripts/sql/purge-demo-users.sql` + ลบ `auth.users` ที่ `@demo.an1hem.app`
