import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { SearchBar, useSearch } from "@/components/admin/SearchBar";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string; display_name: string; username: string | null; email: string | null;
  role: string | null; location: string | null; created_at: string;
}

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminList<Row>("profiles", "id,display_name,username,email,role,location,created_at");
  const { q, setQ, filtered } = useSearch(data, ["display_name", "username", "email", "role"]);

  const cols: Column<Row>[] = [
    { key: "user", header: "ผู้ใช้", render: (r) => (
      <div>
        <p className="font-medium">{r.display_name || "—"}</p>
        <p className="text-xs text-admin-muted">@{r.username || "—"}</p>
      </div>
    )},
    { key: "email", header: "Email", render: (r) => <span className="font-mono text-xs">{r.email || "—"}</span> },
    { key: "role", header: "Role", render: (r) => r.role ? <StatusPill status={r.role} tone="muted" /> : "—" },
    { key: "location", header: "ที่อยู่", render: (r) => r.location || "—" },
    { key: "joined", header: "สมัครเมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="users"
        title="ผู้ใช้ทั้งหมด"
        description={`${data?.length ?? 0} บัญชี`}
        actions={<SearchBar value={q} onChange={setQ} />}
      />
      <DataTable columns={cols} rows={filtered} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
