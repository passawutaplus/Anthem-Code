import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicStudios } from "@/hooks/usePublicStudios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthDialog } from "@/stores/authDialogStore";
import StudioCard from "./StudioCard";

interface Props {
  search?: string;
}

const StudioGrid = ({ search = "" }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data = [], isLoading } = usePublicStudios();
  const q = search.trim().toLowerCase();
  const filtered = q ? data.filter((d) => d.searchHaystack.includes(q)) : data;

  const handleCreate = () => {
    if (user) navigate("/studio/new");
    else useAuthDialog.getState().openSignup();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl glass-panel animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium thai-display">รวมตัวกันตั้ง Studio</p>
          <p className="text-xs text-muted-foreground thai-body">
            ชวนเพื่อน designer ก่อตั้ง studio รับงานใหญ่ในนามทีม
          </p>
        </div>
        <Button onClick={handleCreate} className="rounded-full bg-gradient-brand text-white border-0">
          <Plus className="w-4 h-4 mr-1" /> สร้าง Studio
        </Button>
      </div>

      {!filtered.length ? (
        <div className="text-center py-12 text-muted-foreground glass-panel rounded-2xl">
          <p className="text-lg">
            {q ? `ไม่พบสตูดิโอสำหรับ "${search}"` : "ยังไม่มีสตูดิโอในระบบ"}
          </p>
          {!q && (
            <p className="text-sm mt-2">เป็นคนแรกที่ก่อตั้ง studio บนแพลตฟอร์ม</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filtered.map((d) => <StudioCard key={d.studio.id} data={d} />)}
        </div>
      )}
    </div>
  );
};

export default StudioGrid;
