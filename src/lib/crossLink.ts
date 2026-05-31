/**
 * Cross-link helper for the Anthem ↔ So1o ecosystem.
 *
 * Phase 1: pure deep-link CTAs. No backend integration yet — the target
 * app reads query params to prefill forms. Tracking is best-effort.
 */
import { supabase } from "@/integrations/supabase/client";

export const SO1O_APP_URL =
  (import.meta.env.VITE_SO1O_APP_URL as string | undefined) ??
  "https://so1o.lovable.app";

type CrossLinkContext = {
  /** Where the CTA lives, e.g. "project_detail" | "chat_header". */
  source: string;
  /** Anthem entity id this link references. */
  refId?: string;
  /** Optional extra payload (kept small). */
  meta?: Record<string, string | number | undefined>;
};

/**
 * Build a So1o URL with cross-link query params.
 */
export function so1oUrl(
  path: string,
  params: Record<string, string | undefined> = {}
): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, SO1O_APP_URL);
  url.searchParams.set("from", "anthem");
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}

/**
 * Best-effort log of a cross-app CTA click. Never throws.
 * In Phase 2 this will write to a shared analytics table; for now it
 * logs to the console so we can validate the wiring during prototyping.
 */
export function trackCrossLink(ctx: CrossLinkContext): void {
  try {
    // Lightweight client log — replace with shared.notifications/analytics
    // table in Phase 2.
    // eslint-disable-next-line no-console
    console.info("[cross_link_clicked]", ctx);
    // Fire-and-forget user context capture (no await, no error surface).
    void supabase.auth.getUser().then(({ data }) => {
      // eslint-disable-next-line no-console
      console.info("[cross_link_clicked:user]", data.user?.id ?? "anon");
    });
  } catch {
    /* noop */
  }
}
