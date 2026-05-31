# Anthem — Developer Docs

Entry point สำหรับ dev ใหม่ อ่านเรียงตามนี้:

1. [`architecture.md`](./architecture.md) — ภาพรวมการไหลของข้อมูล client → server → supabase
2. [`folder-structure.md`](./folder-structure.md) — ทำไม folder วางแบบนี้
3. [`conventions.md`](./conventions.md) — code style + กติกาที่บังคับ
4. [`data-model.md`](./data-model.md) — table list + schema target (shared/anthem/so1o)
5. [`adding-a-feature.md`](./adding-a-feature.md) — step-by-step เพิ่ม feature ใหม่
6. [`performance.md`](./performance.md) — กฎ performance ที่ต้องตามทุก PR
7. [`schema-reorganize.md`](./schema-reorganize.md) — แผนรวม schema (Phase 2)

## Quick start

```bash
bun install
bun run dev
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
