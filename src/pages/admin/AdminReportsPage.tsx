import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SectionHeader from "@/components/admin/SectionHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import StatusPill from "@/components/admin/StatusPill";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Download } from "lucide-react";
import { toCsv, downloadCsv } from "@/lib/csv";
import { getLicenseMeta } from "@/lib/licenses";

type EvidenceFile = { url: string; type: string; name: string; size: number };
type ReportRow = {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  target_owner_id: string | null;
  reason: string;
  details: string;
  evidence_urls: string[];
  evidence_files: EvidenceFile[];
  status: "open" | "reviewing" | "resolved" | "dismissed";
  admin_note: string;
  created_at: string;
};

const STATUSES = ["open", "reviewing", "resolved", "dismissed"] as const;

const targetLink = (r: ReportRow) => {
  switch (r.target_type) {
    case "project":
      return `/project/${r.target_id}`;
    case "user":
      return `/u/${r.target_id}`;
    case "studio":
      return `/admin/studios`;
    default:
      return "#";
  }
};

export default function AdminReportsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof STATUSES)[number]>("open");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "reports", tab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_reports" as never)
        .select("*")
        .eq("status", tab)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      const reports = (data ?? []) as unknown as ReportRow[];
      const projectIds = [...new Set(
        reports.filter((r) => r.target_type === "project" && r.reason === "copyright").map((r) => r.target_id),
      )];
      if (!projectIds.length) return reports;
      const { data: projects } = await supabase
        .from("projects")
        .select("id, license_type, license_note, rights_attested_at")
        .in("id", projectIds);
      const licenseMap = new Map((projects ?? []).map((p) => [p.id, p]));
      return reports.map((r) => {
        if (r.target_type !== "project" || r.reason !== "copyright") return r;
        const lic = licenseMap.get(r.target_id);
        if (!lic) return r;
        const meta = getLicenseMeta(lic.license_type);
        const suffix = ` [ลิขสิทธิ์: ${meta.shortLabel}${lic.rights_attested_at ? "" : ", ไม่ยืนยันสิทธิ์"}]`;
        return { ...r, details: (r.details || "") + suffix };
      });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReportRow["status"] }) => {
      const patch: Record<string, unknown> = { status };
      if (status === "resolved" || status === "dismissed") {
        patch.resolved_by = user?.id ?? null;
        patch.resolved_at = new Date().toISOString();
      }
      const { error } = await supabase.from("user_reports" as never).update(patch as never).eq("id", id);
      if (error) throw error;
      if (user?.id) {
        await supabase.from("admin_audit_log").insert({
          actor_id: user.id,
          action: `report.${status}`,
          target_type: "user_report",
          target_id: id,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reports"] });
      toast.success("อัปเดตสถานะแล้ว");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "อัปเดตไม่สำเร็จ"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_reports" as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reports"] });
      toast.success("ลบรายงานแล้ว");
    },
  });

  const cols = useMemo<Column<ReportRow>[]>(
    () => [
      {
        key: "at",
        header: "เวลา",
        render: (r) => <span className="font-mono text-xs">{r.created_at.slice(0, 16).replace("T", " ")}</span>,
      },
      {
        key: "target",
        header: "เป้าหมาย",
        render: (r) => (
          <a href={targetLink(r)} target="_blank" rel="noreferrer" className="underline font-mono text-xs">
            {r.target_type}/{r.target_id.slice(0, 8)}…
          </a>
        ),
      },
      {
        key: "reason",
        header: "เหตุผล",
        render: (r) => <StatusPill status={r.reason} tone="accent" />,
      },
      {
        key: "details",
        header: "รายละเอียด",
        render: (r) => (
          <div className="space-y-1 max-w-md">
            <span className="text-xs line-clamp-2">{r.details || "—"}</span>
            {r.evidence_files?.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {r.evidence_files.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noreferrer" className="block">
                    {f.type.startsWith("image/") ? (
                      <img src={f.url} alt="" className="w-10 h-10 object-cover rounded border border-border" />
                    ) : (
                      <span className="text-[10px] underline">{f.name}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "reporter",
        header: "ผู้รายงาน",
        render: (r) => <span className="font-mono text-xs">{r.reporter_id.slice(0, 8)}…</span>,
      },
      {
        key: "actions",
        header: "จัดการ",
        render: (r) => (
          <div className="flex gap-1 flex-wrap">
            {r.status !== "reviewing" && (
              <Button size="sm" variant="outline" onClick={() => update.mutate({ id: r.id, status: "reviewing" })}>
                ตรวจสอบ
              </Button>
            )}
            {r.status !== "resolved" && (
              <Button size="sm" variant="default" onClick={() => update.mutate({ id: r.id, status: "resolved" })}>
                ดำเนินการแล้ว
              </Button>
            )}
            {r.status !== "dismissed" && (
              <Button size="sm" variant="ghost" onClick={() => update.mutate({ id: r.id, status: "dismissed" })}>
                ปัด
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => remove.mutate(r.id)}>
              ลบ
            </Button>
          </div>
        ),
      },
    ],
    [update, remove]
  );

  return (
    <div>
      <SectionHeader
        eyebrow="moderation"
        title="รายงานเนื้อหา"
        description="คำร้องเรียนจากผู้ใช้ — ตรวจสอบและดำเนินการตามนโยบายชุมชน"
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList>
          {STATUSES.map((s) => (
            <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex justify-end mb-2">
        <Button size="sm" variant="outline" onClick={() => {
          const csv = toCsv(rows.map((r) => ({
            created_at: r.created_at, status: r.status, target_type: r.target_type,
            target_id: r.target_id, reason: r.reason, details: r.details,
            reporter_id: r.reporter_id, admin_note: r.admin_note,
            evidence: (r.evidence_files ?? []).map((f) => f.url).join(" | "),
          })));
          downloadCsv(`reports-${tab}-${new Date().toISOString().slice(0,10)}.csv`, csv);
        }}>
          <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
        </Button>
      </div>
      <DataTable
        columns={cols}
        rows={rows}
        loading={isLoading}
        rowKey={(r) => r.id}
        empty={`ยังไม่มีรายงานสถานะ "${tab}"`}
      />
    </div>
  );
}
