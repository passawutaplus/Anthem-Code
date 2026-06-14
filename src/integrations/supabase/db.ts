/**
 * Unified Supabase project (rvnzjiskqliexysicfmh).
 * Routes tables to the correct Postgres schema.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const authOpts = {
  storage: localStorage,
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  flowType: "pkce",
} as const;

function makeClient(schema: string): SupabaseClient<Database> {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: authOpts,
    db: { schema },
  });
}

const publicDb = makeClient("public");
const anthemDb = makeClient("anthem");
const sharedDb = makeClient("shared");

/** Tables that live in public (So1o identity + billing). */
const PUBLIC_TABLES = new Set([
  "profiles",
  "user_roles",
  "subscriptions",
  "user_credits",
  "ecosystem_notifications",
  "so1o_notifications",
  "platform_events",
]);

/** Cross-app wallet / chat / compliance. */
const SHARED_TABLES = new Set([
  "wallets",
  "wallet_topups",
  "cashout_requests",
  "gifts",
  "gift_transactions",
  "gift_limits_config",
  "contracts",
  "admin_audit_log",
  "conversations",
  "conversation_members",
  "conversation_pins",
  "messages",
  "aml_flags",
  "kyc_requests",
  "notifications",
  "user_moderation_state",
  "moderation_actions",
]);

export function schemaForTable(table: string): "public" | "anthem" | "shared" {
  if (PUBLIC_TABLES.has(table)) return "public";
  if (SHARED_TABLES.has(table)) return "shared";
  return "anthem";
}

export function fromTable(table: string) {
  const schema = schemaForTable(table);
  if (schema === "public") return publicDb.from(table as never);
  if (schema === "shared") return sharedDb.from(table as never);
  return anthemDb.from(table as never);
}

/** Canonical auth user id column on unified profiles (So1o uses user_id, not id). */
export const PROFILE_USER_COLUMN = "user_id" as const;

export const supabase = new Proxy(publicDb, {
  get(target, prop, receiver) {
    if (prop === "from") {
      return (table: string) => fromTable(table);
    }
    return Reflect.get(target, prop, receiver);
  },
}) as SupabaseClient<Database>;

export { publicDb, anthemDb, sharedDb };
