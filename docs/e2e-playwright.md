# E2E (Playwright) — ติดตั้ง + รัน

ไม่ได้ commit `@playwright/test` ลงใน dependencies เพราะ binary หนัก (~300MB) — ติดตั้งเฉพาะตอนรัน

## ครั้งแรก

```bash
bun add -d @playwright/test
bunx playwright install --with-deps chromium webkit
```

(เพิ่ม webkit เผื่อจะเทส Safari)

## รัน

```bash
# Smoke (เร็ว ~10s, ไม่ต้อง login) — ใช้ก่อนปล่อย QA
bunx playwright test --project=smoke

# E2E ทั้งหมด (ต้องตั้ง env test accounts ก่อน)
export E2E_USER_EMAIL=qa-user-a@example.com
export E2E_USER_PASSWORD='...'
export E2E_ADMIN_EMAIL=qa-admin@example.com
export E2E_ADMIN_PASSWORD='...'
bunx playwright test --project=chromium

# รันกับ deployment ภายนอก (ไม่ start dev server เอง)
E2E_BASE_URL=https://anthem-freelancehub.lovable.app bunx playwright test --project=smoke

# UI mode สำหรับ debug
bunx playwright test --ui

# Report
bunx playwright show-report
```

## โครงสร้าง

```text
e2e/
├── fixtures/accounts.ts      # อ่าน credential จาก env
├── helpers/auth.ts           # signIn(role) helper
├── smoke/*.smoke.spec.ts     # public-only checks, ไม่ login
├── auth.e2e.spec.ts          # login + session
└── flows/                    # ต้อง login
    ├── admin.e2e.spec.ts
    └── project-create.e2e.spec.ts
```

## หมายเหตุ

- `playwright.config.ts` มี `webServer` autostart `bun run dev` → ถ้าจะรันกับ remote ให้เซ็ต `E2E_BASE_URL`
- ห้ามรัน E2E บน production DB จริง — ใช้ preview environment เท่านั้น
- เพิ่ม script ใน `package.json` ได้ตามต้องการ:
  ```json
  "e2e:smoke": "playwright test --project=smoke",
  "e2e": "playwright test --project=chromium"
  ```

## CI (อนาคต)

ดู `.github/workflows/e2e.yml` (TODO) — รัน smoke ทุก PR, รัน E2E เต็มก่อน deploy production
