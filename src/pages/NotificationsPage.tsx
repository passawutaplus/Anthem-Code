import BriefcaseIcon from "../components/icons/BriefcaseIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, MessageCircle, Handshake, Bell, Sparkles, Megaphone, CheckCircle2, XCircle, CreditCard, Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useActivityNotifications, useHireNotifications, useCollabNotifications } from "@/hooks/useNotifications";
import { useUnreadJobMatchCount } from "@/hooks/useJobMatchNotifications";
import { JobMatchList } from "@/components/notifications/JobMatchList";
import { useAdApplicationNotifications } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useUpdateCollabStatus } from "@/hooks/useCollabRequests";
import { useNotifications as useInbox } from "@/core/notifications";
import InboxList from "@/components/notifications/InboxList";
import SeoHead from "@/components/SeoHead";

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "เมื่อสักครู่";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชม.ที่แล้ว`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString("th-TH");
};

const ActorAvatar = ({ name, avatar }: { name: string; avatar: string }) =>
  avatar ? (
    <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
  ) : (
    <div className="w-11 h-11 rounded-full bg-gradient-brand text-white flex items-center justify-center font-medium shrink-0">
      {name[0]}
    </div>
  );

const Empty = ({ icon: Icon, text }: { icon: typeof Bell; text: string }) => (
  <div className="text-center py-16 text-muted-foreground">
    <Icon className="w-10 h-10 mx-auto mb-2 opacity-50" />
    <p className="text-sm">{text}</p>
  </div>
);

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("inbox");
  const inbox = useInbox(user?.id);
  const { data: activity = [], isLoading: la } = useActivityNotifications();
  const { data: hires = [], isLoading: lh } = useHireNotifications();
  const { data: collabs = [], isLoading: lc } = useCollabNotifications();
  const { data: unreadMatches = 0 } = useUnreadJobMatchCount();
  const updateCollab = useUpdateCollabStatus();
  const { data: adNotifs = [], isLoading: lad } = useAdApplicationNotifications();

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/notifications");
  }, [loading, user, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-app-ambient pb-24 lg:pb-8">
      <SeoHead title="การแจ้งเตือน" path="/notifications" noindex />
      <header className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <h1 className="font-medium text-lg"><span className="text-gradient">การแจ้งเตือน</span></h1>
          <span className="w-12" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-5">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-secondary/60 rounded-full p-1 h-11">
            <TabsTrigger value="inbox" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1 text-xs px-1.5">
              <Inbox className="w-3.5 h-3.5" /> <span className="hidden sm:inline">กล่อง</span>
              {inbox.unreadCount > 0 && (
                <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{inbox.unreadCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="matches" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1 text-xs px-1.5">
              <Sparkles className="w-3.5 h-3.5" /> <span className="hidden sm:inline">งานที่ใช่</span>
              {unreadMatches > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{unreadMatches}</span>}
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1 text-xs px-1.5">
              <Bell className="w-3.5 h-3.5" /> <span className="hidden sm:inline">กิจกรรม</span>
              {activity.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{activity.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="hire" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1 text-xs px-1.5">
              <BriefcaseIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">จ้างงาน</span>
              {hires.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{hires.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="collab" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1 text-xs px-1.5">
              <Handshake className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Collab</span>
              {collabs.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{collabs.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="ads" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm gap-1 text-xs px-1.5">
              <Megaphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">โฆษณา</span>
              {adNotifs.length > 0 && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">{adNotifs.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-5">
            <InboxList
              items={inbox.items}
              loading={inbox.loading}
              onOpen={(n) => {
                if (!n.is_read) inbox.markRead(n.id);
              }}
              onDismiss={inbox.dismiss}
            />
          </TabsContent>

          <TabsContent value="matches" className="mt-5">
            <JobMatchList />
          </TabsContent>

          <TabsContent value="activity" className="mt-5 space-y-2">
            {la ? (
              <div className="text-center py-10 text-muted-foreground text-sm">กำลังโหลด...</div>
            ) : activity.length === 0 ? (
              <Empty icon={Heart} text="ยังไม่มีกิจกรรมบนผลงานของคุณ" />
            ) : (
              activity.map((n) => {
                const Icon = n.kind === "like" ? Heart : n.kind === "bookmark" ? Bookmark : MessageCircle;
                const verb = n.kind === "like" ? "ถูกใจผลงาน" : n.kind === "bookmark" ? "บันทึกผลงาน" : "คอมเมนต์ผลงาน";
                const color = n.kind === "like" ? "text-destructive" : n.kind === "bookmark" ? "text-primary" : "text-foreground";
                return (
                  <button
                    key={n.id}
                    onClick={() => navigate(`/project/${n.projectId}`)}
                    className="w-full flex items-start gap-3 p-3 rounded-2xl hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="relative shrink-0">
                      <ActorAvatar name={n.actorName} avatar={n.actorAvatar} />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-background flex items-center justify-center ${color}`}>
                        <Icon className={`w-3 h-3 ${n.kind === "like" ? "fill-destructive" : ""}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{n.actorName}</span>{" "}
                        <span className="text-muted-foreground">{verb}</span>{" "}
                        <span className="font-medium">"{n.projectTitle}"</span>
                      </p>
                      {n.content && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">"{n.content}"</p>}
                      <p className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {n.projectCover && (
                      <img src={n.projectCover} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="hire" className="mt-5 space-y-2">
            {lh ? (
              <div className="text-center py-10 text-muted-foreground text-sm">กำลังโหลด...</div>
            ) : hires.length === 0 ? (
              <Empty icon={BriefcaseIcon} text="ยังไม่มีคำขอจ้างงาน" />
            ) : (
              hires.map((h) => (
                <div key={h.id} className="p-4 rounded-2xl glass-panel hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-brand text-white flex items-center justify-center">
                        <BriefcaseIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{h.clientName}</p>
                        <p className="text-[11px] text-muted-foreground">{h.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-secondary text-foreground/80">{h.status}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">สนใจจ้าง <span className="font-medium">"{h.projectTitle}"</span></p>
                  {h.message && <p className="text-xs text-muted-foreground line-clamp-3">{h.message}</p>}
                  <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                    <span>{timeAgo(h.createdAt)}</span>
                    {h.budgetAmount && <span className="text-primary font-medium">฿{h.budgetAmount.toLocaleString("th-TH")}</span>}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="collab" className="mt-5 space-y-2">
            {lc ? (
              <div className="text-center py-10 text-muted-foreground text-sm">กำลังโหลด...</div>
            ) : collabs.length === 0 ? (
              <Empty icon={Handshake} text="ยังไม่มีคำขอร่วมงาน" />
            ) : (
              collabs.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl glass-panel hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <ActorAvatar name={c.senderName} avatar={c.senderAvatar} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <button onClick={() => navigate(`/u/${c.senderId}`)} className="font-semibold text-sm text-foreground hover:text-primary">
                          {c.senderName}
                        </button>
                        <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-secondary text-foreground/80">{c.status}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{timeAgo(c.createdAt)}</p>
                    </div>
                  </div>
                  {c.collabTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {c.collabTypes.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">{c.message}</p>
                  {c.timeline && <p className="text-xs text-muted-foreground mt-1">ช่วงเวลา: {c.timeline}</p>}
                  {c.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateCollab.mutate({ id: c.id, status: "interested" })}
                        className="flex-1 py-2 rounded-full bg-gradient-brand text-white text-xs font-medium hover:opacity-90"
                      >
                        สนใจร่วมงาน
                      </button>
                      <button
                        onClick={() => updateCollab.mutate({ id: c.id, status: "passed" })}
                        className="flex-1 py-2 rounded-full bg-secondary text-foreground text-xs font-medium hover:bg-accent"
                      >
                        ผ่านไปก่อน
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="ads" className="mt-5 space-y-2">
            {lad ? (
              <div className="text-center py-10 text-muted-foreground text-sm">กำลังโหลด...</div>
            ) : adNotifs.length === 0 ? (
              <Empty icon={Megaphone} text="ยังไม่มีอัปเดตเกี่ยวกับโฆษณาของคุณ" />
            ) : (
              adNotifs.map((n) => {
                const meta =
                  n.status === "approved"
                    ? { Icon: CheckCircle2, color: "text-emerald-600", verb: "อนุมัติแล้ว · กำลังแสดง" }
                    : n.status === "rejected"
                    ? { Icon: XCircle, color: "text-red-600", verb: "ถูกปฏิเสธ" }
                    : { Icon: CreditCard, color: "text-blue-600", verb: "ชำระเงินแล้ว · รออนุมัติ" };
                const { Icon } = meta;
                return (
                  <button
                    key={n.id}
                    onClick={() => navigate("/advertise")}
                    className="w-full flex items-start gap-3 p-3 rounded-2xl glass-panel hover:border-primary/30 transition-colors text-left"
                  >
                    {n.imageUrl ? (
                      <img src={n.imageUrl} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Megaphone className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                        <span className={`text-sm font-medium ${meta.color}`}>{meta.verb}</span>
                      </div>
                      <p className="text-sm text-foreground mt-0.5 truncate">"{n.adTitle}"</p>
                      {n.adminNote && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">หมายเหตุ: {n.adminNote}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.reviewedAt ?? n.updatedAt)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
