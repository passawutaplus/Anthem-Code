# Conventions

## TypeScript

- **No `any`** — ใช้ `unknown` แล้ว narrow
- **Strict types from `@/integrations/supabase/types`** — `Database['public']['Tables']['xxx']['Row']`
- ห้ามแก้ `src/integrations/supabase/{client,types}.ts` และ `.env`

## Styling

- Tailwind tokens เท่านั้น (`bg-primary`, `text-foreground`) — ห้ามใช้สีตรง (`bg-orange-500`, `text-white`)
- ห้าม inline `style={{...}}` ยกเว้นค่า dynamic ที่ Tailwind ทำไม่ได้
- Mobile-first — default class = mobile, ใช้ `md:` `lg:` scale up
- Glassmorphism ต้องคู่ `backdrop-blur-*` + ใส่ `-webkit-backdrop-filter` ใน CSS ถ้าจำเป็น (Safari)

## Data fetching

- ใช้ **React Query** ทุกที่ — ห้าม `useEffect + setState`
- `queryKey` เป็น array ที่ stable: `["projects", "published"]`, `["profile", id]`
- ใส่ `staleTime` ตามความถี่ data เปลี่ยน (`60_000` default; `5*60_000` profile/static)
- ใส่ `enabled` เสมอเมื่อ query ขึ้นกับ user

## Supabase access

- **ห้าม** `import { supabase }` จาก component / page
- เพิ่ม query ใหม่ใน `src/server/queries/<domain>.ts`
- เพิ่ม mutation ใหม่ใน `src/server/mutations/<domain>.ts`

## Feedback UX

- ทุก mutation ต้องมี loading state + success/error toast (`sonner`)
- ทุก list ต้องมี empty state + skeleton

## Security

- Role check ผ่าน `useIsAdmin()` หรือ `has_role()` ใน RLS — ห้าม hardcode user_id
- ห้าม `console.log` ใน production code (ใช้ `if (import.meta.env.DEV)` guard)
- Secrets/API keys: ห้าม commit, ใช้ Supabase secrets + edge functions

## Database

- ทุก migration ต้องมี: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`
- ใช้ `SECURITY DEFINER` + `SET search_path` สำหรับ role-check functions
- ห้าม `DROP` / `TRUNCATE` table ที่มี user data
