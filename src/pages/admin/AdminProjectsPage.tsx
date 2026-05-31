import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { SearchBar, useSearch } from "@/components/admin/SearchBar";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string; title: string; category: string; status: string;
  views: number; likes: number; created_at: string;
}

export default function AdminProjectsPage() {
  const { data, isLoading } = useAdminList<Row>("projects", "id,title,category,status,views,likes,created_at");
  const { q, setQ, filtered } = useSearch(data, ["title", "category"]);
  const cols: Column<Row>[] = [
    { key: "title", header: "ชื่อผลงาน", render: (r) => <span className="font-medium">{r.title}</span> },
    { key: "category", header: "หมวด", render: (r) => <StatusPill status={r.category} tone="muted" /> },
    { key: "status", header: "สถานะ", render: (r) => <StatusPill status={r.status} tone={r.status === "Published" ? "accent" : "muted"} /> },
    { key: "views", header: "Views", render: (r) => <span className="font-mono">{r.views}</span> },
    { key: "likes", header: "Likes", render: (r) => <span className="font-mono">{r.likes}</span> },
    { key: "created", header: "สร้างเมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="projects" title="ผลงาน" description={`${data?.length ?? 0} ผลงาน`} actions={<SearchBar value={q} onChange={setQ} />} />
      <DataTable columns={cols} rows={filtered} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
