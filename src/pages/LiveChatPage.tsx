import BriefcaseIcon from "../components/icons/BriefcaseIcon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Handshake, Info } from "lucide-react";
import { so1oQuotationUrl, trackCrossLink } from "@/lib/crossLink";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useConversation, useMessages } from "@/hooks/useChat";
import MessageBubble, { DateSeparator } from "@/components/chat/MessageBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import ChatMetaPanel from "@/components/chat/ChatMetaPanel";
import { format, isSameDay } from "date-fns";

const HIRE_QUICK = ["ขอรายละเอียดเพิ่มเติม", "ขอ timeline ของงาน", "ขอส่งใบเสนอราคาให้พิจารณา", "ขอบคุณสำหรับการติดต่อครับ"];
const COLLAB_QUICK = ["เริ่มจาก mood board ไหม?", "นัดคุยใน DM กันต่อ", "ส่งร่างไอเดียให้ดูได้ไหม", "พร้อมเริ่มเลย!"];

const LiveChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: conv, isLoading: convLoading } = useConversation(id);
  const { data: messages = [] } = useMessages(id);
  const [showMeta, setShowMeta] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate(`/auth?redirect=/chat/${id}`);
  }, [authLoading, user, id, navigate]);

  // Counterpart profile
  const otherId = conv ? (conv.client_id === user?.id ? conv.freelancer_id : conv.client_id) : null;
  const { data: other } = useQuery({
    queryKey: ["chat-other", otherId],
    enabled: !!otherId,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, role")
        .eq("id", otherId!)
        .maybeSingle();
      return data;
    },
  });

  const { data: hireMeta } = useQuery({
    queryKey: ["chat-hire-meta", conv?.request_id],
    enabled: !!conv?.request_id && conv?.kind === "hire",
    queryFn: async () => {
      const { data } = await supabase
        .from("hiring_requests")
        .select("id, client_name, email, phone, message, deadline, project_title, budget_amount")
        .eq("id", conv!.request_id)
        .maybeSingle();
      return data;
    },
  });

  // Mark unread messages as read
  useEffect(() => {
    if (!user || !id || messages.length === 0) return;
    const unread = messages.filter((m) => m.sender_id !== user.id && !m.read_at).map((m) => m.id);
    if (unread.length === 0) return;
    supabase.from("messages").update({ read_at: new Date().toISOString() }).in("id", unread);
  }, [messages, user, id]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const grouped = useMemo(() => {
    const items: Array<{ type: "date"; date: string } | { type: "msg"; m: (typeof messages)[number] }> = [];
    let lastDate: Date | null = null;
    messages.forEach((m) => {
      const d = new Date(m.created_at);
      if (!lastDate || !isSameDay(lastDate, d)) {
        items.push({ type: "date", date: m.created_at });
        lastDate = d;
      }
      items.push({ type: "msg", m });
    });
    return items;
  }, [messages]);

  if (convLoading || !conv) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">กำลังโหลด…</div>;
  }

  const kind = conv.kind as "hire" | "collab";
  const isHire = kind === "hire";
  const accent = isHire ? "text-[hsl(var(--chat-hire))]" : "text-[hsl(var(--chat-collab))]";
  const badgeBg = isHire ? "bg-[hsl(var(--chat-hire-soft))]" : "bg-[hsl(var(--chat-collab-soft))]";

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 py-2.5 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={() => navigate("/chat")} className="shrink-0 rounded-full" aria-label="ย้อนกลับ">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <button onClick={() => other?.id && navigate(`/u/${other.id}`)} className="flex items-center gap-2.5 min-w-0 flex-1">
          {other?.avatar_url ? (
            <img src={other.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
              {(other?.display_name ?? "?")[0]}
            </div>
          )}
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground truncate text-sm">{other?.display_name ?? "ผู้ใช้"}</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeBg} ${accent}`}>
                {isHire ? <BriefcaseIcon className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                {isHire ? "งานจ้าง" : "คอลแลป"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{conv.project_title || (isHire ? "พูดคุยรายละเอียดงาน" : "พูดคุยแนวทางคอลแลป")}</p>
          </div>
        </button>
        {isHire && (
          <button
            type="button"
            onClick={async () => {
              const linkId = await trackCrossLink({
                source: "chat_header",
                refId: conv.id,
                meta: {
                  client_id: otherId ?? undefined,
                  request_id: conv.request_id ?? undefined,
                },
              });
              const url = so1oQuotationUrl({
                conversationId: conv.id,
                requestId: conv.request_id ?? undefined,
                clientName: hireMeta?.client_name ?? other?.display_name ?? undefined,
                projectTitle: hireMeta?.project_title ?? conv.project_title ?? undefined,
                clientEmail: hireMeta?.email ?? undefined,
                clientPhone: hireMeta?.phone ?? undefined,
                message: hireMeta?.message ?? undefined,
                deadline: hireMeta?.deadline ?? undefined,
                linkId,
              });
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
            aria-label="สร้างใบเสนอราคาใน So1o"
          >
            <FileText className="w-3.5 h-3.5" />
            สร้าง Quote
          </button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full"
          onClick={() => setShowMeta((v) => !v)}
          aria-label="ข้อมูล"
        >
          <Info className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Messages */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {grouped.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-12">
                {isHire ? "เริ่มบทสนทนากับลูกค้าได้เลย ✨" : "ทักทายเพื่อนคอลแลปได้เลย 👋"}
              </div>
            )}
            {grouped.map((it, idx) =>
              it.type === "date" ? (
                <DateSeparator key={`d-${idx}`} date={it.date} />
              ) : (
                <MessageBubble
                  key={it.m.id}
                  content={it.m.content}
                  attachmentUrl={it.m.attachment_url}
                  createdAt={it.m.created_at}
                  mine={it.m.sender_id === user?.id}
                  kind={kind}
                  readAt={it.m.read_at}
                />
              ),
            )}
            <div ref={endRef} />
          </div>
          <ChatComposer
            conversationId={conv.id}
            kind={kind}
            quickReplies={isHire ? HIRE_QUICK : COLLAB_QUICK}
          />
        </main>

        {/* Meta panel — desktop always, mobile slide-over */}
        <div className="hidden lg:block">
          <ChatMetaPanel conversation={conv} />
        </div>
        {showMeta && (
          <div className="lg:hidden fixed inset-0 z-30 bg-background/60 backdrop-blur-sm" onClick={() => setShowMeta(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
              <ChatMetaPanel conversation={conv} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatPage;
