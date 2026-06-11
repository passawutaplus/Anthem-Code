import { supabase } from "@/integrations/supabase/client";
import { SO1O_APP_URL } from "@/lib/productLinks";

export type StripePaymentsEnv = "sandbox" | "live";

export function getStripePaymentsEnv(): StripePaymentsEnv {
  const mode = import.meta.env.VITE_STRIPE_MODE as string | undefined;
  if (mode === "live") return "live";
  return "sandbox";
}

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อน");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function startStripeCheckout(opts: {
  priceId: string;
  successPath: string;
  cancelPath?: string;
}): Promise<void> {
  const origin = window.location.origin;
  const successUrl = opts.successPath.startsWith("http")
    ? opts.successPath
    : `${origin}${opts.successPath}`;
  const cancelUrl = opts.cancelPath
    ? opts.cancelPath.startsWith("http")
      ? opts.cancelPath
      : `${origin}${opts.cancelPath}`
    : `${origin}/earnings?topup=canceled`;

  const res = await fetch(`${SO1O_APP_URL.replace(/\/$/, "")}/api/payments/checkout`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      priceId: opts.priceId,
      environment: getStripePaymentsEnv(),
      successUrl,
      cancelUrl,
    }),
  });

  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || json.error || !json.url) {
    throw new Error(json.error ?? "ไม่สามารถเริ่ม checkout ได้");
  }
  window.location.href = json.url;
}

export async function startConnectOnboarding(opts: {
  returnPath: string;
  refreshPath?: string;
}): Promise<void> {
  const origin = window.location.origin;
  const returnUrl = opts.returnPath.startsWith("http")
    ? opts.returnPath
    : `${origin}${opts.returnPath}`;
  const refreshUrl = opts.refreshPath
    ? opts.refreshPath.startsWith("http")
      ? opts.refreshPath
      : `${origin}${opts.refreshPath}`
    : `${origin}/earnings?connect=refresh`;

  const res = await fetch(`${SO1O_APP_URL.replace(/\/$/, "")}/api/payments/connect/onboard`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      environment: getStripePaymentsEnv(),
      returnUrl,
      refreshUrl,
    }),
  });

  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || json.error || !json.url) {
    throw new Error(json.error ?? "ไม่สามารถเริ่มเชื่อมบัญชีได้");
  }
  window.location.href = json.url;
}

export async function processCashoutViaStripe(cashoutId: string): Promise<string> {
  const res = await fetch(`${SO1O_APP_URL.replace(/\/$/, "")}/api/payments/cashout/process`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({
      cashoutId,
      environment: getStripePaymentsEnv(),
    }),
  });

  const json = (await res.json()) as { transferId?: string; error?: string };
  if (!res.ok || json.error || !json.transferId) {
    throw new Error(json.error ?? "โอน Stripe ล้มเหลว");
  }
  return json.transferId;
}

/** Map preset px amounts to Stripe lookup keys. */
export const PX_PRICE_BY_AMOUNT: Record<number, string> = {
  500: "px_500",
  2000: "px_2000",
  10000: "px_10000",
};
