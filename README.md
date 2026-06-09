# 1PX — Portfolio Hub

ชุมชนครีเอทีฟไทย — ทุกฟรีแลนซ์คือ 1 PX รวมกันเป็นภาพใหญ่ (คู่กับ So1o Freelancer Management — ดู `docs/schema-reorganize.md`)

## Quick start

```bash
bun install
bun run dev
```

เปิด http://localhost:5173

## Tech stack

- React 18 + Vite 5 + TypeScript 5
- Tailwind CSS v3 + shadcn/ui + Lucide
- React Query (server state) + Zustand (client state)
- Supabase (Lovable Cloud)

## Project structure

```text
src/
├── core/        ← shared กับ So1o (auth, profile, wallet, notifications)
├── features/    ← 1PX business domains (projects, jobs, chat, ...)
├── server/      ← pure supabase queries/mutations
├── hooks/       ← generic UI hooks
├── lib/         ← utilities
├── components/  ← presentational
├── pages/       ← routes
└── integrations/supabase  ← auto-generated, ห้ามแก้
```

## เอกสารสำหรับ dev

อ่าน [`docs/README.md`](./docs/README.md) ก่อนเริ่มงาน — มี:
- Architecture & data flow
- Folder structure
- Coding conventions
- Performance rules
- Step-by-step "เพิ่ม feature ใหม่ยังไง"

## คำสั่งที่ใช้บ่อย

```bash
bun run dev          # dev server
bun run build        # production build
bun run preview      # preview build
bunx vitest run      # unit tests
```

## กฎสำคัญ

- ห้าม import `@/integrations/supabase/client` ใน component/page — ใช้ hook จาก `@/features/*` หรือ `@/core/*` (มี ESLint guard)
- ห้ามแก้ `src/integrations/supabase/{client,types}.ts` และ `.env` (auto-gen)
- ทุก migration: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`
