import SectionHeader from "@/components/admin/SectionHeader";
import { useAdminStats } from "@/hooks/admin/useAdminData";
import { Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  const { data } = useAdminStats();
  return (
    <div>
      <SectionHeader eyebrow="notifications" title="แจ้งเตือน" description="สรุปกิจกรรมที่ต้องให้ผู้ใช้ทราบ" />
      <div className="border border-admin-border bg-admin-surface p-6 rounded-sm">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-4 h-4 text-admin-accent" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-admin-muted">SOURCES</p>
        </div>
        <ul className="text-sm space-y-2">
          <li className="flex justify-between border-b border-admin-border pb-2"><span>คำขอจ้างงาน (รอตอบ)</span><span className="font-mono">{data?.pendingHiring ?? "—"}</span></li>
          <li className="flex justify-between border-b border-admin-border pb-2"><span>ผู้สมัครงาน (24h)</span><span className="font-mono text-admin-muted">—</span></li>
          <li className="flex justify-between border-b border-admin-border pb-2"><span>ข้อความใหม่ (24h)</span><span className="font-mono">{data?.messages24h ?? "—"}</span></li>
          <li className="flex justify-between"><span>ผู้สมัครใหม่ (24h)</span><span className="font-mono">{data?.newUsers24h ?? "—"}</span></li>
        </ul>
      </div>
    </div>
  );
}
