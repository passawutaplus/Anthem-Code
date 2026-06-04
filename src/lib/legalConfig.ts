/** ค่ากลางสำหรับเอกสารกฎหมาย — ปรับผ่าน env ได้ก่อน production */

export const LEGAL_APP_NAME =
  (import.meta.env.VITE_LEGAL_APP_NAME as string | undefined) ?? "Anthem";

export const LEGAL_COMPANY_NAME =
  (import.meta.env.VITE_LEGAL_COMPANY_NAME as string | undefined) ??
  "Anthem Platform";

export const LEGAL_UPDATED_AT =
  (import.meta.env.VITE_LEGAL_UPDATED_AT as string | undefined) ?? "31 พฤษภาคม 2026";

export const LEGAL_DPO_EMAIL =
  (import.meta.env.VITE_LEGAL_DPO_EMAIL as string | undefined) ?? "privacy@anthem.app";

export const LEGAL_SUPPORT_EMAIL =
  (import.meta.env.VITE_LEGAL_SUPPORT_EMAIL as string | undefined) ?? "support@anthem.app";

export const LEGAL_WEBSITE =
  (import.meta.env.VITE_LEGAL_WEBSITE as string | undefined) ?? "http://localhost:8081";
