/**
 * Cross-link helper for the Anthem ↔ So1o ecosystem.
 */
import { supabase } from "@/integrations/supabase/client";
import { SO1O_APP_URL } from "@/lib/productLinks";

export { SO1O_APP_URL };

export type CrossLinkContext = {
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
  params: Record<string, string | undefined> = {},
): string {
  const url = new URL(path.startsWith("/") ? path : `/${path}`, SO1O_APP_URL);
  url.searchParams.set("from", "anthem");
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}

/** Deep-link to So1o quotation form with Anthem hire context. */
export function so1oQuotationUrl(params: {
  conversationId?: string;
  requestId?: string;
  clientName?: string;
  projectTitle?: string;
  clientEmail?: string;
  clientPhone?: string;
  message?: string;
  deadline?: string;
  linkId?: string;
}): string {
  return so1oUrl("/dashboard", {
    tab: "finance",
    sub: "quotations",
    conversation_id: params.conversationId,
    request_id: params.requestId,
    client_name: params.clientName,
    project_title: params.projectTitle,
    client_email: params.clientEmail,
    client_phone: params.clientPhone,
    message: params.message,
    deadline: params.deadline,
    link_id: params.linkId,
  });
}

/**
 * Log cross-app CTA to ecosystem_links. Never throws.
 */
export async function trackCrossLink(ctx: CrossLinkContext): Promise<string | undefined> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) return undefined;

    const { data, error } = await supabase
      .from("ecosystem_links")
      .insert({
        user_id: userId,
        event_type: "cross_link_click",
        source_app: "anthem",
        source_page: ctx.source,
        ref_id: ctx.refId ?? null,
        meta: ctx.meta ?? {},
      })
      .select("id")
      .single();

    if (error) {
      console.warn("[cross_link] insert failed", error.message);
      return undefined;
    }
    return data?.id as string | undefined;
  } catch {
    return undefined;
  }
}
