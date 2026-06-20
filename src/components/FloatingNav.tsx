import BriefcaseIcon from "./icons/BriefcaseIcon";

import { Home, MessageCircle, Plus, MessagesSquare } from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/useAuth";

import { supabase } from "@/integrations/supabase/client";

import { useAuthDialog } from "@/stores/authDialogStore";

import { useAppLayout } from "@/hooks/useAppLayout";

import CreateContentDrawer from "@/components/CreateContentDrawer";

import UserAvatar from "@/components/UserAvatar";



type NavItem = {

  to: string;

  label: string;

  icon: typeof Home;

  match: (pathname: string, mode: string | null) => boolean;

  requiresAuth?: boolean;

  profile?: boolean;

};



const NAV_ITEMS: NavItem[] = [

  {

    to: "/",

    label: "หน้าแรก",

    icon: Home,

    match: (p, mode) => p === "/" && mode !== "community",

  },

  {

    to: "/?mode=community",

    label: "Area",

    icon: MessagesSquare,

    match: (p, mode) => p === "/" && mode === "community",

  },

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



const FloatingNav = () => {

  const { pathname, search } = useLocation();

  const feedMode = new URLSearchParams(search).get("mode");

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



  return (

    <>

      <nav

        aria-label="เมนูหลัก"

        className="lg:hidden fixed inset-x-0 z-30 flex items-center justify-center gap-3 px-4 pointer-events-none"

        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}

      >

        <div

          className={cn(

            "pointer-events-auto flex items-center gap-0.5 rounded-full",

            "border border-border/80 bg-background/90 px-1.5 py-1.5 shadow-lg shadow-black/25",
            "dark:border-border dark:bg-card/90 dark:shadow-black/50",
            "backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 dark:supports-[backdrop-filter]:bg-card/80",

          )}

          style={{ WebkitBackdropFilter: "blur(20px)" }}

        >

          {NAV_ITEMS.map(({ to, label, icon: Icon, match, requiresAuth, profile }) => {

            const active = match(pathname, feedMode);

            return (

              <NavLink

                key={to}

                to={to}

                onClick={(e) => {

                  if (to === "/?mode=community") {

                    localStorage.setItem("feed-mode", "community");

                  } else if (to === "/") {

                    localStorage.setItem("feed-mode", "projects");

                  }

                  guardAuth(e, requiresAuth, to);

                }}

                aria-label={label}

                aria-current={active ? "page" : undefined}

                className={cn(

                  "flex items-center justify-center rounded-full transition-colors min-h-11",

                  active

                    ? "gap-1.5 bg-foreground text-background px-2.5 py-2 text-[11px] font-medium"

                    : "p-2 text-muted-foreground hover:text-foreground hover:bg-accent w-10 min-h-10",

                )}

              >

                {profile && user ? (

                  <UserAvatar

                    src={avatarUrl}

                    name={user.email ?? "U"}

                    className={cn("shrink-0", active ? "w-6 h-6" : "w-7 h-7")}

                    fallbackClassName={active ? "text-[10px]" : "text-xs"}

                  />

                ) : (

                  <Icon className={cn("shrink-0", active ? "w-4 h-4" : "w-5 h-5")} strokeWidth={active ? 2.2 : 2} />

                )}

                {active && <span className="whitespace-nowrap max-w-[4.5rem] truncate">{label}</span>}

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



      <CreateContentDrawer open={createOpen} onOpenChange={setCreateOpen} />

    </>

  );

};



export default FloatingNav;


