import { BRAND_NAME } from "@/lib/brandConfig";

/** LINE notification preference keys (stored in profiles.line_notify_prefs). */

export type LineNotifyKind =
  | "portal_slip"
  | "portal_tracker_comment"
  | "portal_brief"
  | "portal_planner"
  | "portal_quotation"
  | "anthem_hire"
  | "anthem_chat"
  | "anthem_job_match"
  | "inhouse_invite"
  | "inhouse_member_join"
  | "inhouse_chat"
  | "inhouse_task"
  | "support_ticket"
  | "billing";

export type UserLocale = "th" | "en";

export const DEFAULT_LINE_NOTIFY_PREFS: Record<LineNotifyKind, boolean> = {
  portal_slip: true,
  portal_tracker_comment: true,
  portal_brief: true,
  portal_planner: true,
  portal_quotation: true,
  anthem_hire: true,
  anthem_chat: true,
  anthem_job_match: true,
  inhouse_invite: true,
  inhouse_member_join: true,
  inhouse_chat: true,
  inhouse_task: true,
  support_ticket: false,
  billing: false,
};

export interface LineNotifyGroup {
  id: string;
  label: Record<UserLocale, string>;
  description: Record<UserLocale, string>;
  kinds: Array<{
    key: LineNotifyKind;
    label: Record<UserLocale, string>;
    hint: Record<UserLocale, string>;
  }>;
}

export const LINE_NOTIFY_GROUPS: LineNotifyGroup[] = [
  {
    id: "anthem",
    label: { th: "จากหน้าร้านโชว์เคส", en: `${BRAND_NAME} showcase` },
    description: {
      th: "คำขอจ้าง แชท และงานที่ตรงสกิลจากหน้าร้าน",
      en: `Hire requests, chat, and job matches from ${BRAND_NAME}`,
    },
    kinds: [
      {
        key: "anthem_hire",
        label: { th: "คำขอจ้างงานใหม่", en: "New hire request" },
        hint: { th: "มีลูกค้าส่งคำขอจ้างจากผลงาน", en: "Someone requested to hire you" },
      },
      {
        key: "anthem_chat",
        label: { th: "ข้อความแชทใหม่", en: "New chat message" },
        hint: { th: "แชทจ้างงานหรือคอลแลป", en: "Hire or collab live chat" },
      },
      {
        key: "anthem_job_match",
        label: { th: "งานตรงสกิล", en: "Job match" },
        hint: { th: "ประกาศงานที่ตรงกับสกิลของคุณ", en: "Job board match for your skills" },
      },
    ],
  },
  {
    id: "portal",
    label: { th: "จากลูกค้าในหน้าที่แชร์", en: "So1o customer portal" },
    description: {
      th: "แจ้งเตือนเมื่อลูกค้าทำอะไรบนหน้าที่แชร์จากหลังบ้าน",
      en: "When clients act on your shared So1o links",
    },
    kinds: [
      {
        key: "portal_slip",
        label: { th: "อัปโหลดสลิปชำระเงิน", en: "Payment slip uploaded" },
        hint: { th: "ติดตามงาน — ลูกค้าส่งสลิปในลิงก์ติดตามงาน", en: "Job Tracker — client uploads a slip" },
      },
      {
        key: "portal_tracker_comment",
        label: { th: "คอมเมนต์ในงาน", en: "Job step comment" },
        hint: { th: "ติดตามงาน — ลูกค้าแสดงความคิดเห็นในขั้นตอนงาน", en: "Job Tracker — client comments" },
      },
      {
        key: "portal_brief",
        label: { th: "ยืนยันบรีฟงาน", en: "Brief confirmed" },
        hint: { th: "บรีฟงาน — ลูกค้ากดยืนยันบรีฟครบถ้วน", en: "Design Brief — client confirms brief" },
      },
      {
        key: "portal_planner",
        label: { th: "อนุมัติ / ขอแก้คอนเทนต์", en: "Content approval" },
        hint: { th: "วางแผนคอนเทนต์ — ลูกค้าอนุมัติหรือขอแก้โพสต์", en: "Content Planner — client approves" },
      },
      {
        key: "portal_quotation",
        label: { th: "อัปเดตใบเสนอราคา", en: "Quotation update" },
        hint: { th: "เร็วๆ นี้ — ลูกค้าตอบรับใบเสนอราคา", en: "Coming soon — quotation response" },
      },
    ],
  },
  {
    id: "inhouse",
    label: { th: "In-House Workspace", en: "In-House workspace" },
    description: {
      th: "คำเชิญทีม แชท และงานที่มอบหมายใน workspace",
      en: "Team invites, workspace chat, and task assignments",
    },
    kinds: [
      {
        key: "inhouse_invite",
        label: { th: "คำเชิญเข้าร่วมทีม", en: "Team invite" },
        hint: { th: "เมื่อ admin เชิญคุณเข้า org", en: "When an admin invites you to an org" },
      },
      {
        key: "inhouse_member_join",
        label: { th: "สมาชิกใหม่เข้าร่วม", en: "New member joined" },
        hint: { th: "เมื่อมีคนยอมรับคำเชิญของทีมคุณ", en: "When someone accepts your team invite" },
      },
      {
        key: "inhouse_chat",
        label: { th: "ข้อความใน workspace", en: "Workspace message" },
        hint: { th: "แชทในช่องของ workspace", en: "Messages in workspace channels" },
      },
      {
        key: "inhouse_task",
        label: { th: "มอบหมายงาน / due date", en: "Task assignment / due date" },
        hint: { th: "ถูก assign to-do หรือใกล้ครบกำหนด", en: "Assigned a task or due today" },
      },
    ],
  },
  {
    id: "system",
    label: { th: "ระบบและบัญชี", en: "Account & support" },
    description: {
      th: "การแจ้งเตือนจากระบบโดยตรง",
      en: "Notifications from So1o itself",
    },
    kinds: [
      {
        key: "support_ticket",
        label: { th: "ตั๋วซัพพอร์ต", en: "Support tickets" },
        hint: { th: "สถานะตั๋วช่วยเหลือ", en: "Support ticket status changes" },
      },
      {
        key: "billing",
        label: { th: "การชำระเงินแพ็กเกจ", en: "Subscription billing" },
        hint: { th: "บัตรถูกปฏิเสธหรือใกล้หมดอายุ", en: "Card declined or renewal alerts" },
      },
    ],
  },
];

export function mergeLineNotifyPrefs(raw: unknown): Record<LineNotifyKind, boolean> {
  const base = { ...DEFAULT_LINE_NOTIFY_PREFS };
  if (!raw || typeof raw !== "object") return base;
  for (const key of Object.keys(base) as LineNotifyKind[]) {
    const v = (raw as Record<string, unknown>)[key];
    if (typeof v === "boolean") base[key] = v;
  }
  return base;
}

export function pickLocale(raw: unknown): UserLocale {
  return raw === "en" ? "en" : "th";
}
