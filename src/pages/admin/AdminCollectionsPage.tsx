import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { SearchBar, useSearch } from "@/components/admin/SearchBar";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string; name: string; category: string; owner_id: string;
  is_public: boolean; item_count: number; created_at: string;
}

export default function AdminCollectionsPage() {
  const { data, isLoading } = useAdminList<Row>("collections");
  const { q, setQ, filtered } = useSearch(data, ["name", "category"]);
  const cols: Column<Row>[] = [
    { key: "name", header: "ชื่อ", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "cat", header: "หมวด", render: (r) => r.category ? <StatusPill status={r.category} tone="muted" /> : "—" },
    { key: "items", header: "Items", render: (r) => <span className="font-mono">{r.item_count}</span> },
    { key: "pub", header: "Visibility", render: (r) => <StatusPill status={r.is_public ? "PUBLIC" : "PRIVATE"} tone={r.is_public ? "accent" : "muted"} /> },
    { key: "owner", header: "Owner", render: (r) => <span className="font-mono text-xs">{r.owner_id.slice(0, 8)}…</span> },
    { key: "at", header: "สร้างเมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="collections" title="คอลเลกชัน" description={`${data?.length ?? 0} ชุด`} actions={<SearchBar value={q} onChange={setQ} />} />
      <DataTable columns={cols} rows={filtered} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
