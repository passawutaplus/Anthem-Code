import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { useAdminList } from "@/hooks/admin/useAdminList";

interface Row {
  id: string; actor_id: string; action: string; target_type: string;
  target_id: string; created_at: string;
}

export default function AdminAuditPage() {
  const { data, isLoading } = useAdminList<Row>("admin_audit_log");
  const cols: Column<Row>[] = [
    { key: "at", header: "เวลา", render: (r) => <span className="font-mono text-xs">{r.created_at.slice(0, 19).replace("T", " ")}</span> },
    { key: "actor", header: "Actor", render: (r) => <span className="font-mono text-xs">{r.actor_id.slice(0, 8)}…</span> },
    { key: "action", header: "Action", render: (r) => <StatusPill status={r.action} tone="accent" /> },
    { key: "target", header: "Target", render: (r) => <span className="font-mono text-xs">{r.target_type}/{r.target_id.slice(0, 8)}…</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="audit" title="บันทึกการใช้งาน" description="ทุกการกระทำของแอดมินจะถูกบันทึก" />
      <DataTable columns={cols} rows={data ?? []} loading={isLoading} rowKey={(r) => r.id} empty="ยังไม่มีบันทึก" />
    </div>
  );
}
