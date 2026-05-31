import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { SearchBar, useSearch } from "@/components/admin/SearchBar";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string; title: string; role_category: string; status: string; location_type: string;
  budget_min: number | null; budget_max: number | null; applicants_count: number; created_at: string;
}

export default function AdminJobsPage() {
  const { data, isLoading } = useAdminList<Row>("job_posts");
  const { q, setQ, filtered } = useSearch(data, ["title", "role_category"]);
  const cols: Column<Row>[] = [
    { key: "title", header: "ตำแหน่ง", render: (r) => (
      <div><p className="font-medium">{r.title}</p><p className="text-xs text-admin-muted">{r.role_category}</p></div>
    )},
    { key: "status", header: "สถานะ", render: (r) => <StatusPill status={r.status} tone={r.status === "open" ? "accent" : "muted"} /> },
    { key: "loc", header: "Location", render: (r) => <StatusPill status={r.location_type} tone="muted" /> },
    { key: "budget", header: "งบ (THB)", render: (r) => <span className="font-mono text-xs">{r.budget_min?.toLocaleString() ?? "—"} – {r.budget_max?.toLocaleString() ?? "—"}</span> },
    { key: "apps", header: "ผู้สมัคร", render: (r) => <span className="font-mono">{r.applicants_count}</span> },
    { key: "created", header: "ลงเมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="jobs" title="ประกาศงาน" description={`${data?.length ?? 0} ประกาศ`} actions={<SearchBar value={q} onChange={setQ} />} />
      <DataTable columns={cols} rows={filtered} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
