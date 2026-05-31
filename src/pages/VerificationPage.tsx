import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useMyKycRequests, useSubmitKyc } from "@/hooks/useKyc";

const VerificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: requests = [] } = useMyKycRequests();
  const submit = useSubmitKyc();
  const [note, setNote] = useState("");

  const isVerified = (profile as any)?.is_verified;
  const pending = requests.find((r) => r.status === "pending");

  const handleSubmit = () => {
    submit.mutate(note, {
      onSuccess: () => { toast.success("ส่งคำขอแล้ว แอดมินจะติดต่อกลับ"); setNote(""); },
      onError: (e: Error) => toast.error(e.message),
    });
  };

  return (
    <div className="min-h-screen bg-app-ambient">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <span className="ml-auto text-sm font-medium">ยืนยันตัวตน</span>
          <span className="w-12" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="rounded-2xl glass-panel p-6 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isVerified ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="mt-3 text-xl font-semibold">
            {isVerified ? "บัญชีของคุณยืนยันตัวตนแล้ว" : "ยืนยันตัวตนเพื่อปลดล็อกฟีเจอร์"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isVerified
              ? "คุณสามารถส่งของขวัญสูงสุด 5,000 px/วัน และถอนเงินได้"
              : "เพดานส่งของขวัญ 500 px/วัน · ถอนเงินไม่ได้จนกว่าจะยืนยัน"}
          </p>
        </div>

        {!isVerified && !pending && (
          <div className="rounded-2xl glass-panel p-6 space-y-3">
            <h2 className="font-medium">ขอยืนยันตัวตน</h2>
            <p className="text-xs text-muted-foreground">แอดมินจะติดต่อกลับเพื่อขอเอกสาร (บัตรประชาชน) ผ่านช่องทางที่คุณระบุ</p>
            <Textarea
              placeholder="ช่องทางติดต่อ (LINE / เบอร์ / อีเมล) + ข้อมูลเพิ่มเติม"
              value={note}
              maxLength={500}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleSubmit} disabled={submit.isPending} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              ส่งคำขอ
            </Button>
          </div>
        )}

        {pending && (
          <div className="rounded-2xl glass-panel p-5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium">คำขอของคุณกำลังรอตรวจสอบ</p>
              <p className="text-xs text-muted-foreground">ส่งเมื่อ {new Date(pending.submitted_at).toLocaleString("th-TH")}</p>
            </div>
          </div>
        )}

        {requests.length > 0 && (
          <div className="rounded-2xl glass-panel p-5">
            <h3 className="text-sm font-medium mb-3">ประวัติคำขอ</h3>
            <div className="space-y-2">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40">
                  <span className="flex items-center gap-1.5">
                    {r.status === "approved" ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      : r.status === "rejected" ? <XCircle className="w-3.5 h-3.5 text-destructive" />
                      : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                    {r.status === "approved" ? "อนุมัติ" : r.status === "rejected" ? "ปฏิเสธ" : "รอตรวจ"}
                  </span>
                  <span className="text-muted-foreground">{new Date(r.submitted_at).toLocaleDateString("th-TH")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
