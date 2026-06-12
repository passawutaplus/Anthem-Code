import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, LogIn, Map, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brandConfig";
import { DEMO_WARNING_BULLETS } from "@/lib/copyConstants";
import {
  DEMO_PASSWORD,
  DEMO_RESEARCH_ACCOUNTS,
  isDemoMode,
} from "@/lib/demoMode";
import SeoHead from "@/components/SeoHead";

const TASKS = [
  {
    id: "T1",
    title: "ค้นหาดีไซเนอร์จากฟีด",
    steps: ["เปิดหน้าแรก", "สลับแท็บ ผลงาน / ดีไซเนอร์ / สตูดิโอ", "เปิดโปรไฟล์และผลงาน 2–3 รายการ"],
    success: "เข้าใจว่าฟีดช่วยค้นหาและประเมินครีเอเตอร์ได้เร็วแค่ไหน",
  },
  {
    id: "T2",
    title: "ล็อกอินและจัดการพอร์ตโฟลิโอ",
    steps: [
      "Login ด้วยบัญชี demo",
      "ไป /portfolio ดู Welcome checklist",
      "ลองแก้ bio หรือเพิ่มผลงาน (ถ้าต้องการทดสอบบันทึก)",
    ],
    success: "รู้ว่าหลังล็อกอินทำอะไรต่อได้ทันที",
  },
  {
    id: "T3",
    title: "จ้างงาน / ขอคอลแลป",
    steps: ["เปิดผลงานใดผลงานหนึ่ง", "กดจ้างงานหรือขอคอลแลป", "ดู flow ฟอร์มและข้อความยืนยัน"],
    success: "ฟอร์มชัด ไม่สับสนระหว่างจ้าง vs คอลแลป",
  },
  {
    id: "T4",
    title: "สำรวจงานและชุมชน",
    steps: ["ไป /jobs", "อ่านประกาศจ้างและโหมดหางาน", "กลับฟีด ลองไลก์/คอมเมนต์ (ถ้าล็อกอินแล้ว)"],
    success: "เห็นภาพรวมชุมชนครีเอทีฟไทย",
  },
] as const;

const PAGES = [
  { path: "/", label: "ฟีดหลัก" },
  { path: "/jobs", label: "งาน" },
  { path: "/auth", label: "เข้าสู่ระบบ" },
  { path: "/portfolio", label: "พอร์ตโฟลิโอของฉัน (ต้อง login)" },
  { path: "/notifications", label: "การแจ้งเตือน" },
  { path: "/chat", label: "แชท" },
  { path: "/collections", label: "คอลเลกชัน" },
  { path: "/s/doi-studio", label: "สตูดิโอตัวอย่าง" },
] as const;

export default function ResearchPage() {
  const demo = isDemoMode();

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="คู่มือ UX Research"
        description={`คู่มือทดสอบ ${BRAND_NAME} สำหรับ UX/UI researcher — บัญชี demo, ภารกิจ, และแผนที่หน้า`}
        path="/research"
      />

      <header className="border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้าแรก
          </Link>
          <span className="text-xs font-medium text-primary uppercase tracking-wider">UX Research</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10 thai-body">
        <section className="space-y-3">
          <p className="text-xs font-medium text-primary tracking-wide uppercase">Research brief</p>
          <h1 className="text-3xl font-semibold thai-display tracking-tight">
            {BRAND_NAME} — คู่มือทดสอบ UX/UI
          </h1>
          <p className="text-muted-foreground leading-relaxed">{BRAND_TAGLINE}</p>
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/8 p-4 space-y-2">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-amber-600" />
            ข้อมูลบันทึกจริง — อ่านก่อนเริ่ม
          </h2>
          <ul className="text-sm text-foreground/85 space-y-1.5 list-disc pl-5">
            {DEMO_WARNING_BULLETS.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
            <li>
              ใช้บัญชี <code className="text-xs bg-muted px-1 rounded">*@demo.an1hem.app</code> เท่านั้น
            </li>
            {demo && (
              <li className="text-primary font-medium">โหมดทดสอบเปิดอยู่ — แถบด้านบนจะแสดงตลอด</li>
            )}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <LogIn className="w-4 h-4 text-primary" />
            บัญชีสำหรับทดสอบ
          </h2>
          <p className="text-sm text-muted-foreground">รหัสผ่านทุกบัญชี: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{DEMO_PASSWORD}</code></p>
          <div className="grid gap-3">
            {DEMO_RESEARCH_ACCOUNTS.map((acc) => (
              <div key={acc.email} className="rounded-xl border border-border p-4 space-y-1">
                <p className="font-medium text-sm">{acc.label}</p>
                <code className="text-xs text-primary break-all">{acc.email}</code>
                <p className="text-xs text-muted-foreground">{acc.note}</p>
              </div>
            ))}
          </div>
          <Button asChild className="rounded-full">
            <Link to="/auth">ไปหน้าเข้าสู่ระบบ</Link>
          </Button>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            ภารกิจที่แนะนำ (30–45 นาที)
          </h2>
          <div className="space-y-4">
            {TASKS.map((task) => (
              <article key={task.id} className="rounded-xl border border-border p-4 space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{task.id}</p>
                <h3 className="font-medium">{task.title}</h3>
                <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
                  {task.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="text-xs text-foreground/70">
                  <span className="font-medium text-foreground">สำเร็จเมื่อ:</span> {task.success}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" />
            แผนที่หน้าหลัก
          </h2>
          <ul className="text-sm space-y-2">
            {PAGES.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-3 border-b border-border/50 pb-2">
                <span>{p.label}</span>
                <Link to={p.path} className="text-primary text-xs hover:underline shrink-0">
                  {p.path}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl glass-panel p-4 space-y-2 text-sm">
          <h2 className="font-semibold">สิ่งที่อยากได้ feedback</h2>
          <ul className="text-muted-foreground space-y-1 list-disc pl-5">
            <li>ภาษาไทยอ่านง่ายไหม — คำศัพท์ tech/ฟรีแลนซ์</li>
            <li>คอนเซปต์ &quot;ทุกคนคือ 1 PX&quot; สื่อสารได้หรือยัง</li>
            <li>ลำดับขั้นตอนจ้างงาน / คอลแลป / โพสต์งาน</li>
            <li>ความแตกต่างหน้าร้าน (1PX) vs หลังบ้าน (So1o) เข้าใจไหม</li>
            <li>Mobile vs Desktop — จุดที่ใช้ยาก</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
