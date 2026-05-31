import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import SectionHeader from "@/components/admin/SectionHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAdminKycList, useAdminApproveKyc, useAdminRejectKyc } from "@/hooks/useKyc";
import { formatThaiDate } from "@/lib/format";

type Status = "pending" | "approved" | "rejected";

const Avatar = ({ url, name }: { url?: string | null; name?: string | null }) => (
  url ? <img src={url} alt="" className="w-7 h-7 rounded-full object-cover" />
      : <div className="w-7 h-7 rounded-full bg-admin-hover text-admin-muted flex items-center justify-center text-xs font-medium">{(name ?? "?")[0]}</div>
);

const STATUS_CLASS: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-600",
  approved: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-destructive/15 text-destructive",
};

export default function AdminKycPage() {
  const [tab, setTab] = useState<Status>("pending");
  const list = useAdminKycList(tab);
  const approve = useAdminApproveKyc();
  const reject = useAdminRejectKyc();

  const [reviewItem, setReviewItem] = useState<any | null>(null);
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"approve" | "reject">("approve");

  const handleSubmit = () => {
    if (!reviewItem) return;
    const fn = mode === "approve" ? approve : reject;
    fn.mutate({ id: reviewItem.id, note }, {
      onSuccess: () => {
        toast.success(mode === "approve" ? "ยืนยันตัวตนแล้ว" : "ปฏิเสธคำขอแล้ว");
        setReviewItem(null);
        setNote("");
      },
      onError: (e: Error) => toast.error(e.message),
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="security"
        title="KYC — ยืนยันตัวตนผู้ใช้"
        description="ตรวจสอบและอนุมัติคำขอยืนยันตัวตน เพื่อปลดล็อกการถอนเงินและเพดานการส่งของขวัญที่สูงขึ้น"
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as Status)}>
        <TabsList>
          <TabsTrigger value="pending">รอตรวจสอบ</TabsTrigger>
          <TabsTrigger value="approved">อนุมัติแล้ว</TabsTrigger>
          <TabsTrigger value="rejected">ถูกปฏิเสธ</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="border border-admin-border rounded-sm overflow-hidden bg-admin-surface">
            <table className="w-full text-sm">
              <thead className="bg-admin-hover/40 text-[11px] uppercase tracking-wider text-admin-muted">
                <tr>
                  <th className="text-left font-normal px-3 py-2">ผู้ใช้</th>
                  <th className="text-left font-normal px-3 py-2">ข้อความ</th>
                  <th className="text-left font-normal px-3 py-2">สถานะ</th>
                  <th className="text-right font-normal px-3 py-2">ส่งเมื่อ</th>
                  <th className="text-right font-normal px-3 py-2">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {(list.data ?? []).map((r: any) => (
                  <tr key={r.id} className="hover:bg-admin-hover/30">
                    <td className="px-3 py-2">
                      <Link to={`/u/${r.user_id}`} target="_blank" className="flex items-center gap-2 hover:text-admin-accent">
                        <Avatar url={r.profile?.avatar_url} name={r.profile?.display_name} />
                        <div>
                          <p className="text-sm">{r.profile?.display_name ?? r.user_id.slice(0, 8)}</p>
                          <p className="text-[11px] text-admin-muted">{r.profile?.email ?? "—"}</p>
                        </div>
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-xs text-admin-muted max-w-[320px] truncate" title={r.contact_note}>
                      {r.contact_note || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge className={`${STATUS_CLASS[r.status as Status]} border-0 text-[10px]`}>{r.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-xs text-admin-muted text-right whitespace-nowrap">{formatThaiDate(r.submitted_at)}</td>
                    <td className="px-3 py-2 text-right space-x-1">
                      {r.status === "pending" ? (
                        <>
                          <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-600"
                            onClick={() => { setReviewItem(r); setMode("approve"); setNote(""); }}>
                            <ShieldCheck className="w-3 h-3 mr-1" /> อนุมัติ
                          </Button>
                          <Button size="sm" variant="outline" className="border-destructive text-destructive"
                            onClick={() => { setReviewItem(r); setMode("reject"); setNote(""); }}>
                            ปฏิเสธ
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-admin-muted">{r.admin_note || "—"}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(list.data ?? []).length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-admin-muted text-sm">ไม่มีรายการ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!reviewItem} onOpenChange={(o) => !o && setReviewItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "approve" ? "อนุมัติ KYC" : "ปฏิเสธ KYC"}: {reviewItem?.profile?.display_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">ข้อความจากผู้ใช้:</p>
            <p className="text-sm bg-muted/40 rounded p-3 whitespace-pre-wrap">{reviewItem?.contact_note || "—"}</p>
            <Textarea
              placeholder={mode === "approve" ? "บันทึก (ทางเลือก)" : "เหตุผลในการปฏิเสธ"}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewItem(null)}>ยกเลิก</Button>
            <Button
              variant={mode === "approve" ? "default" : "destructive"}
              onClick={handleSubmit}
              disabled={approve.isPending || reject.isPending}
            >
              {mode === "approve" ? "ยืนยันอนุมัติ" : "ยืนยันปฏิเสธ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
