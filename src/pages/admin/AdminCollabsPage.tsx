import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string; sender_id: string; recipient_id: string; collab_types: string[];
  message: string; status: string; timeline: string | null; created_at: string;
}

export default function AdminCollabsPage() {
  const { data, isLoading } = useAdminList<Row>("collab_requests");
  const cols: Column<Row>[] = [
    { key: "from", header: "ผู้ส่ง", render: (r) => <span className="font-mono text-xs">{r.sender_id.slice(0, 8)}…</span> },
    { key: "to", header: "ผู้รับ", render: (r) => <span className="font-mono text-xs">{r.recipient_id.slice(0, 8)}…</span> },
    { key: "types", header: "ประเภท", render: (r) => (
      <div className="flex flex-wrap gap-1">{r.collab_types.slice(0, 3).map((t) => <StatusPill key={t} status={t} tone="muted" />)}</div>
    )},
    { key: "msg", header: "ข้อความ", render: (r) => <span className="text-xs text-admin-muted truncate block max-w-sm">{r.message}</span> },
    { key: "status", header: "สถานะ", render: (r) => <StatusPill status={r.status} tone={r.status === "pending" ? "accent" : "muted"} /> },
    { key: "created", header: "เมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="collabs" title="คำขอคอลแลป" description={`${data?.length ?? 0} คำขอ`} />
      <DataTable columns={cols} rows={data ?? []} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
