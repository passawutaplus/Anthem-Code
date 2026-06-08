# AML & Gifting Compliance (Anthem)

เอกสารอ้างอิงสำหรับทีม ops / admin — สอดคล้องกับ migration `20260530121450` และ `.lovable/plan.md`

## โครงสร้าง PX (closed-loop)

| ช่อง wallet | ที่มา | ใช้ทำอะไร | Cashout |
|-------------|--------|-----------|---------|
| `welcome_px` | ภารกิจ Welcome Bonus (สูงสุด 500 px) | ส่งของขวัญ | ไม่ได้ |
| `purchased_px` | เติมเงิน (mock / Stripe ในอนาคต) | ส่งของขวัญ | ไม่ได้ |
| `earned_px` | รับของขวัญ | ถอนเป็นบาท | ได้ (หลัง KYC, ขั้นต่ำ 1,000 px) |

- Welcome Bonus ปลดล็อกทีละภารกิจ onboarding — RPC `claim_welcome_mission` (เพดาน `lifetime_welcome_px` = 500)
- ส่งของขวัญหัก `welcome_px` ก่อน `purchased_px` — ยอดรวมพร้อมใช้ = `available_gift_px`
- ยอด top-up มี **holding 24 ชม.** ก่อนใช้ส่ง gift (`available_purchased_px`) — **welcome_px ไม่มี holding**
- `balance_px` = `purchased_px + earned_px` (generated) — welcome_px แยกจาก balance รวม

## Limits (ค่าเริ่มต้นใน `gift_limits_config`)

- ไม่ verify: ส่ง gift รวม ≤ 500 px/วัน
- verify แล้ว: ≤ 5,000 px/วัน
- velocity: ≤ 10 gifts/ชม.
- max top-up/ครั้ง: 100,000 px
- บัญชีอายุ ≥ 1 ชม. ก่อนส่ง gift

## KYC

- ผู้ใช้ส่งคำขอที่ `/verify` → `kyc_requests` (pending)
- Admin อนุมัติที่ `/admin/kyc` → `profiles.is_verified = true`
- **Cashout ต้อง verify** — RPC `request_cashout` จะ reject ถ้ายังไม่ verify

## AML flags (`aml_flags`)

| flag_type | ความหมาย |
|-----------|----------|
| `velocity` | ส่ง gift ถี่เกิน |
| `circular_transfer` | A↔B ส่งกลับภายใน 7 วัน |
| `new_account_burst` | รับจากหลาย sender บัญชีใหม่ |
| `large_amount` | มูลค่าสูง (ถ้ามี rule) |
| `self_network` | รูปแบบเครือข่ายตนเอง |

Admin จัดการที่ `/admin/aml`: dismiss / escalate / freeze

## Cashout workflow (pre-Stripe)

1. ผู้ใช้ขอถอนที่ `/earnings` → `cashout_requests.status = pending`
2. Admin ดูที่ `/admin/gifts` (แท็บ cashout) → `admin_mark_cashout_paid`
3. ผู้ใช้ได้รับ in-app notification (`cashout_paid`)

> เมื่อเชื่อม payment จริง: เปลี่ยน `mock_paid` → `paid` และเชื่อม webhook โอนเงิน

## ก่อน go-live (checklist)

- [ ] ปิด `topup_wallet_mock` ใน production
- [ ] เปิด Stripe/Omise + webhook top-up
- [ ] Cashout จริง + สถานะ `paid` / `rejected` พร้อมคืน `earned_px` เมื่อ reject
- [ ] KYC อัปโหลดเอกสาร (storage private)
- [ ] ทบทวน `docs/security.md` และ pentest scope
