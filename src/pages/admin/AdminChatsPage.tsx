import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string; kind: string; project_title: string; client_id: string;
  freelancer_id: string; created_at: string; last_message_at: string;
}

export default function AdminChatsPage() {
  const { data, isLoading } = useAdminList<Row>("conversations", "*", "last_message_at");
  const cols: Column<Row>[] = [
    { key: "kind", header: "ประเภท", render: (r) => <StatusPill status={r.kind} tone={r.kind === "hire" ? "accent" : "muted"} /> },
    { key: "title", header: "หัวข้อ", render: (r) => <span className="font-medium">{r.project_title || "—"}</span> },
    { key: "client", header: "Client", render: (r) => <span className="font-mono text-xs">{r.client_id.slice(0, 8)}…</span> },
    { key: "free", header: "Freelancer", render: (r) => <span className="font-mono text-xs">{r.freelancer_id.slice(0, 8)}…</span> },
    { key: "last", header: "ล่าสุด", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.last_message_at)}</span> },
    { key: "created", header: "เริ่ม", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="chats" title="ห้องสนทนา" description={`${data?.length ?? 0} ห้อง`} />
      <DataTable columns={cols} rows={data ?? []} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
