/** Client-safe AI credits helpers — keep in sync with Solo-Code/src/lib/aiCredits.ts */

export const FREE_STARTER_CREDITS = 25;

export const AI_TIER_MONTHLY: Record<"free" | "pro" | "pro_plus" | "inhouse", number> = {
  free: FREE_STARTER_CREDITS,
  pro: 800,
  pro_plus: 1400,
  inhouse: 2000,
};

export function describeAiCreditsPlan(summary: {
  tier: string;
  period_type?: string;
  included_limit: number;
}): string {
  if (summary.period_type === "free_starter") {
    return "แพ็กเริ่มต้นฟรี";
  }
  if (summary.period_type === "free_starter_ended" && summary.tier === "free") {
    return "เครดิตหมดแล้ว — อัพเกรดหรือเติมเพื่อใช้ต่อ";
  }
  if (summary.period_type === "subscription") {
    return `Pro ${summary.included_limit.toLocaleString("th-TH")} เครดิต/รอบบิล`;
  }
  return `${summary.included_limit.toLocaleString("th-TH")} เครดิต/เดือน`;
}

export function formatAiPeriodEnd(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function aiRemainingPercent(remaining: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((remaining / capacity) * 100));
}

export function aiRemainingBarColor(remaining: number): string {
  if (remaining < 10) return "bg-destructive";
  if (remaining < 20) return "bg-amber-500";
  return "bg-primary";
}
