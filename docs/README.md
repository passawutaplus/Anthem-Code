# Anthem — Developer Docs

Entry point สำหรับ dev ใหม่ อ่านเรียงตามนี้:

1. [`architecture.md`](./architecture.md) — ภาพรวมการไหลของข้อมูล client → server → supabase
2. [`folder-structure.md`](./folder-structure.md) — ทำไม folder วางแบบนี้
3. [`conventions.md`](./conventions.md) — code style + กติกาที่บังคับ
4. [`data-model.md`](./data-model.md) — table list + schema target (shared/anthem/so1o)
5. [`adding-a-feature.md`](./adding-a-feature.md) — step-by-step เพิ่ม feature ใหม่
6. [`performance.md`](./performance.md) — กฎ performance ที่ต้องตามทุก PR
7. [`schema-reorganize.md`](./schema-reorganize.md) — แผนรวม schema (Phase 2)

## QA / Testing

| Doc | ใช้เมื่อ |
|-----|---------|
| [`full-test-plan.md`](./full-test-plan.md) | แผนเทสจัดเต็ม |
| [`../../docs/MANUAL-TESTING.md`](../../docs/MANUAL-TESTING.md) | รายการเทส manual (64 ข้อ) |
| [`qa-checklist.md`](./qa-checklist.md) | Checklist ก่อน release |
| [`qa-onboarding.md`](./qa-onboarding.md) | Onboarding QA |
| [`test-accounts.md`](./test-accounts.md) | Role matrix |
| [`e2e-playwright.md`](./e2e-playwright.md) | Playwright |
| [`e2e-puppeteer.md`](./e2e-puppeteer.md) | Puppeteer (WSL fallback) |

```bash
npm install
npm run dev              # → http://localhost:8080
npm run test             # vitest
npm run smoke:public
npm run e2e:puppeteer:smoke
npm run e2e:puppeteer:chat   # demo chat on demo URL
```

## Quick start

```bash
npm install
npm run dev              # → http://localhost:8080
npm run test
npm run smoke:public
```

Env vars (.env auto-generated โดย Lovable Cloud — อย่าแก้):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Tech stack

- React 18 + Vite 5 + TypeScript 5
- Tailwind CSS v3 + shadcn/ui + Lucide
- React Query (server state) + Zustand (client state)
- Supabase (Lovable Cloud) — Postgres + RLS + Realtime + Storage + Edge Functions

## หา code ไม่เจอ?

- หน้าเว็บ (route) → `src/pages/`
- ตรรกะ business + supabase query → `src/features/<domain>/` (re-export จาก `src/hooks/`)
- ของที่ใช้ร่วมกับ So1o → `src/core/`
- supabase wrapper (queries/mutations แบบ pure) → `src/server/`
- utilities → `src/lib/`
