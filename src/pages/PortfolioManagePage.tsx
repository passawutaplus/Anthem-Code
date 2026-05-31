import BriefcaseIcon from "../components/icons/BriefcaseIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, Globe, Eye, Heart, Mail, ArrowLeft, Settings, Phone, ExternalLink, Check, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";
import ManageProjectCard from "@/components/ManageProjectCard";
import SearchBar from "@/components/SearchBar";
import CollabRequestsSection from "@/components/CollabRequestsSection";
import { projects as mockProjects, type Project, type ProjectStatus, type Category } from "@/data/mockData";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useHiringRequests, type HiringStatusDB } from "@/hooks/useHiringRequests";
import { useAcceptRequest, useRejectRequest, useFindConversationByRequest } from "@/hooks/useChat";
import { useDeleteProject, useMyProjects } from "@/hooks/useProjects";
import { useEffect, useMemo } from "react";
import { timeAgoTH } from "@/lib/format";

type ProjectTab = "ทั้งหมด" | "Published" | "Draft" | "Private";
type HiringTab = HiringStatusDB | "ทั้งหมด";

const STATUSES: HiringStatusDB[] = ["ใหม่", "ที่ต้องตอบ", "ตอบรับ", "ปฏิเสธ", "ติดต่อแล้ว", "ปิดแล้ว"];

const PortfolioManagePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: requests = [] } = useHiringRequests(user?.id);
  const accept = useAcceptRequest();
  const reject = useRejectRequest();
  const findConv = useFindConversationByRequest();
  const { data: dbProjects = [] } = useMyProjects(user?.id);
  const deleteProject = useDeleteProject();

  const [projectSearch, setProjectSearch] = useState("");
  const [projectTab, setProjectTab] = useState<ProjectTab>("ทั้งหมด");
  const [hiringTab, setHiringTab] = useState<HiringTab>("ที่ต้องตอบ");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/portfolio");
  }, [authLoading, user, navigate]);

  const myProjects: Project[] = useMemo(() => {
    const mapped: Project[] = dbProjects.map((p) => ({
      id: p.id,
      title: p.title,
      image: p.cover_url || (p.gallery_urls?.[0] ?? ""),
      gallery: p.gallery_urls ?? [],
      category: (p.category as Category) ?? "Graphic",
      owner: "You",
      ownerAvatar: "",
      likes: p.likes,
      views: p.views,
      comments: 0,
      bookmarked: false,
      status: p.status as ProjectStatus,
      publishedDate: p.created_at,
      tools: p.tools ?? [],
      price: p.price_thb ? `฿${p.price_thb.toLocaleString("th-TH")}` : undefined,
    }));
    const mockMine = mockProjects.filter((p) => p.owner === "You");
    return [...mapped, ...mockMine];
  }, [dbProjects]);

  const totalViews = myProjects.reduce((s, p) => s + p.views, 0);
  const totalLikes = myProjects.reduce((s, p) => s + p.likes, 0);
  const publishedCount = myProjects.filter((p) => p.status === "Published").length;

  const filteredProjects = myProjects.filter((p) => {
    const matchTab = projectTab === "ทั้งหมด" || p.status === projectTab;
    const matchSearch = !projectSearch || p.title.toLowerCase().includes(projectSearch.toLowerCase());
    return matchTab && matchSearch;
  });

  const filteredHiring = hiringTab === "ทั้งหมด" ? requests : requests.filter((r) => r.status === hiringTab);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: requests.filter((r) => r.status === s).length }), {} as Record<HiringStatusDB, number>);

  const projectTabs: ProjectTab[] = ["ทั้งหมด", "Published", "Draft", "Private"];

  return (
    <div className="min-h-screen bg-app-ambient">
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
          <button onClick={() => navigate("/portfolio")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> กลับโปรไฟล์
          </button>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-medium text-foreground">จัดการผลงาน</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://solofreelancer.com", "_blank", "noopener,noreferrer")}
                className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <ExternalLink className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Solo Freelancer</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/settings")} className="rounded-full">
                <Settings className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">ตั้งค่า</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">จัดการผลงานและคำขอจ้างงานจากลูกค้า</p>
          <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 px-6"
            onClick={() => navigate("/portfolio/new")}>
            <Plus className="w-4 h-4 mr-2" /> เพิ่มผลงาน
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <StatsCard label="ทั้งหมด" value={myProjects.length} icon={LayoutGrid} />
          <StatsCard label="เผยแพร่" value={publishedCount} icon={Globe} accent />
          <StatsCard label="ยอดเข้าชม" value={totalViews} icon={Eye} />
          <StatsCard label="ถูกใจ" value={totalLikes} icon={Heart} accent />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-primary"><Mail className="w-5 h-5" strokeWidth={2.25} /></div>
            <div>
              <h2 className="font-medium text-foreground">คำขอจ้างงาน</h2>
              <p className="text-xs text-muted-foreground">ลูกค้าที่ส่งคำขอจ้างงานมายังคุณ — เปลี่ยนสถานะเพื่อติดตาม</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {([...STATUSES, "ทั้งหมด"] as HiringTab[]).map((s) => (
              <button key={s} onClick={() => setHiringTab(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  hiringTab === s ? "bg-primary text-primary-foreground" : "bg-card text-secondary-foreground border border-border hover:bg-secondary"
                }`}>
                {s} {s !== "ทั้งหมด" && counts[s] !== undefined ? `(${counts[s]})` : ""}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredHiring.map((req) => {
              const isPending = req.status === "ใหม่" || req.status === "ที่ต้องตอบ";
              const isAccepted = req.status === "ตอบรับ" || req.status === "ติดต่อแล้ว";

              const handleAccept = async () => {
                if (!user) return;
                try {
                  const convId = await accept.mutateAsync({
                    kind: "hire",
                    requestId: req.id,
                    clientId: req.client_id ?? user.id,
                    freelancerId: req.freelancer_id,
                    projectId: null,
                    projectTitle: req.project_title,
                  });
                  toast.success("รับงานนี้แล้ว เริ่มประสานงานกับลูกค้าได้เลย");
                  navigate(`/chat/${convId}`);
                } catch (e: any) {
                  toast.error(e?.message ?? "ดำเนินการไม่สำเร็จ");
                }
              };
              const handleReject = async () => {
                try {
                  await reject.mutateAsync({ kind: "hire", requestId: req.id });
                  toast.success("ปฏิเสธคำขอแล้ว");
                } catch (e: any) {
                  toast.error(e?.message ?? "ดำเนินการไม่สำเร็จ");
                }
              };
              const openChat = async () => {
                const id = await findConv("hire", req.id);
                if (id) navigate(`/chat/${id}`);
                else toast.error("ไม่พบห้องสนทนา");
              };

              return (
                <div key={req.id} className="rounded-xl glass-panel p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(var(--chat-hire))] flex items-center justify-center shrink-0 text-white font-medium text-sm">
                      {req.client_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground text-sm">{req.client_name}</span>
                        <Badge variant="outline" className="text-xs">{req.status}</Badge>
                        <Badge variant="outline" className="text-xs bg-[hsl(var(--chat-hire-soft))] text-[hsl(var(--chat-hire))] border-[hsl(var(--chat-hire))/0.2]">งบ {req.budget}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        อ้างอิง: <span className="text-foreground font-medium">{req.project_title}</span>
                      </p>
                      <p className="text-sm text-foreground/80 mt-2 line-clamp-2">{req.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span>⏱ {timeAgoTH(req.created_at)}</span>
                        <a href={`mailto:${req.email}`} className="flex items-center gap-1 hover:text-[hsl(var(--chat-hire))]"><Mail className="w-3 h-3" />{req.email}</a>
                        {req.phone && <a href={`tel:${req.phone}`} className="flex items-center gap-1 hover:text-[hsl(var(--chat-hire))]"><Phone className="w-3 h-3" />{req.phone}</a>}
                        {req.deadline && <span>⏰ {req.deadline}</span>}
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-border/50 flex-wrap">
                        {isPending && (
                          <>
                            <Button size="sm" variant="ghost" onClick={handleReject} disabled={reject.isPending} className="rounded-full h-8 text-xs text-muted-foreground hover:text-destructive">
                              <X className="w-3.5 h-3.5 mr-1" /> ปฏิเสธ
                            </Button>
                            <Button size="sm" onClick={handleAccept} disabled={accept.isPending} className="rounded-full h-8 text-xs bg-[hsl(var(--chat-hire))] text-white hover:bg-[hsl(var(--chat-hire))/0.9]">
                              <Check className="w-3.5 h-3.5 mr-1" /> รับงานนี้ & เปิดแชท
                            </Button>
                          </>
                        )}
                        {!isPending && isAccepted && (
                          <Button size="sm" onClick={openChat} className="rounded-full h-8 text-xs bg-[hsl(var(--chat-hire))] text-white hover:opacity-90">
                            <MessageCircle className="w-3.5 h-3.5 mr-1" /> เปิดห้องสนทนา
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredHiring.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">ยังไม่มีคำขอจ้างงานในสถานะนี้</p>
            )}
          </div>
        </div>

        <CollabRequestsSection />


        <div className="space-y-3">
          <SearchBar placeholder="ค้นหาผลงาน..." value={projectSearch} onChange={setProjectSearch} />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {projectTabs.map((tab) => (
              <button key={tab} onClick={() => setProjectTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  projectTab === tab ? "bg-primary text-primary-foreground" : "bg-card text-secondary-foreground border border-border hover:bg-secondary"
                }`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {filteredProjects.map((p) => {
              const isDb = dbProjects.some((d) => d.id === p.id);
              return (
                <ManageProjectCard key={p.id} project={p} editable={isDb}
                  onDelete={(id) => {
                    if (!isDb) { toast.info("ลบได้เฉพาะผลงานที่บันทึกในระบบ"); return; }
                    deleteProject.mutate(id, {
                      onSuccess: () => toast.success("ลบผลงานแล้ว"),
                      onError: (e) => toast.error(e instanceof Error ? e.message : "ลบไม่สำเร็จ"),
                    });
                  }}
                />
              );
            })}
            {filteredProjects.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">ไม่พบผลงาน</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioManagePage;
