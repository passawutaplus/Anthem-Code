import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, type Conversation } from "@/hooks/useChat";
import { useFollowState } from "@/hooks/useFollow";
import { PUBLIC_PROFILE_SELECT } from "@/lib/dbSelects";
import { profilePublicPath } from "@/lib/profileRoutes";
import ChatMetaPanel from "@/components/chat/ChatMetaPanel";
import { cn } from "@/lib/utils";

interface Props {
  conversation: Conversation;
  className?: string;
  onClose?: () => void;
}

const ChatPartnerPanel = ({ conversation, className, onClose }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const otherId =
    conversation.client_id === user?.id ? conversation.freelancer_id : conversation.client_id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["chat-partner-profile", otherId],
    enabled: !!otherId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(PUBLIC_PROFILE_SELECT)
        .eq("user_id", otherId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: messages = [] } = useMessages(conversation.id);
  const { followers, following } = useFollowState(otherId);

  const attachments = useMemo(
    () =>
      messages
        .filter((m) => m.attachment_url)
        .map((m) => ({ url: m.attachment_url!, createdAt: m.created_at }))
        .reverse(),
    [messages],
  );

  const skills = (profile?.skills as string[] | null) ?? [];
  const displayName = profile?.display_name || profile?.username || "ผู้ใช้";

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-l border-border bg-background overflow-hidden",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 text-center border-b border-border">
          {isLoading ? (
            <div className="py-8 text-sm text-muted-foreground">กำลังโหลด…</div>
          ) : (
            <>
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-medium text-muted-foreground mx-auto">
                  {displayName[0]}
                </div>
              )}
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <h2 className="font-semibold text-foreground">{displayName}</h2>
                {profile?.is_verified && (
                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" aria-label="ยืนยันแล้ว" />
                )}
              </div>
              {profile?.username && (
                <p className="text-sm text-muted-foreground mt-0.5">@{profile.username}</p>
              )}
              {profile?.role && (
                <p className="text-xs text-muted-foreground mt-1">{profile.role}</p>
              )}
              {profile?.location && (
                <p className="text-xs text-muted-foreground mt-0.5">{profile.location}</p>
              )}
              <div className="flex justify-center gap-4 mt-3 text-sm">
                <span>
                  <span className="font-semibold text-foreground">{followers}</span>{" "}
                  <span className="text-muted-foreground">ผู้ติดตาม</span>
                </span>
                <span>
                  <span className="font-semibold text-foreground">{following}</span>{" "}
                  <span className="text-muted-foreground">กำลังติดตาม</span>
                </span>
              </div>
              {profile?.bio && (
                <p className="text-sm text-foreground/85 mt-3 line-clamp-4 text-left leading-relaxed">
                  {profile.bio}
                </p>
              )}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                  {skills.slice(0, 8).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
              {profile && (
                <Button
                  variant="outline"
                  className="w-full mt-4 rounded-full"
                  onClick={() => {
                    onClose?.();
                    navigate(profilePublicPath(profile));
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ดูโปรไฟล์
                </Button>
              )}
            </>
          )}
        </div>

        <Tabs defaultValue="job" className="flex flex-col">
          <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
            <TabsTrigger
              value="job"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs"
            >
              ข้อมูลงาน
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2.5 text-xs"
            >
              มีเดียและไฟล์
              {attachments.length > 0 && (
                <span className="ml-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                  {attachments.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="job" className="mt-0">
            <ChatMetaPanel conversation={conversation} embedded />
          </TabsContent>
          <TabsContent value="media" className="mt-0 p-4">
            {attachments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">ยังไม่มีรูปหรือไฟล์ในแชทนี้</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {attachments.map(({ url }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
};

export default ChatPartnerPanel;
