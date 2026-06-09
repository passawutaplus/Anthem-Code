import { useNavigate } from "react-router-dom";
import { LayoutGrid, Layers3, Coins, MessageCircle, Settings, LogOut, Plus, Building2, Flag, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { useSubscription } from "@/core/subscription";
import { SO1O_PRICING_URL } from "@/lib/productLinks";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";
import { supabase } from "@/integrations/supabase/client";
import { useMyStudios, useSetActiveStudio } from "@/hooks/useStudios";

const ProfileMenuCard = () => {
  const navigate = useNavigate();
  const { data: myStudios = [] } = useMyStudios();
  const setActive = useSetActiveStudio();
  const { isPro } = useSubscription();

  const item =
    "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground/85 hover:bg-foreground/5 hover:text-foreground transition-colors text-left";

  return (
    <nav
      aria-label="เมนูโปรไฟล์"
      className="rounded-3xl glass-panel p-3 space-y-0.5"
    >
      <button onClick={() => navigate("/portfolio")} className={item}>
        <LayoutGrid className="w-4 h-4 text-primary" /> โปรไฟล์ของฉัน
      </button>
      <button onClick={() => navigate("/collections")} className={item}>
        <Layers3 className="w-4 h-4 text-primary" /> คอลเลกชันของฉัน
      </button>
      <button onClick={() => navigate("/earnings")} className={item}>
        <Coins className="w-4 h-4 text-primary" /> รายได้ &amp; กระเป๋า Pixel
      </button>
      <button onClick={() => navigate("/chat")} className={item}>
        <MessageCircle className="w-4 h-4 text-primary" /> ข้อความ
      </button>
      <button onClick={() => navigate("/jobs")} className={item}>
        <BriefcaseIcon className="w-4 h-4 text-primary" /> งานจาก Studio
      </button>

      <div className="my-2 border-t border-border" />
      <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">Studio ของฉัน</p>

      {myStudios.length === 0 ? (
        <button onClick={() => navigate("/studio/new")} className={`${item} text-primary hover:text-primary`}>
          <Plus className="w-4 h-4" /> ก่อตั้ง Studio
        </button>
      ) : (
        <>
          {myStudios.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive.mutate(s.id); navigate("/studio/manage"); }}
              className={item}
            >
              <Building2 className="w-4 h-4 text-primary" /> {s.name}
            </button>
          ))}
          <button onClick={() => navigate("/studio/new")} className={`${item} text-muted-foreground`}>
            <Plus className="w-4 h-4" /> สร้าง Studio ใหม่
          </button>
        </>
      )}

      <div className="my-2 border-t border-border" />
      <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">การติดตามของฉัน</p>
      <button onClick={() => navigate("/me/reports")} className={item}>
        <Flag className="w-4 h-4 text-primary" /> รายงานของฉัน
      </button>
      <button onClick={() => navigate("/me/feedback")} className={item}>
        <MessageSquare className="w-4 h-4 text-primary" /> ฟีดแบ็กของฉัน
      </button>

      <div className="my-2 border-t border-border" />
      <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground">ระบบ So1o</p>
      {isPro ? (
        <p className="px-3 py-1.5 text-xs text-primary font-medium flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> So1o Pro — ใช้ได้ทั้ง 1PX และ My Desk
        </p>
      ) : (
        <a href={SO1O_PRICING_URL} target="_blank" rel="noopener noreferrer" className={item}>
          <Sparkles className="w-4 h-4 text-primary" /> สมัคร So1o Pro (หลังบ้าน + หน้าร้าน)
        </a>
      )}

      <div className="my-2 border-t border-border" />
      <button onClick={() => navigate("/verify")} className={item}>
        <ShieldCheck className="w-4 h-4 text-primary" /> ยืนยันตัวตน
      </button>
      <button onClick={() => navigate("/settings")} className={item}>
        <Settings className="w-4 h-4 text-primary" /> ตั้งค่า
      </button>
      <button
        onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
        className={`${item} text-destructive hover:text-destructive`}
      >
        <LogOut className="w-4 h-4" /> ออกจากระบบ
      </button>
    </nav>
  );
};

export default ProfileMenuCard;
