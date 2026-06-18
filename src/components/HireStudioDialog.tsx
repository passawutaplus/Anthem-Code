import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { hireRequestSchema } from "@/lib/validators";
import { useAuth } from "@/hooks/useAuth";
import { useCreateStudioHireRequest } from "@/hooks/useHiringRequests";
import { supabase } from "@/integrations/supabase/client";
import { useAuthDialog } from "@/stores/authDialogStore";

interface HireStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioName: string;
  projectTitle?: string;
}

const HireStudioDialog = ({
  open,
  onOpenChange,
  studioId,
  studioName,
  projectTitle,
}: HireStudioDialogProps) => {
  const openAuth = useAuthDialog((s) => s.openSignup);
  const { user } = useAuth();
  const createReq = useCreateStudioHireRequest();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    budgetAmount: "",
    deadline: "",
    message: "",
  });

  const reset = () => {
    setForm({ clientName: "", email: "", phone: "", budgetAmount: "", deadline: "", message: "" });
    setSuccess(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info("กรุณาเข้าสู่ระบบก่อนส่งคำขอ");
      handleOpenChange(false);
      openAuth();
      return;
    }
    const budgetNum = form.budgetAmount ? Number(form.budgetAmount.replace(/[^\d]/g, "")) : undefined;
    const parsed = hireRequestSchema.safeParse({ ...form, budgetAmount: budgetNum });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "กรอกข้อมูลไม่ครบ");
      return;
    }
    try {
      const requestId = await createReq.mutateAsync({
        studio_id: studioId,
        client_id: user.id,
        project_title: projectTitle ?? studioName,
        client_name: parsed.data.clientName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        budget_amount: budgetNum ?? null,
        deadline: parsed.data.deadline || null,
        message: parsed.data.message || null,
      });
      void supabase.functions.invoke("notify-hire-request", {
        body: { request_id: requestId },
      });
      setSuccess(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ส่งไม่สำเร็จ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="py-4 space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-primary" />
            <DialogHeader className="text-center">
              <DialogTitle>ส่งคำขอจ้าง Studio แล้ว</DialogTitle>
              <DialogDescription className="text-left pt-2">
                ทีม {studioName} จะได้รับแจ้งเตือนและติดต่อกลับทางอีเมลที่คุณให้ไว้
              </DialogDescription>
            </DialogHeader>
            <Button className="w-full rounded-xl" onClick={() => handleOpenChange(false)}>
              ปิด
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>จ้าง Studio</DialogTitle>
              <DialogDescription>
                อ้างอิง: <span className="font-medium text-primary">{studioName}</span>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <Label>ชื่อผู้ติดต่อ *</Label>
                <Input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>อีเมล *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>เบอร์มือถือ</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>งบประมาณ (บาท)</Label>
                  <Input
                    inputMode="numeric"
                    value={form.budgetAmount}
                    onChange={(e) => setForm({ ...form, budgetAmount: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>รายละเอียด</Label>
                <Textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={createReq.isPending} className="w-full rounded-xl h-11">
                {createReq.isPending ? "กำลังส่ง..." : "ส่งคำขอจ้าง Studio"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HireStudioDialog;
