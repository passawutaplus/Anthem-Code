import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface FeedHeaderProps {
  onMyPortClick: () => void;
}

const FeedHeader = ({ onMyPortClick: _ }: FeedHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-20 glass-panel border-x-0 border-t-0 rounded-none">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-sm">
            <span className="text-white font-medium text-xs leading-none">a1h</span>
          </div>
          <h1 className="font-medium text-lg leading-tight">
            <span className="text-gradient">an1hem</span>
          </h1>
        </button>

        {!user && (
          <Button
            onClick={() => navigate("/auth")}
            size="sm"
            variant="ghost"
            className="rounded-full text-foreground/80 hover:text-foreground"
          >
            <LogIn className="w-4 h-4 mr-1" /> เข้าสู่ระบบ
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeedHeader;
