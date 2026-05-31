import BriefcaseIcon from "./icons/BriefcaseIcon";
import { Home, Bell, User, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useAuthDialog } from "@/stores/authDialogStore";

const items = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/jobs", label: "Jobs", icon: BriefcaseIcon, match: (p: string) => p.startsWith("/jobs") },
  { to: "/portfolio/new", label: "New", icon: Plus, match: (p: string) => p === "/portfolio/new", accent: true },
  { to: "/notifications", label: "Alerts", icon: Bell, match: (p: string) => p.startsWith("/notifications") },
  { to: "/portfolio", label: "Profile", icon: User, match: (p: string) => p.startsWith("/portfolio") || p.startsWith("/u/"), profile: true },
];

const HIDDEN_PREFIXES = ["/auth", "/admin"];
const isLiveChat = (p: string) => /^\/chat\/[^/]+/.test(p);

const BottomNav = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const openAuth = useAuthDialog((s) => s.openSignup);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setAvatarUrl(null); return; }
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setAvatarUrl(data?.avatar_url ?? null));
  }, [user]);

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p)) || isLiveChat(pathname)) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-background/40 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]" style={{ WebkitBackdropFilter: "blur(20px)" }}>
      <ul className="max-w-5xl mx-auto grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, match, profile }) => {
          const active = match(pathname);
          const requiresAuth = to !== "/";
          const handleClick = (e: React.MouseEvent) => {
            if (requiresAuth && !user) {
              e.preventDefault();
              openAuth();
            }
          };
          return (
            <li key={to}>
              <NavLink
                to={to}
                onClick={handleClick}
                aria-label={label}
                className={cn(
                  "flex items-center justify-center py-3 transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {profile && user ? (
                  avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className={cn(
                        "w-7 h-7 rounded-full object-cover",
                        active ? "ring-2 ring-primary" : "ring-1 ring-border"
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full bg-gradient-brand text-white flex items-center justify-center text-xs font-semibold",
                        active ? "ring-2 ring-primary" : "ring-1 ring-border"
                      )}
                    >
                      {(user.email?.[0] ?? "U").toUpperCase()}
                    </div>
                  )
                ) : (
                  <Icon
                    className={cn("w-6 h-6", active && "text-transparent [&>*]:stroke-[2.2]")}
                    style={active ? { stroke: "url(#bn-grad)" } : undefined}
                  />
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="bn-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(45 100% 60%)" />
            <stop offset="50%" stopColor="hsl(28 100% 55%)" />
            <stop offset="100%" stopColor="hsl(14 90% 50%)" />
          </linearGradient>
        </defs>
      </svg>
    </nav>
  );
};

export default BottomNav;
