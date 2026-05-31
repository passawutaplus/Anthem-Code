import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { SearchBar, useSearch } from "@/components/admin/SearchBar";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { formatThaiDate } from "@/lib/format";

interface Row { id: string; user_id: string; project_id: string; content: string; created_at: string }

export default function AdminCommentsPage() {
  const { data, isLoading } = useAdminList<Row>("project_comments");
  const { q, setQ, filtered } = useSearch(data, ["content"]);
  const cols: Column<Row>[] = [
    { key: "user", header: "ผู้ใช้", render: (r) => <span className="font-mono text-xs">{r.user_id.slice(0, 8)}…</span> },
    { key: "project", header: "ผลงาน", render: (r) => <span className="font-mono text-xs">{r.project_id.slice(0, 8)}…</span> },
    { key: "content", header: "ข้อความ", render: (r) => <span className="block max-w-2xl truncate">{r.content}</span> },
    { key: "at", header: "เมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
  ];
  return (
    <div>
      <SectionHeader eyebrow="comments" title="คอมเมนต์" description={`${data?.length ?? 0} ข้อความ`} actions={<SearchBar value={q} onChange={setQ} />} />
      <DataTable columns={cols} rows={filtered} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
