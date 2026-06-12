import BriefcaseIcon from "../icons/BriefcaseIcon";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Handshake, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  useConversations,
  useConversationUnreadCounts,
  type ChatKind,
  type Conversation,
} from "@/hooks/useChat";
import { timeAgoTH } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DEMO_RESEARCH_ACCOUNTS, isDemoMode } from "@/lib/demoMode";

const TABS: { key: "all" | ChatKind; label: string; icon: typeof BriefcaseIcon }[] = [
  { key: "all", label: "ทั้งหมด", icon: MessageCircle },
  { key: "hire", label: "งานจ้าง", icon: BriefcaseIcon },
  { key: "collab", label: "คอลแลป", icon: Handshake },
];

interface Props {
  selectedId?: string;
  tab: "all" | ChatKind;
  onTabChange: (tab: "all" | ChatKind) => void;
  search: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

const ChatSidebar = ({ selectedId, tab, onTabChange, search, onSearchChange, className }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: conversations = [], isLoading, isError, error } = useConversations(tab === "all" ? undefined : tab);

  const otherIds = useMemo(
    () =>
      Array.from(
        new Set(
          conversations.map((c) => (c.client_id === user?.id ? c.freelancer_id : c.client_id)),
        ),
      ),
    [conversations, user?.id],
  );

  const { data: profilesMap = {} } = useQuery({
    queryKey: ["chat-list-profiles", otherIds],
    enabled: otherIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", otherIds);
      const map: Record<string, { name: string; avatar: string }> = {};
      (data ?? []).forEach((p) => {
        const uid = p.user_id ?? (p as { id?: string }).id;
        if (uid) map[uid] = { name: p.display_name || "ผู้ใช้", avatar: p.avatar_url || "" };
      });
      return map;
    },
  });

  const convIds = conversations.map((c) => c.id);
  const { data: lastMessages = {} } = useQuery({
    queryKey: ["chat-last-msgs", convIds],
    enabled: convIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("messages")
        .select("conversation_id, content, attachment_url, sender_id, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: false });
      const map: Record<string, { preview: string; mine: boolean; created_at: string }> = {};
      (data ?? []).forEach((m: {
        conversation_id: string;
        content: string | null;
        attachment_url: string | null;
        sender_id: string;
        created_at: string;
      }) => {
        if (map[m.conversation_id]) return;
        map[m.conversation_id] = {
          preview: m.content || (m.attachment_url ? "📷 รูปภาพ" : ""),
          mine: m.sender_id === user?.id,
          created_at: m.created_at,
        };
      });
      return map;
    },
  });

  const { data: unreadCounts = {} } = useConversationUnreadCounts(convIds);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const otherId = c.client_id === user?.id ? c.freelancer_id : c.client_id;
      const p = profilesMap[otherId];
      const name = (p?.name ?? "").toLowerCase();
      const title = (c.project_title ?? "").toLowerCase();
      return name.includes(q) || title.includes(q);
    });
  }, [conversations, search, profilesMap, user?.id]);

  const selectConversation = (c: Conversation) => {
    navigate(`/chat/${c.id}`);
  };

  return (
    <aside className={cn("flex flex-col h-full border-r border-border bg-background", className)}>
      <div className="shrink-0 p-3 border-b border-border space-y-3">
        <h1 className="text-lg font-semibold text-foreground px-1">ข้อความ</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่อหรืองาน…"
            className="pl-9 rounded-full bg-muted border-0 h-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            const accent =
              key === "hire"
                ? active
                  ? "bg-[hsl(var(--chat-hire))] text-white border-transparent"
                  : "border-border text-foreground"
                : key === "collab"
                  ? active
                    ? "bg-[hsl(var(--chat-collab))] text-white border-transparent"
                    : "border-border text-foreground"
                  : active
                    ? "bg-foreground text-background border-transparent"
                    : "border-border text-foreground";
            return (
              <button
                key={key}
                type="button"
                onClick={() => onTabChange(key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors shrink-0",
                  accent,
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading && <p className="text-sm text-muted-foreground text-center py-8">กำลังโหลด…</p>}
        {isError && (
          <div className="text-center py-12 text-destructive px-4 text-sm">
            โหลดรายการแชทไม่สำเร็จ — {(error as Error)?.message ?? "ลองรีเฟรชหน้า"}
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground px-4">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-foreground">ยังไม่มีบทสนทนา</p>
            <p className="text-sm mt-1">เมื่อคุณตอบรับคำขอจ้างหรือคอลแลป ห้องแชทจะอยู่ที่นี่</p>
            {isDemoMode() && (
              <p className="text-xs mt-3 text-primary/90 leading-relaxed">
                ข้อมูล demo 5 แชทอยู่ที่บัญชี{" "}
                <span className="font-medium">{DEMO_RESEARCH_ACCOUNTS[0].email}</span>
                <br />
                ออกจากระบบแล้วล็อกอินใหม่ด้วยรหัส <span className="font-mono">an1hem-demo-seed</span>
              </p>
            )}
          </div>
        )}

        <ul className="space-y-0.5">
          {filtered.map((c) => {
            const otherId = c.client_id === user?.id ? c.freelancer_id : c.client_id;
            const p = profilesMap[otherId];
            const last = lastMessages[c.id];
            const isHire = c.kind === "hire";
            const selected = selectedId === c.id;
            const unread = unreadCounts[c.id] ?? 0;
            const accentBorder = isHire
              ? "border-[hsl(var(--chat-hire))]"
              : "border-[hsl(var(--chat-collab))]";
            const badgeBg = isHire
              ? "bg-[hsl(var(--chat-hire-soft))] text-[hsl(var(--chat-hire))]"
              : "bg-[hsl(var(--chat-collab-soft))] text-[hsl(var(--chat-collab))]";

            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => selectConversation(c)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left border-l-4",
                    selected
                      ? cn("bg-accent/80", accentBorder)
                      : "border-transparent hover:bg-accent/50",
                  )}
                >
                  <div className="relative shrink-0">
                    {p?.avatar ? (
                      <img src={p.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
                        {(p?.name ?? "?")[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-foreground truncate text-sm">
                          {p?.name ?? "ผู้ใช้"}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                            badgeBg,
                          )}
                        >
                          {isHire ? "จ้าง" : "คอลแลป"}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {timeAgoTH(last?.created_at ?? c.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground truncate flex-1">
                        {last
                          ? (last.mine ? "คุณ: " : "") + last.preview
                          : isHire
                            ? "เริ่มพูดคุยเรื่องงานได้เลย"
                            : "เริ่มคุยคอลแลปได้เลย"}
                      </p>
                      {unread > 0 && (
                        <span className="shrink-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-semibold rounded-full bg-destructive text-destructive-foreground">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>
                    {c.project_title && (
                      <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                        {c.project_title}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default ChatSidebar;
