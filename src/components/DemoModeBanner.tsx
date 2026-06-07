import { Info } from "lucide-react";
import { Link } from "react-router-dom";

/** แถบแจ้งโหมดทดสอบ — เปิดด้วย VITE_DEMO_MODE=true */
export default function DemoModeBanner() {
  if (import.meta.env.VITE_DEMO_MODE !== "true") return null;

  return (
    <div
      role="status"
      className="bg-primary/10 border-b border-primary/20 text-foreground text-xs sm:text-sm px-3 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center thai-body"
    >
      <Info className="w-3.5 h-3.5 shrink-0 text-primary" aria-hidden />
      <span>
        <strong>โหมดทดสอบ</strong> — ข้อมูล demo 50 ครีเอเตอร์ (
        <code className="text-[11px] bg-muted px-1 rounded">*@demo.an1hem.app</code> / รหัส{" "}
        <code className="text-[11px] bg-muted px-1 rounded">an1hem-demo-seed</code>)
      </span>
      <Link to="/auth" className="text-primary font-medium hover:underline whitespace-nowrap">
        เข้าสู่ระบบทดสอบ
      </Link>
      <span className="text-muted-foreground hidden sm:inline">· ลบผู้ใช้ demo จาก admin ก่อนเปิดจริง</span>
    </div>
  );
}
