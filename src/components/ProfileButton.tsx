import BriefcaseIcon from "./icons/BriefcaseIcon";
import { useEffect, useState } from "react";
import { ChevronDown, User, LogOut, Settings, LayoutGrid, MessageCircle, Layers3, Bell, Building2, Plus, Coins } from "lucide-react";
import WalletBadge from "@/components/gifting/WalletBadge";
import NotificationBell from "@/components/notifications/NotificationBell";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useMyStudios, useSetActiveStudio } from "@/hooks/useStudios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
const ProfileButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: myStudios = [] } = useMyStudios();
  const setActive = useSetActiveStudio();
  const [profile, setProfile] = useState<{ avatar_url: string | null; display_name: string | null } | null>(null);
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    supabase
      .from("profiles")
      .select("avatar_url, display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data ?? null));
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate("/jobs")}
          aria-label="งานจาก Studio"
          title="งานจาก Studio"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <BriefcaseIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/auth?redirect=/chat")}
          aria-label="ข้อความ"
          title="ข้อความ"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/auth?redirect=/notifications")}
          aria-label="แจ้งเตือน"
          className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
        <Button
          onClick={() => navigate("/auth")}
          size="sm"
          className="rounded-full bg-gradient-brand text-white hover:opacity-90 hidden sm:inline-flex"
        >
          <User className="w-4 h-4 mr-1.5" /> เข้าสู่ระบบ
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => navigate("/jobs")}
        aria-label="งานจาก Studio"
        title="งานจาก Studio"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <BriefcaseIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => navigate("/chat")}
        aria-label="ข้อความ"
        title="ข้อความ"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      <NotificationBell />
      <WalletBadge />
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <button
          aria-label="โปรไฟล์"
          className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full glass-chip hover:shadow-md hover:shadow-primary/20 transition-all"
        >
          <UserAvatar
            src={profile?.avatar_url}
            name={profile?.display_name ?? "P"}
            className="w-8 h-8"
            fallbackClassName="text-sm"
          />
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl glass-panel-strong">
        <DropdownMenuItem onClick={() => navigate("/portfolio")} className="rounded-lg">
          <LayoutGrid className="w-4 h-4 mr-2" /> โปรไฟล์ของฉัน
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/collections")} className="rounded-lg">
          <Layers3 className="w-4 h-4 mr-2" /> คอลเลกชันของฉัน
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/earnings")} className="rounded-lg">
          <Coins className="w-4 h-4 mr-2 text-primary" /> รายได้ &amp; กระเป๋า Pixel
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate("/chat")} className="rounded-lg">
          <MessageCircle className="w-4 h-4 mr-2" /> ข้อความ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/jobs")} className="rounded-lg">
          <BriefcaseIcon className="w-4 h-4 mr-2" /> งานจาก Studio
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted-foreground">Studio ของฉัน</DropdownMenuLabel>
        {myStudios.length === 0 ? (
          <DropdownMenuItem onClick={() => navigate("/studio/new")} className="rounded-lg text-primary">
            <Plus className="w-4 h-4 mr-2" /> ก่อตั้ง Studio
          </DropdownMenuItem>
        ) : (
          <>
            {myStudios.map((s) => (
              <DropdownMenuItem key={s.id} onClick={() => { setActive.mutate(s.id); navigate("/studio/manage"); }} className="rounded-lg">
                <Building2 className="w-4 h-4 mr-2" /> {s.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => navigate("/studio/new")} className="rounded-lg text-muted-foreground">
              <Plus className="w-4 h-4 mr-2" /> สร้าง Studio ใหม่
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg">
          <Settings className="w-4 h-4 mr-2" /> ตั้งค่า
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
          className="rounded-lg text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" /> ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
};

export default ProfileButton;
