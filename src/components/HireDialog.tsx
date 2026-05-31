import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { hireRequestSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { useCreateHireRequest } from "@/hooks/useHiringRequests";
import { useAuthDialog } from "@/stores/authDialogStore";

interface HireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle?: string;
  projectId?: string;
  freelancerId?: string;
}

const HireDialog = ({ open, onOpenChange, projectTitle, projectId, freelancerId }: HireDialogProps) => {
  const openAuth = useAuthDialog((s) => s.openSignup);
  const { user } = useAuth();
  const createReq = useCreateHireRequest();

  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    budgetAmount: "",
    deadline: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("กรุณาเข้าสู่ระบบก่อนส่งคำขอ");
      onOpenChange(false);
      openAuth();
      return;
    }
    const budgetNum = form.budgetAmount ? Number(form.budgetAmount.replace(/[^\d]/g, "")) : undefined;
    const parsed = hireRequestSchema.safeParse({
      ...form,
      budgetAmount: budgetNum,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "กรอกข้อมูลไม่ครบ");
      return;
    }
    if (!freelancerId) {
      toast.error("ผลงานนี้ยังไม่มีเจ้าของในระบบ — ไม่สามารถส่งคำขอได้");
      return;
    }
    try {
      await createReq.mutateAsync({
        freelancer_id: freelancerId,
        client_id: user.id,
        project_id: projectId ?? null,
        project_title: projectTitle ?? "ผลงานในฟีด",
        client_name: parsed.data.clientName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        budget_amount: budgetNum ?? null,
        deadline: parsed.data.deadline || null,
        message: parsed.data.message || null,
      });
      toast.success("ส่งคำขอจ้างงานสำเร็จ!", { description: "ฟรีแลนซ์จะติดต่อกลับทางอีเมลที่คุณให้ไว้" });
      setForm({ clientName: "", email: "", phone: "", budgetAmount: "", deadline: "", message: "" });
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ส่งไม่สำเร็จ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ส่งคำขอจ้างงาน</DialogTitle>
          <DialogDescription>
            อ้างอิง: <span className="font-medium text-primary">{projectTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>ชื่อผู้ติดต่อ *</Label>
            <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="คุณสมชาย" required />
          </div>
          <div>
            <Label>อีเมล *</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div>
            <Label>เบอร์มือถือ (ไทย)</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812345678" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>งบประมาณ (บาท)</Label>
              <Input
                inputMode="numeric"
                value={form.budgetAmount}
                onChange={(e) => setForm({ ...form, budgetAmount: e.target.value })}
                placeholder="เช่น 15000"
              />
            </div>
            <div>
              <Label>Deadline</Label>
              <Input value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} placeholder="เช่น 2 สัปดาห์" />
            </div>
          </div>
          <div>
            <Label>รายละเอียด</Label>
            <Textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="อธิบายงานที่คุณต้องการ ขอบเขต การส่งมอบ (ทางเลือก)"
            />
          </div>
          <Button type="submit" disabled={createReq.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">
            {createReq.isPending ? "กำลังส่ง..." : "ส่งคำขอจ้างงาน"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HireDialog;
