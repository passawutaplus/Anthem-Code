import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { SearchBar, useSearch } from "@/components/admin/SearchBar";
import AdminRowActions from "@/components/admin/AdminRowActions";
import AdminExportButton from "@/components/admin/AdminExportButton";
import { useAdminList } from "@/hooks/admin/useAdminList";
import { useAdminSetUserRole } from "@/hooks/admin/useAdminMutations";
import { useFreezeAccount, useUnfreezeAccount } from "@/hooks/useAmlFlags";
import { supabase } from "@/integrations/supabase/client";
import { formatThaiDate } from "@/lib/format";

interface Row {
  id: string;
  display_name: string;
  username: string | null;
  email: string | null;
  role: string | null;
  location: string | null;
  account_status: string | null;
  is_verified: boolean | null;
  risk_score: number | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminList<Row>(
    "profiles",
    "id,display_name,username,email,role,location,account_status,is_verified,risk_score,created_at",
  );
  const { q, setQ, filtered } = useSearch(data, ["display_name", "username", "email", "role", "account_status"]);
  const setRole = useAdminSetUserRole();
  const freeze = useFreezeAccount();
  const unfreeze = useUnfreezeAccount();

  const { data: adminIds = [] } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data: rows, error } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
      if (error) throw error;
      return (rows ?? []).map((r) => r.user_id as string);
    },
  });
  const adminSet = new Set(adminIds);

  const cols: Column<Row>[] = [
    {
      key: "user",
      header: "ผู้ใช้",
      render: (r) => (
        <div>
          <p className="font-medium">{r.display_name || "—"}</p>
          <p className="text-xs text-admin-muted">@{r.username || "—"}</p>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (r) => <span className="font-mono text-xs">{r.email || "—"}</span> },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.account_status && r.account_status !== "active" && (
            <StatusPill status={r.account_status} tone="accent" />
          )}
          {r.is_verified && <StatusPill status="verified" tone="muted" />}
          {adminSet.has(r.id) && <StatusPill status="admin" tone="accent" />}
        </div>
      ),
    },
    { key: "role", header: "Role", render: (r) => (r.role ? <StatusPill status={r.role} tone="muted" /> : "—") },
    { key: "risk", header: "Risk", render: (r) => <span className="font-mono text-xs">{r.risk_score ?? 0}</span> },
    { key: "joined", header: "สมัครเมื่อ", render: (r) => <span className="font-mono text-xs">{formatThaiDate(r.created_at)}</span> },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (r) => {
        const isAdmin = adminSet.has(r.id);
        const frozen = r.account_status === "frozen" || r.account_status === "under_review";
        return (
          <AdminRowActions
            actions={[
              { label: "ดูโปรไฟล์", href: `/u/${r.id}` },
              {
                label: isAdmin ? "ถอดสิทธิ์ admin" : "ตั้งเป็น admin",
                onClick: () =>
                  setRole.mutate(
                    { userId: r.id, role: "admin", grant: !isAdmin },
                    {
                      onSuccess: () => toast.success(isAdmin ? "ถอดสิทธิ์ admin แล้ว" : "ตั้งเป็น admin แล้ว"),
                      onError: (e: Error) => toast.error(e.message),
                    },
                  ),
              },
              frozen
                ? {
                    label: "ปลดระงับบัญชี",
                    onClick: () =>
                      unfreeze.mutate(r.id, {
                        onSuccess: () => toast.success("ปลดระงับแล้ว"),
                        onError: (e: Error) => toast.error(e.message),
                      }),
                  }
                : {
                    label: "ระงับบัญชี",
                    onClick: () => {
                      const reason = window.prompt("เหตุผลการระงับ:");
                      if (!reason?.trim()) return;
                      freeze.mutate(
                        { userId: r.id, reason: reason.trim() },
                        {
                          onSuccess: () => toast.success("ระงับบัญชีแล้ว"),
                          onError: (e: Error) => toast.error(e.message),
                        },
                      );
                    },
                  },
            ]}
          />
        );
      },
    },
  ];

  const exportRows = (filtered ?? []).map((r) => ({
    id: r.id,
    display_name: r.display_name,
    username: r.username,
    email: r.email,
    account_status: r.account_status,
    is_admin: adminSet.has(r.id),
    risk_score: r.risk_score,
    created_at: r.created_at,
  }));

  return (
    <div>
      <SectionHeader
        eyebrow="users"
        title="ผู้ใช้ทั้งหมด"
        description={`${data?.length ?? 0} บัญชี (สูงสุด 200 รายการล่าสุด)`}
        actions={
          <div className="flex items-center gap-2">
            <AdminExportButton rows={exportRows} filename="admin-users.csv" />
            <SearchBar value={q} onChange={setQ} />
          </div>
        }
      />
      <DataTable columns={cols} rows={filtered} loading={isLoading} rowKey={(r) => r.id} />
    </div>
  );
}
