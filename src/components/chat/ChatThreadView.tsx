import BriefcaseIcon from "../icons/BriefcaseIcon";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  FileText,
  Handshake,
  Info,
  Users,
} from "lucide-react";
import { so1oQuotationUrl, trackCrossLink } from "@/lib/crossLink";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  isGroupConversation,
  isStudioConversation,
  otherParticipantId,
  useUnsendMessage,
  type Conversation,
  type Message,
} from "@/hooks/useChat";
import MessageBubble, { DateSeparator } from "@/components/chat/MessageBubble";
import ChatComposer from "@/components/chat/ChatComposer";
import ReportTrigger from "@/components/report/ReportTrigger";
import { tierLabel } from "@/lib/tierMembership";
import type { PlanId } from "@/data/plans";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  messages: Message[];
  showBack?: boolean;
  onBack?: () => void;
  onOpenPartnerPanel?: () => void;
  showPartnerToggle?: boolean;
}

const TIER_BADGE_TIERS = new Set<PlanId>(["pro", "pro_plus", "inhouse"]);

const ChatThreadView = ({
  conv,
  messages,
  showBack,
  onBack,
  onOpenPartnerPanel,
  showPartnerToggle,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const endRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const unsend = useUnsendMessage();

  const isGroup = isGroupConversation(conv);
  const isStudio = isStudioConversation(conv);
  const otherId = otherParticipantId(conv, user?.id ?? "");
  const kind = (isStudio ? "studio" : isGroup ? "group" : conv.kind) as "hire" | "collab" | "group" | "studio";
  const isHire = kind === "hire";

  const { data: other } = useQuery({
    queryKey: ["chat-other", otherId],
    enabled: !!otherId && !isGroup,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, role, username, subscription_tier")
        .eq("user_id", otherId!)
        .maybeSingle();
      return data;
    },
  });

  const { data: hireMeta } = useQuery({
    queryKey: ["chat-hire-meta", conv.request_id],
    enabled: !!conv.request_id && isHire,
    queryFn: async () => {
      const { data } = await supabase
        .from("hiring_requests")
        .select("id, client_name, email, phone, message, deadline, project_title, budget_amount")
        .eq("id", conv.request_id!)
        .maybeSingle();
      return data;
    },
  });

  const visibleMessages = messages;

  useEffect(() => {
    if (!user || !conv.id || messages.length === 0) return;
    const unread = messages
      .filter((m) => m.sender_id !== user.id && !m.read_at && !m.deleted_at)
      .map((m) => m.id);
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
  }, [visibleMessages.length]);

  useEffect(() => {
    setReplyTo(null);
  }, [conv.id]);

  const grouped = useMemo(() => {
    const items: Array<{ type: "date"; date: string } | { type: "msg"; m: Message }> = [];
    let lastDate: Date | null = null;
    visibleMessages.forEach((m) => {
      const d = new Date(m.created_at);
      if (!lastDate || !isSameDay(lastDate, d)) {
        items.push({ type: "date", date: m.created_at });
        lastDate = d;
      }
      items.push({ type: "msg", m });
    });
    return items;
  }, [visibleMessages]);

  const accent = isHire ? "text-[hsl(var(--chat-hire))]" : kind === "collab" ? "text-[hsl(var(--chat-collab))]" : "text-primary";
  const badgeBg = isHire ? "bg-[hsl(var(--chat-hire-soft))]" : kind === "collab" ? "bg-[hsl(var(--chat-collab-soft))]" : "bg-primary/10";

  const displayName = isGroup ? conv.title || conv.project_title || "กลุ่มแชท" : other?.display_name ?? "ผู้ใช้";
  const partnerTier = (other?.subscription_tier as PlanId | undefined) ?? "free";
  const showTierBadge = !isGroup && TIER_BADGE_TIERS.has(partnerTier);

  const openQuote = async () => {
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
  };

  const handleUnsend = async (msg: Message) => {
    try {
      await unsend.mutateAsync({
        messageId: msg.id,
        conversationId: conv.id,
        createdAt: msg.created_at,
      });
      if (replyTo?.id === msg.id) setReplyTo(null);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "ยกเลิกไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col h-full min-w-0 bg-background">
      <header className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-background/90 backdrop-blur-md shrink-0">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack ?? (() => navigate("/chat"))}
            className="shrink-0 rounded-full md:hidden"
            aria-label="ย้อนกลับ"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <button
          type="button"
          onClick={() => !isGroup && other?.user_id && onOpenPartnerPanel?.()}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
        >
          {isGroup ? (
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-primary" />
            </div>
          ) : other?.avatar_url ? (
            <img src={other.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
              {displayName[0]}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-foreground truncate text-sm">{displayName}</span>
              {!isGroup && (
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
              )}
              {showTierBadge && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 shrink-0">
                  {tierLabel(partnerTier)}
                </Badge>
              )}
              {isStudio && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 shrink-0">
                  สตูดิโอ
                </Badge>
              )}
              {isGroup && !isStudio && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 shrink-0">
                  กลุ่ม
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {isStudio
                ? "แชททีมสตูดิโอ"
                : isGroup
                ? "แชทกลุ่ม"
                : conv.project_title || (isHire ? "พูดคุยรายละเอียดงาน" : "พูดคุยแนวทางคอลแลป")}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {!isGroup && otherId && (
            <ReportTrigger targetType="user" targetId={otherId} targetOwnerId={otherId} />
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openQuote}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2.5 h-8 rounded-full"
            aria-label="สร้างใบเสนอราคาใน So1o"
          >
            <FileText className="w-3.5 h-3.5" />
            Quote
          </Button>
          {!isGroup && otherId && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hidden sm:inline-flex"
              aria-label="ชวนสร้างสตูดิโอ"
              onClick={() => navigate(`/studio/new?invite=${otherId}`)}
            >
              <Building2 className="w-4 h-4" />
            </Button>
          )}
          {showPartnerToggle && !isGroup && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full h-8 w-8"
              onClick={onOpenPartnerPanel}
              aria-label="ข้อมูลโปรไฟล์"
            >
              <Info className="w-5 h-5" />
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 min-h-0">
        {grouped.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12">
            {isGroup ? "เริ่มแชทกลุ่มได้เลย 👥" : isHire ? "เริ่มบทสนทนากับลูกค้าได้เลย ✨" : "ทักทายเพื่อนคอลแลปได้เลย 👋"}
          </div>
        )}
        {grouped.map((it, idx) =>
          it.type === "date" ? (
            <DateSeparator key={`d-${idx}`} date={it.date} />
          ) : (
            <MessageBubble
              key={it.m.id}
              message={it.m}
              mine={it.m.sender_id === user?.id}
              kind={kind}
              onReply={setReplyTo}
              onUnsend={handleUnsend}
            />
          ),
        )}
        <div ref={endRef} />
      </div>

      <ChatComposer
        conversationId={conv.id}
        kind={kind}
        quickReplies={isGroup ? [] : isHire ? HIRE_QUICK : COLLAB_QUICK}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatThreadView;
