/** รายการคุกกี้/ที่เก็บในเบราว์เซอร์ที่แพลตฟอร์มใช้จริง */

export type CookieCatalogRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: "essential" | "functional" | "analytics";
};

export const COOKIE_CATALOG: CookieCatalogRow[] = [
  {
    name: "sb-*-auth-token",
    provider: "Supabase Auth",
    purpose: "ยืนยันตัวตนและรักษาเซสชันการเข้าสู่ระบบ",
    duration: "ตามการตั้งค่าเซสชัน / จดจำฉัน",
    category: "essential",
  },
  {
    name: "anthem-cookie-consent",
    provider: "Anthem",
    purpose: "บันทึกการเลือกความยินยอมคุกกี้",
    duration: "จนกว่าจะลบหรือเปลี่ยนเวอร์ชันนโยบาย",
    category: "essential",
  },
  {
    name: "theme",
    provider: "Anthem",
    purpose: "จดจำโหมดสี (สว่าง/มืด)",
    duration: "ถาวร (localStorage)",
    category: "functional",
  },
  {
    name: "feed-mode",
    provider: "Anthem",
    purpose: "จดจำมุมมองฟีด (ผลงาน/ดีไซเนอร์/สตูดิโอ)",
    duration: "ถาวร (localStorage)",
    category: "functional",
  },
  {
    name: "viewed:{projectId}",
    provider: "Anthem",
    purpose: "นับยอดเข้าชมผลงานต่อเซสชัน (ไม่นับซ้ำ)",
    duration: "เซสชัน (sessionStorage)",
    category: "analytics",
  },
  {
    name: "an1hem_no_persist",
    provider: "Anthem",
    purpose: "ระบุว่าไม่ต้องการจดจำการเข้าสู่ระบบ",
    duration: "เซสชัน",
    category: "functional",
  },
];
