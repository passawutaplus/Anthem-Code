import BriefcaseIcon from "../icons/BriefcaseIcon";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileText, Handshake, Info } from "lucide-react";
import { so1oQuotationUrl, trackCrossLink } from "@/lib/crossLink";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, type Conversation } from "@/hooks/useChat";
import MessageBubble, { DateSeparator } from "@/components/chat/MessageBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

const HIRE_QUICK = [
  "ขอรายละเอียดเพิ่มเติม",
  "ขอ timeline ของงาน",
  "ขอส่งใบเสนอราคาให้พิจารณา",
  "ขอบคุณสำหรับการติดต่อครับ",
];
const COLLAB_QUICK = [
  "เริ่มจาก mood board ไหม?",
  "นัดคุยใน DM กันต่อ",
  "ส่งร่างไอเดียให้ดูได้ไหม",
  "พร้อมเริ่มเลย!",
];

interface Props {
  conv: Conversation;
  showBack?: boolean;
  onBack?: () => void;
  onOpenPartnerPanel?: () => void;
  showPartnerToggle?: boolean;
}

const ChatThreadView = ({
  conv,
  showBack,
  onBack,
  onOpenPartnerPanel,
  showPartnerToggle,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: messages = [] } = useMessages(conv.id);
  const endRef = useRef<HTMLDivElement>(null);

  const otherId = conv.client_id === user?.id ? conv.freelancer_id : conv.client_id;

  const { data: other } = useQuery({
    queryKey: ["chat-other", otherId],
    enabled: !!otherId,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, role, username")
        .eq("user_id", otherId!)
        .maybeSingle();
      return data;
    },
  });

  const { data: hireMeta } = useQuery({
    queryKey: ["chat-hire-meta", conv.request_id],
    enabled: !!conv.request_id && conv.kind === "hire",
    queryFn: async () => {
      const { data } = await supabase
        .from("hiring_requests")
        .select("id, client_name, email, phone, message, deadline, project_title, budget_amount")
        .eq("id", conv.request_id!)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!user || !conv.id || messages.length === 0) return;
    const unread = messages.filter((m) => m.sender_id !== user.id && !m.read_at).map((m) => m.id);
    if (unread.length === 0) return;
    supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unread)
      .then(() => {
        qc.invalidateQueries({ queryKey: ["chat-unread-counts"] });
      });
  }, [messages, user, conv.id, qc]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const grouped = useMemo(() => {
    const items: Array<{ type: "date"; date: string } | { type: "msg"; m: (typeof messages)[number] }> =
      [];
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

  const kind = conv.kind as "hire" | "collab";
  const isHire = kind === "hire";
  const accent = isHire ? "text-[hsl(var(--chat-hire))]" : "text-[hsl(var(--chat-collab))]";
  const badgeBg = isHire ? "bg-[hsl(var(--chat-hire-soft))]" : "bg-[hsl(var(--chat-collab-soft))]";

  return (
    <div className="flex flex-col h-full min-w-0 bg-background">
      <header className="flex items-center gap-3 px-3 py-2.5 border-b border-border bg-background/90 backdrop-blur-md shrink-0">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack ?? (() => navigate("/chat"))}
            className="shrink-0 rounded-full lg:hidden"
            aria-label="ย้อนกลับ"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <button
          type="button"
          onClick={() => other?.user_id && onOpenPartnerPanel?.()}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          {other?.avatar_url ? (
            <img src={other.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
              {(other?.display_name ?? "?")[0]}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground truncate text-sm">
                {other?.display_name ?? "ผู้ใช้"}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                  badgeBg,
                  accent,
                )}
              >
                {isHire ? <BriefcaseIcon className="w-3 h-3" /> : <Handshake className="w-3 h-3" />}
                {isHire ? "งานจ้าง" : "คอลแลป"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {conv.project_title || (isHire ? "พูดคุยรายละเอียดงาน" : "พูดคุยแนวทางคอลแลป")}
            </p>
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
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 transition-colors shrink-0"
            aria-label="สร้างใบเสนอราคาใน So1o"
          >
            <FileText className="w-3.5 h-3.5" />
            สร้าง Quote
          </button>
        )}
        {showPartnerToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full shrink-0"
            onClick={onOpenPartnerPanel}
            aria-label="ข้อมูลโปรไฟล์"
          >
            <Info className="w-5 h-5" />
          </Button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 min-h-0">
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
    </div>
  );
};

export default ChatThreadView;
