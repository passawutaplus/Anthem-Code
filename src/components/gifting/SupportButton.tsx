import { useState } from "react";
import { HandHeart, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthDialog } from "@/stores/authDialogStore";
import { useCreatorEligibility } from "@/hooks/useCreatorEligibility";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DonationModal from "./DonationModal";

interface Props {
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  projectId?: string | null;
  variant?: "default" | "outline" | "compact";
  className?: string;
}

const SupportButton = ({
  recipientId, recipientName, recipientAvatar, projectId, variant = "outline", className,
}: Props) => {
  const { user } = useAuth();
  const openAuth = useAuthDialog((s) => s.openLogin);
  const [open, setOpen] = useState(false);
  const isOwn = !!user && user.id === recipientId;
  const { data: eligibility } = useCreatorEligibility(isOwn ? undefined : recipientId);
  const canReceive = isOwn || eligibility?.canReceiveGifts === true;

  const handleOpen = () => {
    if (!user) { openAuth(); return; }
    if (!canReceive) return;
    setOpen(true);
  };

  const tooltipText = isOwn
    ? "นี่คือผลงานของคุณเอง — กดเพื่อพรีวิวการส่งของขวัญ"
    : !canReceive
      ? `${recipientName} กำลังเตรียมรับการสนับสนุน`
      : `ส่ง Pixel เป็นกำลังใจให้ ${recipientName}`;

  const wrapTooltip = (node: React.ReactNode) => (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (variant === "compact") {
    if (!isOwn && !canReceive) {
      return wrapTooltip(
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full glass-chip text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5" /> เร็วๆ นี้
        </span>,
      );
    }
    return (
      <>
        {wrapTooltip(
          <button
            onClick={handleOpen}
            aria-label={tooltipText}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full glass-chip text-xs font-medium text-primary hover:shadow-md hover:shadow-primary/20 transition ${className ?? ""}`}
          >
            {isOwn ? <Eye className="w-3.5 h-3.5" /> : <HandHeart className="w-3.5 h-3.5" />}
            {isOwn ? "พรีวิว" : "สนับสนุน"}
          </button>
        )}
        <DonationModal
          open={open}
          onOpenChange={setOpen}
          recipientId={recipientId}
          recipientName={recipientName}
          recipientAvatar={recipientAvatar}
          projectId={projectId}
          previewOnly={isOwn}
        />
      </>
    );
  }

  if (!isOwn && !canReceive) {
    return wrapTooltip(
      <Button
        disabled
        size="lg"
        variant="outline"
        className={`w-full rounded-full border-border text-muted-foreground ${className ?? ""}`}
      >
        <Lock className="w-4 h-4 mr-1.5" /> กำลังเตรียมรับการสนับสนุน
      </Button>,
    );
  }

  return (
    <>
      {wrapTooltip(
        <Button
          onClick={handleOpen}
          size="lg"
          variant={variant === "outline" ? "outline" : "default"}
          aria-label={tooltipText}
          className={
            variant === "outline"
              ? `w-full rounded-full border-primary/30 text-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/50 ${className ?? ""}`
              : `w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 ${className ?? ""}`
          }
        >
          {isOwn ? (
            <><Eye className="w-4 h-4 mr-1.5 text-primary" /> พรีวิวการส่งของขวัญ</>
          ) : (
            <><HandHeart className="w-4 h-4 mr-1.5 text-primary" /> สนับสนุน</>
          )}
        </Button>
      )}
      <DonationModal
        open={open}
        onOpenChange={setOpen}
        recipientId={recipientId}
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
        projectId={projectId}
        previewOnly={isOwn}
      />
    </>
  );
};

export default SupportButton;
