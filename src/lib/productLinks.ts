/** So1o My Desk (back-office) — quotations, clients, finance, briefs. */
export const SO1O_APP_URL =
  (import.meta.env.VITE_SO1O_APP_URL as string | undefined) ?? "http://localhost:3000";

/** Subscribe / manage Pro on So1o (canonical billing). */
export const SO1O_PRICING_URL = `${SO1O_APP_URL.replace(/\/$/, "")}/pricing`;
