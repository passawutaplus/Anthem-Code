/**
 * Unified Supabase project (rvnzjiskqliexysicfmh).
 * Routes tables to the correct Postgres schema.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const authOpts = {
  storage: localStorage,
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  flowType: "pkce",
} as const;

function requireSupabaseEnv() {
  const demoMode = import.meta.env.VITE_DEMO_MODE === "true";
  const url = demoMode
    ? import.meta.env.VITE_DEMO_SUPABASE_URL
    : import.meta.env.VITE_SUPABASE_URL;
  const key = demoMode
    ? import.meta.env.VITE_DEMO_SUPABASE_PUBLISHABLE_KEY
    : import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      demoMode
        ? "Demo builds require VITE_DEMO_SUPABASE_URL and VITE_DEMO_SUPABASE_PUBLISHABLE_KEY."
        : "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY at build time.",
    );
  }
  return { url, key };
}

function makeClient(schema: string): SupabaseClient<Database> {
  const { url, key } = requireSupabaseEnv();
  return createClient<Database>(url, key, {
    auth: authOpts,
    db: { schema },
  });
}

let publicDb: SupabaseClient<Database> | undefined;
let anthemDb: SupabaseClient<Database> | undefined;
let sharedDb: SupabaseClient<Database> | undefined;

function getPublicDb() {
  publicDb ??= makeClient("public");
  return publicDb;
}

function getAnthemDb() {
  anthemDb ??= makeClient("anthem");
  return anthemDb;
}

function getSharedDb() {
  sharedDb ??= makeClient("shared");
  return sharedDb;
}

function lazyClient(get: () => SupabaseClient<Database>): SupabaseClient<Database> {
  return new Proxy({} as SupabaseClient<Database>, {
    get(_, prop, receiver) {
      return Reflect.get(get(), prop, receiver);
    },
  });
}
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
  "kyc_documents",
  "payout_profiles",
  "notifications",
  "user_moderation_state",
  "moderation_actions",
  "marketplace_escrows",
  "referral_program_config",
  "referral_codes",
  "referrals",
  "referral_reward_ledger",
]);

export function schemaForTable(table: string): "public" | "anthem" | "shared" {
  if (PUBLIC_TABLES.has(table)) return "public";
  if (SHARED_TABLES.has(table)) return "shared";
  return "anthem";
}

export function fromTable(table: string) {
  const schema = schemaForTable(table);
  if (schema === "public") return getPublicDb().from(table as never);
  if (schema === "shared") return getSharedDb().from(table as never);
  return getAnthemDb().from(table as never);
}

/** Canonical auth user id column on unified profiles (So1o uses user_id, not id). */
export const PROFILE_USER_COLUMN = "user_id" as const;

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    if (prop === "from") {
      return (table: string) => fromTable(table);
    }
    return Reflect.get(getPublicDb(), prop, receiver);
  },
}) as SupabaseClient<Database>;

const publicDbClient = lazyClient(getPublicDb);
const anthemDbClient = lazyClient(getAnthemDb);
const sharedDbClient = lazyClient(getSharedDb);

export { publicDbClient as publicDb, anthemDbClient as anthemDb, sharedDbClient as sharedDb };
