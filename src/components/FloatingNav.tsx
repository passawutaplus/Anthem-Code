import BriefcaseIcon from "./icons/BriefcaseIcon";
import { Home, MessageCircle, Plus, ImagePlus, Megaphone, Briefcase } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useAuthDialog } from "@/stores/authDialogStore";
import { useAppLayout } from "@/hooks/useAppLayout";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  match: (p: string) => boolean;
  requiresAuth?: boolean;
  profile?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "หน้าแรก", icon: Home, match: (p) => p === "/" },
  { to: "/jobs", label: "งาน", icon: BriefcaseIcon, match: (p) => p.startsWith("/jobs") },
  { to: "/chat", label: "แชท", icon: MessageCircle, match: (p) => p.startsWith("/chat"), requiresAuth: true },
  {
    to: "/portfolio",
    label: "โปรไฟล์",
    icon: Home,
    match: (p) =>
      p.startsWith("/portfolio") ||
      p.startsWith("/settings") ||
      p.startsWith("/collections"),
    requiresAuth: true,
    profile: true,
  },
];

const CREATE_ACTIONS = [
  { label: "ลงผลงาน", desc: "เผยแพร่ผลงานใหม่", icon: ImagePlus, to: "/portfolio/new" },
  { label: "โพสต์ชุมชน", desc: "ถามตอบ / แชร์ Tips", icon: Megaphone, to: "/community/new" },
  { label: "โพสต์งาน", desc: "รับสมัครหรือหางาน", icon: Briefcase, to: "/jobs?post=1" },
] as const;

const FloatingNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const openAuth = useAuthDialog((s) => s.openSignup);
  const { showBottomNav } = useAppLayout();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      return;
    }
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setAvatarUrl(data?.avatar_url ?? null));
  }, [user]);

  if (!showBottomNav) return null;

  const guardAuth = (e: React.MouseEvent, requiresAuth?: boolean, dest?: string) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      openAuth(dest);
    }
  };

  const openCreate = () => {
    if (!user) {
      openAuth("/portfolio/new");
      return;
    }
    setCreateOpen(true);
  };

  const pickCreate = (to: string) => {
    setCreateOpen(false);
    navigate(to);
  };

  return (
    <>
      <nav
        aria-label="เมนูหลัก"
        className="lg:hidden fixed inset-x-0 z-30 flex items-center justify-center gap-3 px-4 pointer-events-none"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 rounded-full",
            "border border-white/15 bg-background/75 px-2 py-2 shadow-lg shadow-black/15",
            "backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
          )}
          style={{ WebkitBackdropFilter: "blur(20px)" }}
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon, match, requiresAuth, profile }) => {
            const active = match(pathname);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={(e) => guardAuth(e, requiresAuth, to)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-center rounded-full transition-colors min-h-11",
                  active
                    ? "gap-2 bg-foreground text-background px-4 py-2.5 text-sm font-medium"
                    : "p-2.5 text-muted-foreground hover:text-foreground w-11",
                )}
              >
                {profile && user ? (
                  avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className={cn(
                        "rounded-full object-cover shrink-0",
                        active ? "w-6 h-6" : "w-7 h-7",
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "rounded-full bg-gradient-brand text-white flex items-center justify-center font-semibold shrink-0",
                        active ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-xs",
                      )}
                    >
                      {(user.email?.[0] ?? "U").toUpperCase()}
                    </div>
                  )
                ) : (
                  <Icon className={cn("shrink-0", active ? "w-4 h-4" : "w-5 h-5")} strokeWidth={active ? 2.2 : 2} />
                )}
                {active && <span className="whitespace-nowrap">{label}</span>}
              </NavLink>
            );
          })}
        </div>

        <button
          type="button"
          onClick={openCreate}
          aria-label="สร้างเนื้อหาใหม่"
          className={cn(
            "pointer-events-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            "bg-gradient-brand text-white shadow-lg shadow-primary/25",
            "hover:opacity-90 active:scale-95 transition-all",
          )}
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </nav>

      <Drawer open={createOpen} onOpenChange={setCreateOpen}>
        <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
          <DrawerHeader className="text-left">
            <DrawerTitle>สร้างอะไรดี?</DrawerTitle>
          </DrawerHeader>
          <div className="grid gap-2 px-4 pb-6">
            {CREATE_ACTIONS.map(({ label, desc, icon: Icon, to }) => (
              <DrawerClose key={to} asChild>
                <button
                  type="button"
                  onClick={() => pickCreate(to)}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-left hover:bg-muted/60 transition-colors"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">{desc}</span>
                  </span>
                </button>
              </DrawerClose>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FloatingNav;
