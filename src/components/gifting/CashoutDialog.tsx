import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banknote } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useRequestCashout, PLATFORM_FEE_RATE, MIN_CASHOUT_PX } from "@/hooks/useCashout";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const CashoutDialog = ({ open, onOpenChange }: Props) => {
  const { data: wallet } = useWallet();
  const cashout = useRequestCashout();
  const earnedBalance = wallet?.earned_px ?? 0;
  const [amount, setAmount] = useState<string>("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const amountNum = parseInt(amount, 10) || 0;
  const fee = useMemo(() => Math.floor(amountNum * PLATFORM_FEE_RATE), [amountNum]);
  const net = amountNum - fee;
  const canSubmit =
    amountNum >= MIN_CASHOUT_PX &&
    amountNum <= earnedBalance &&
    bank.trim() &&
    accountNumber.trim() &&
    accountName.trim();

  const handleSubmit = () => {
    cashout.mutate(
      { amountPx: amountNum, bank: bank.trim(), accountNumber: accountNumber.trim(), accountName: accountName.trim() },
      {
        onSuccess: () => {
          toast.success(`ส่งคำขอถอน ${amountNum.toLocaleString()} px แล้ว`, {
            description: `อยู่ในคิวดำเนินการ — สุทธิประมาณ ฿ ${net.toLocaleString()} หลังหักค่าธรรมเนียม 15%`,
          });
          onOpenChange(false);
          setAmount("");
        },
        onError: (e: Error) => toast.error(e.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" /> ถอน Pixel เข้าบัญชี
          </DialogTitle>
          <DialogDescription>
            ยอดถอนได้ (จากของขวัญ) <span className="text-primary font-semibold">{earnedBalance.toLocaleString()} px</span> · ขั้นต่ำ {MIN_CASHOUT_PX.toLocaleString()} px · ค่าธรรมเนียม {PLATFORM_FEE_RATE * 100}%
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">จำนวน (px)</label>
            <Input
              type="number"
              min={MIN_CASHOUT_PX}
              max={earnedBalance}
              placeholder={`อย่างน้อย ${MIN_CASHOUT_PX}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              onClick={() => setAmount(String(earnedBalance))}
              className="text-[11px] text-primary hover:underline"
            >
              ใช้ยอดทั้งหมด ({earnedBalance.toLocaleString()} px)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">ธนาคาร</label>
              <Input placeholder="เช่น กสิกรไทย" value={bank} onChange={(e) => setBank(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">เลขบัญชี</label>
              <Input placeholder="xxx-x-xxxxx-x" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">ชื่อบัญชี</label>
            <Input placeholder="ชื่อ-นามสกุล" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          </div>

          <div className="rounded-xl bg-muted/50 p-3 space-y-1 text-sm">
            <Row label="ยอดถอน" value={`${amountNum.toLocaleString()} px`} />
            <Row label={`ค่าธรรมเนียม (${PLATFORM_FEE_RATE * 100}%)`} value={`−${fee.toLocaleString()} px`} muted />
            <div className="border-t border-border my-1" />
            <Row label="จะได้รับสุทธิ" value={`฿ ${Math.max(net, 0).toLocaleString()}`} bold />
          </div>

          <div className="text-[11px] text-muted-foreground bg-muted/50 rounded-lg p-2 leading-relaxed space-y-1">
            <p>คำขอจะเข้าคิว <span className="font-medium text-foreground">รอดำเนินการ</span> — ทีมงานจะโอนเมื่อระบบชำระเงินเปิดใช้งาน</p>
            <p>ต้องยืนยันตัวตน (KYC) ก่อนถอน — ดูที่หน้า <Link to="/verify" className="text-primary underline">ยืนยันตัวตน</Link></p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || cashout.isPending}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            ส่งคำขอถอน
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className={`${muted ? "text-muted-foreground" : "text-foreground/80"} text-xs`}>{label}</span>
    <span className={`tabular-nums ${bold ? "font-semibold text-primary" : "text-foreground"}`}>{value}</span>
  </div>
);

export default CashoutDialog;
