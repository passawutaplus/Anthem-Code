import BriefcaseIcon from "../components/icons/BriefcaseIcon";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useConversations, type ChatKind } from "@/hooks/useChat";
import { timeAgoTH } from "@/lib/format";
import { cn } from "@/lib/utils";

const TABS: { key: "all" | ChatKind; label: string; icon: typeof BriefcaseIcon }[] = [
  { key: "all", label: "ทั้งหมด", icon: MessageCircle },
  { key: "hire", label: "งานจ้าง", icon: BriefcaseIcon },
  { key: "collab", label: "คอลแลป", icon: Handshake },
];

const ChatListPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"all" | ChatKind>("all");
  const { data: conversations = [], isLoading } = useConversations(tab === "all" ? undefined : tab);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/chat");
  }, [authLoading, user, navigate]);

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
      const { data } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", otherIds);
      const map: Record<string, { name: string; avatar: string }> = {};
      (data ?? []).forEach((p) => (map[p.user_id ?? p.id] = { name: p.display_name || "ผู้ใช้", avatar: p.avatar_url || "" }));
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
      (data ?? []).forEach((m: any) => {
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

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-3 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full" aria-label="ย้อนกลับ">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium text-foreground">ข้อความ</h1>
        </div>
        <div className="max-w-3xl mx-auto px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            const accent =
              key === "hire"
                ? active ? "bg-[hsl(var(--chat-hire))] text-white border-transparent" : "border-border text-foreground"
                : key === "collab"
                  ? active ? "bg-[hsl(var(--chat-collab))] text-white border-transparent" : "border-border text-foreground"
                  : active ? "bg-foreground text-background border-transparent" : "border-border text-foreground";
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors", accent)}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 py-3 pb-24 lg:pb-6">
        {isLoading && <p className="text-sm text-muted-foreground text-center py-8">กำลังโหลด…</p>}
        {!isLoading && conversations.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-foreground">ยังไม่มีบทสนทนา</p>
            <p className="text-sm mt-1">เมื่อคุณตอบรับคำขอจ้างหรือคอลแลป ห้องแชทจะอยู่ที่นี่</p>
          </div>
        )}

        <ul className="space-y-1.5">
          {conversations.map((c) => {
            const otherId = c.client_id === user?.id ? c.freelancer_id : c.client_id;
            const p = (profilesMap as Record<string, { name: string; avatar: string }>)[otherId];
            const last = (lastMessages as Record<string, { preview: string; mine: boolean; created_at: string }>)[c.id];
            const isHire = c.kind === "hire";
            return (
              <li key={c.id}>
                <button
                  onClick={() => navigate(`/chat/${c.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-accent transition-colors text-left"
                >
                  <div className="relative shrink-0">
                    {p?.avatar ? (
                      <img src={p.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
                        {(p?.name ?? "?")[0]}
                      </div>
                    )}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background",
                        isHire ? "bg-[hsl(var(--chat-hire))]" : "bg-[hsl(var(--chat-collab))]",
                      )}
                      title={isHire ? "งานจ้าง" : "คอลแลป"}
                    >
                      {isHire ? <BriefcaseIcon className="w-2.5 h-2.5 text-white" /> : <Handshake className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground truncate text-sm">{p?.name ?? "ผู้ใช้"}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {timeAgoTH(last?.created_at ?? c.last_message_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {last ? (last.mine ? "คุณ: " : "") + last.preview : (isHire ? "เริ่มพูดคุยเรื่องงานได้เลย" : "เริ่มคุยคอลแลปได้เลย")}
                    </p>
                    {c.project_title && (
                      <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">📌 {c.project_title}</p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
};

export default ChatListPage;
