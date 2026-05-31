/**
 * @deprecated Phase 0 of Anthem ↔ So1o consolidation.
 *
 * Previously this pointed to a secondary Supabase project (So1o Freelancer
 * Management) for cross-app file sharing. The roadmap now consolidates both
 * apps onto a single Supabase backend (Phase 2), so this module is a thin
 * re-export of the primary client.
 *
 * Do NOT add new imports of `sharedStorage` / `SHARED_MEDIA_BUCKET`. Use
 * `supabase` from `@/integrations/supabase/client` directly. Remaining
 * imports here will be migrated and this file deleted in Phase 2.
 */
import { supabase } from "./client";

export const sharedStorage = supabase;
export const SHARED_MEDIA_BUCKET = "project-media" as const;
export const SHARED_STORAGE_URL = "" as const;
