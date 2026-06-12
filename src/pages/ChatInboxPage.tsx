import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useConversation, type ChatKind } from "@/hooks/useChat";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatThreadView from "@/components/chat/ChatThreadView";
import ChatPartnerPanel from "@/components/chat/ChatPartnerPanel";
import { cn } from "@/lib/utils";

const ChatInboxPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"all" | ChatKind>("all");
  const [search, setSearch] = useState("");
  const [showPartnerMobile, setShowPartnerMobile] = useState(false);

  const { data: conv, isLoading: convLoading } = useConversation(id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(id ? `/auth?redirect=/chat/${id}` : "/auth?redirect=/chat");
    }
  }, [authLoading, user, id, navigate]);

  useEffect(() => {
    setShowPartnerMobile(false);
  }, [id]);

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center text-muted-foreground">
        กำลังโหลด…
      </div>
    );
  }

  const showThread = !!id;
  const showSidebarMobile = !showThread;
  const showThreadMobile = showThread;

  return (
    <div className="h-[100dvh] bg-background overflow-hidden">
      <div className="h-full lg:grid lg:grid-cols-[320px_1fr_340px]">
        {/* Sidebar */}
        <div
          className={cn(
            "h-full",
            showSidebarMobile ? "block" : "hidden",
            "lg:block",
          )}
        >
          <ChatSidebar
            selectedId={id}
            tab={tab}
            onTabChange={setTab}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Thread / empty */}
        <div
          className={cn(
            "h-full min-w-0 border-border lg:border-x",
            showThreadMobile ? "flex flex-col" : "hidden",
            "lg:flex lg:flex-col",
          )}
        >
          {id && convLoading && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              กำลังโหลด…
            </div>
          )}
          {id && !convLoading && !conv && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground px-4">
              <p className="font-medium text-foreground">ไม่พบบทสนทนานี้</p>
              <button
                type="button"
                onClick={() => navigate("/chat")}
                className="mt-3 text-sm text-primary hover:underline"
              >
                กลับรายการแชท
              </button>
            </div>
          )}
          {conv && (
            <ChatThreadView
              conv={conv}
              showBack
              onBack={() => navigate("/chat")}
              showPartnerToggle
              onOpenPartnerPanel={() => setShowPartnerMobile(true)}
            />
          )}
          {!id && (
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center text-muted-foreground px-6">
              <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium text-foreground">เลือกบทสนทนาเพื่อเริ่มแชท</p>
              <p className="text-sm mt-1 text-center">
                รายการแชทงานจ้างและคอลแลปอยู่ทางซ้าย — คลิกเพื่อเปิดข้อความ
              </p>
            </div>
          )}
        </div>

        {/* Partner panel — desktop */}
        <div className="hidden lg:block h-full">
          {conv ? (
            <ChatPartnerPanel conversation={conv} />
          ) : (
            <aside className="h-full border-l border-border bg-muted/20" />
          )}
        </div>
      </div>

      {/* Partner panel — mobile slide-over */}
      {showPartnerMobile && conv && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          onClick={() => setShowPartnerMobile(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[92%] max-w-sm bg-background shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatPartnerPanel
              conversation={conv}
              onClose={() => setShowPartnerMobile(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInboxPage;
