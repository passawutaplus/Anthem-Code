import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFollowState } from "@/hooks/useFollow";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useAuthDialog } from "@/stores/authDialogStore";

interface Props {
  freelancerId?: string;
  size?: "sm" | "default";
  variant?: "full" | "compact";
}

const FollowButton = ({ freelancerId, size = "default", variant = "full" }: Props) => {
  const { user } = useAuth();
  const openAuth = useAuthDialog((s) => s.openSignup);
  const { isFollowing, isSelf, toggle, isPending, followers } = useFollowState(freelancerId);

  if (!freelancerId || isSelf) return null;

  const handle = () => {
    if (!user) {
      toast.info("กรุณาเข้าสู่ระบบก่อนติดตาม");
      openAuth();
      return;
    }
    toggle();
  };

  return (
    <Button
      onClick={handle}
      disabled={isPending}
      size={size}
      variant={isFollowing ? "outline" : "default"}
      className={`rounded-full ${isFollowing ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
    >
      {isFollowing ? <UserCheck className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
      {isFollowing ? "กำลังติดตาม" : "ติดตาม"}
      {variant === "full" && <span className="ml-1 opacity-70">· {followers}</span>}
    </Button>
  );
};

export default FollowButton;
