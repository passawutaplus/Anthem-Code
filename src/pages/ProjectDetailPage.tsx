import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Flag, Share2 } from "lucide-react";
import ReportDialog from "@/components/report/ReportDialog";
import { so1oUrl, trackCrossLink } from "@/lib/crossLink";
import SaveToCollectionPopover from "@/components/collections/SaveToCollectionPopover";
import { Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projectTypes";
import HireDialog from "@/components/HireDialog";
import CollabDialog from "@/components/CollabDialog";
import CommentSection from "@/components/CommentSection";
import ProjectSidePanel from "@/components/ProjectSidePanel";
import ProjectCreditsBlock from "@/components/ProjectCreditsBlock";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageActionBar from "@/components/project/ImageActionBar";
import ImageLightbox from "@/components/project/ImageLightbox";
import { useQuery } from "@tanstack/react-query";

import { useProject } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { isCategoryAllowed } from "@/lib/cookieConsent";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: dbProject, isLoading } = useProject(id);
  const [mockProject, setMockProject] = useState<Project | undefined>();

  useEffect(() => {
    if (dbProject || isLoading || !id) {
      setMockProject(undefined);
      return;
    }
    let cancelled = false;
    import("@/data/mockData").then((mod) => {
      if (!cancelled) setMockProject(mod.projects.find((p) => p.id === id));
    });
    return () => {
      cancelled = true;
    };
  }, [dbProject, isLoading, id]);

  const isMockProject = !dbProject && !isLoading && !!mockProject;

  // Track view: per-user history (for "For You" feed) + global counter (for stats)
  useEffect(() => {
    if (!dbProject?.id) return;
    const analyticsOk = isCategoryAllowed("analytics");
    // Global counter — once per session per project (requires analytics consent)
    const key = `viewed:${dbProject.id}`;
    if (analyticsOk && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      supabase.rpc("increment_project_view", { _project_id: dbProject.id }).then(() => {}, () => {});
    }
    // Per-user history (only when signed-in)
    if (user?.id && analyticsOk) {
      supabase
        .from("project_views")
        .upsert(
          { user_id: user.id, project_id: dbProject.id, viewed_at: new Date().toISOString() },
          { onConflict: "user_id,project_id" }
        )
        .then(() => {}, () => {});
    }
  }, [user?.id, dbProject?.id]);


  // Fetch owner profile for DB projects
  const { data: ownerProfile } = useQuery({
    queryKey: ["profile", dbProject?.owner_id],
    enabled: !!dbProject?.owner_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, username")
        .eq("id", dbProject!.owner_id)
        .maybeSingle();
      return data;
    },
  });

  // Comments count
  const { data: commentsCount = 0 } = useQuery({
    queryKey: ["comments-count", id],
    enabled: !!id && !isMockProject,
    queryFn: async () => {
      const { count } = await supabase
        .from("project_comments")
        .select("id", { count: "exact", head: true })
        .eq("project_id", id!);
      return count ?? 0;
    },
  });

  const project = dbProject
    ? {
        id: dbProject.id,
        title: dbProject.title,
        gallery:
          dbProject.gallery_urls && dbProject.gallery_urls.length > 0
            ? dbProject.gallery_urls
            : dbProject.cover_url
              ? [dbProject.cover_url]
              : [],
        category: dbProject.category,
        ownerId: dbProject.owner_id,
        owner: ownerProfile?.display_name || "ฟรีแลนซ์",
        ownerAvatar: ownerProfile?.avatar_url ?? "",
        likes: dbProject.likes,
        views: dbProject.views,
        bookmarked: false,
        publishedDate: dbProject.created_at,
        tools: dbProject.tools ?? [],
        tags: dbProject.tags ?? [],
        price: dbProject.price_thb ? `฿${dbProject.price_thb.toLocaleString("th-TH")}` : undefined,
        description: dbProject.description ?? "",
        allowHire: (dbProject as any).allow_hire ?? true,
        allowCollab: (dbProject as any).allow_collab ?? true,
      }
    : mockProject
      ? {
          id: mockProject.id,
          title: mockProject.title,
          gallery: mockProject.image ? [mockProject.image] : [],
          category: mockProject.category,
          ownerId: undefined as string | undefined,
          owner: mockProject.owner,
          ownerAvatar: "",
          likes: mockProject.likes,
          views: mockProject.views,
          bookmarked: mockProject.bookmarked,
          publishedDate: mockProject.publishedDate,
          tools: mockProject.tools ?? [],
          tags: [] as string[],
          price: mockProject.price as string | undefined,
          description: "",
          allowHire: true,
          allowCollab: true,
        }
      : null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project?.likes ?? 0);
  const [hireOpen, setHireOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);

  if (isLoading && !mockProject) {
    return <div className="min-h-screen bg-app-ambient flex items-center justify-center text-muted-foreground">กำลังโหลด...</div>;
  }
  if (!project) {
    return (
      <div className="min-h-screen bg-app-ambient flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">ไม่พบผลงานนี้</p>
          <Button onClick={() => navigate("/")}>กลับหน้าหลัก</Button>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("คัดลอกลิงก์แล้ว");
    } catch {
      toast.error("แชร์ไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-app-ambient">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <div className="flex items-center gap-1">
            <SaveToCollectionPopover projectId={dbProject?.id}>
              <Button variant="ghost" size="icon">
                <Layers3 className="w-5 h-5" />
              </Button>
            </SaveToCollectionPopover>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            {dbProject?.id && (
              <ReportDialog
                targetType="project"
                targetId={dbProject.id}
                targetOwnerId={dbProject.owner_id}
              >
                <Button variant="ghost" size="icon" aria-label="รายงานผลงาน">
                  <Flag className="w-5 h-5" />
                </Button>
              </ReportDialog>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10">
          {/* Left: Gallery */}
          {/* Left: Gallery */}
          <div className="space-y-4 min-w-0">
            {dbProject && (
              <ProjectCreditsBlock
                studioId={(dbProject as any).studio_id}
                creditedUserIds={(dbProject as any).credited_user_ids ?? []}
                ownerId={dbProject.owner_id}
              />
            )}
            {project.gallery.length > 0 ? (
              <GalleryWithLightbox images={project.gallery} project={project} />
            ) : (
              <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                ยังไม่มีรูปภาพ
              </div>
            )}
          </div>

          {/* Right: Side panel (sticky on desktop) */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <ProjectSidePanel
              projectId={dbProject?.id}
              title={project.title}
              category={project.category}
              ownerName={project.owner}
              ownerAvatar={project.ownerAvatar}
              ownerId={project.ownerId}
              publishedDate={project.publishedDate}
              description={project.description}
              tools={project.tools}
              tags={project.tags}
              price={project.price}
              views={project.views}
              likes={likeCount}
              commentsCount={commentsCount}
              liked={liked}
              onLike={handleLike}
              onHire={() => setHireOpen(true)}
              onCollab={() => setCollabOpen(true)}
              allowHire={project.allowHire}
              allowCollab={project.allowCollab}
            />
          </div>
        </div>

        {/* Cross-link → So1o: draft a quote from this project */}
        <div className="mt-10 lg:mt-14 max-w-3xl">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">สนใจจ้างงานนี้?</p>
              <p className="text-sm text-muted-foreground">
                สร้างใบเสนอราคาทันทีบน So1o — ตัวช่วยจัดการงานสำหรับฟรีแลนซ์ของเรา
              </p>
            </div>
            <a
              href={so1oUrl("/quotes/new", {
                project_id: project.id,
                freelancer_id: project.ownerId,
                project_title: project.title,
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCrossLink({
                  source: "project_detail",
                  refId: project.id,
                  meta: { freelancer_id: project.ownerId },
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
            >
              สร้างใบเสนอราคา <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Comments full width below */}
        <div className="mt-10 lg:mt-14 max-w-3xl">
          <CommentSection projectId={project.id} isMockProject={isMockProject} />
        </div>
      </div>


      <HireDialog
        open={hireOpen}
        onOpenChange={setHireOpen}
        projectTitle={project.title}
        projectId={project.id}
        freelancerId={project.ownerId}
      />

      <CollabDialog
        open={collabOpen}
        onOpenChange={setCollabOpen}
        recipientId={project.ownerId}
        recipientName={project.owner}
        projectId={project.id}
        projectTitle={project.title}
      />
    </div>
  );
};


type GalleryProject = { id: string; title: string };
const GalleryWithLightbox = ({ images, project }: { images: string[]; project: GalleryProject }) => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  return (
    <>
      {images.map((src, i) => (
        <div key={src + i} className="relative group">
          <img
            src={src}
            alt={`${project.title} ${i + 1}`}
            onClick={() => setLightboxSrc(src)}
            className="w-full rounded-2xl border border-border/60 bg-card object-contain cursor-zoom-in"
            loading="lazy"
          />
          <ImageActionBar
            projectId={project.id}
            projectTitle={project.title}
            imageUrl={src}
            imageIndex={i}
          />
        </div>
      ))}
      <ImageLightbox
        src={lightboxSrc ?? ""}
        alt={project.title}
        open={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </>
  );
};

export default ProjectDetailPage;
