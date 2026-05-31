import { useState } from "react";
import { HandHeart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuthDialog } from "@/stores/authDialogStore";
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

  const handleOpen = () => {
    if (!user) { openAuth(); return; }
    setOpen(true);
  };

  const tooltipText = isOwn
    ? "นี่คือผลงานของคุณเอง — กดเพื่อพรีวิวการส่งของขวัญ"
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
