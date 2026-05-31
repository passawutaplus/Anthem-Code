import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/hooks/useAuth";
import TopUpDialog from "./TopUpDialog";

const WalletBadge = () => {
  const { user } = useAuth();
  const { data: wallet } = useWallet();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="กระเป๋า Pixel"
        className="hidden sm:inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full glass-chip hover:shadow-md hover:shadow-primary/20 transition-all group"
      >
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground tabular-nums">
          {(wallet?.balance_px ?? 0).toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground">px</span>
        <span className="ml-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="w-3 h-3" />
        </span>
      </button>
      <TopUpDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default WalletBadge;
