import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Zap } from "lucide-react";
import { useTopUp, useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const PRESETS = [100, 300, 500, 1000];
const MAX_TOPUP = 100_000;

const TopUpDialog = ({ open, onOpenChange }: Props) => {
  const { data: wallet } = useWallet();
  const topup = useTopUp();
  const [amount, setAmount] = useState<number>(300);
  const [custom, setCustom] = useState("");

  const finalAmount = custom ? parseInt(custom, 10) || 0 : amount;

  const handleConfirm = () => {
    if (finalAmount <= 0) {
      toast.error("กรุณาใส่จำนวน px");
      return;
    }
    if (finalAmount > MAX_TOPUP) {
      toast.error(`เติมได้สูงสุด ${MAX_TOPUP.toLocaleString()} px ต่อครั้ง`);
      return;
    }
    topup.mutate(finalAmount, {
      onSuccess: () => {
        toast.success(`เติม Pixel สำเร็จ +${finalAmount} px`, {
          description: "ยอดที่เติมจะใช้ส่งของขวัญได้หลัง 24 ชั่วโมง (ช่วงพักตรวจสอบ AML)",
        });
        onOpenChange(false);
        setCustom("");
      },
      onError: (e: Error) => toast.error(e.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> เติม Pixel
          </DialogTitle>
          <DialogDescription>
            ยอดปัจจุบัน <span className="text-primary font-semibold">{wallet?.balance_px ?? 0} px</span> · 1 px = 1 บาท
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {PRESETS.map((p) => {
            const active = !custom && amount === p;
            return (
              <button
                key={p}
                onClick={() => {
                  setAmount(p);
                  setCustom("");
                }}
                className={`rounded-xl border p-3 text-left transition ${
                  active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <p className="text-lg font-semibold text-foreground">{p} <span className="text-xs text-muted-foreground">px</span></p>
                <p className="text-xs text-muted-foreground">฿ {p.toLocaleString()}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">หรือระบุจำนวนเอง (px)</label>
          <Input
            type="number"
            min={1}
            placeholder="เช่น 250"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>

        <div className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg p-2 leading-relaxed space-y-1">
          <p>⏳ <span className="font-medium text-foreground">ช่วงพัก 24 ชั่วโมง:</span> เพื่อความปลอดภัย ยอดที่เติมต้องรอ 24 ชม. จึงจะนำไปส่งของขวัญได้</p>
          <p>🛡️ เพดานเติมต่อครั้ง: {MAX_TOPUP.toLocaleString()} px · โหมดทดสอบ ไม่มีการตัดเงินจริง</p>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={topup.isPending || finalAmount <= 0}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
        >
          <Zap className="w-4 h-4 mr-1.5" />
          เติม {finalAmount > 0 ? `${finalAmount} px` : ""}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;
