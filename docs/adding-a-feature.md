# Adding a Feature

Walkthrough เพิ่ม feature "notes" สมมุติ

## 1. Database (ถ้ามี)

ใช้ migration tool ของ Lovable — ห้ามรัน SQL มือ

```sql
CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner read"   ON public.notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "owner write"  ON public.notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owner update" ON public.notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "owner delete" ON public.notes FOR DELETE USING (auth.uid() = user_id);
```

## 2. Server layer

`src/server/queries/notes.ts`:

```ts
import { supabase } from "@/integrations/supabase/client";

export async function listNotes(userId: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("id, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
```

`src/server/mutations/notes.ts`:

```ts
import { supabase } from "@/integrations/supabase/client";

export async function createNote(input: { user_id: string; content: string }) {
  const { data, error } = await supabase.from("notes").insert(input).select().single();
  if (error) throw error;
  return data;
}
```

## 3. Feature hook

`src/features/notes/use-notes.ts`:

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { listNotes } from "@/server/queries/notes";
import { createNote } from "@/server/mutations/notes";

export function useNotes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notes", user?.id],
    queryFn: () => listNotes(user!.id),
    enabled: !!user,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}
```

`src/features/notes/index.ts`:

```ts
export * from "./use-notes";
```

## 4. Component

```tsx
import { useNotes, useCreateNote } from "@/features/notes";
```

เสร็จ — ไม่มี supabase import ใน component
