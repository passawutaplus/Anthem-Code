import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, SearchX, Wrench, Hash } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { StaggerGrid } from "@/components/motion/StaggerGrid";
import ProjectGridSkeleton from "@/components/ui/ProjectGridSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import HireDialog from "@/components/HireDialog";
import CollabDialog from "@/components/CollabDialog";
import { useProfilesByIds } from "@/core/profiles";
import { useProjectsByTag, useProjectsByTool } from "@/hooks/useExploreProjects";
import { decodeExploreParam, type ExploreKind } from "@/lib/exploreRoutes";
import type { Category, Project, ProjectStatus } from "@/data/projectTypes";
import type { DBProject } from "@/hooks/useProjects";

function mapToCard(projects: DBProject[], owners: Record<string, { name: string; avatar: string }>): Project[] {
  return projects.map((p) => {
    const o = owners[p.owner_id];
    return {
      id: p.id,
      title: p.title,
      image: p.cover_url || (p.gallery_urls?.[0] ?? ""),
      gallery: p.gallery_urls ?? [],
      category: (p.category as Category) ?? "Graphic",
      owner: o?.name ?? "ฟรีแลนซ์",
      ownerId: p.owner_id,
      ownerAvatar: o?.avatar ?? "",
      likes: p.likes,
      views: p.views,
      comments: 0,
      bookmarked: false,
      status: p.status as ProjectStatus,
      publishedDate: p.created_at,
      tools: p.tools ?? [],
      allowHire: (p as { allow_hire?: boolean }).allow_hire ?? true,
      allowCollab: (p as { allow_collab?: boolean }).allow_collab ?? true,
      licenseType: (p as { license_type?: string }).license_type ?? "all_rights",
    };
  });
}

const ExploreProjectsPage = () => {
  const navigate = useNavigate();
  const { kind, value: rawValue } = useParams<{ kind: string; value: string }>();
  const exploreKind = (kind === "tool" || kind === "tag" ? kind : null) as ExploreKind | null;
  const value = decodeExploreParam(rawValue);

  const byTool = useProjectsByTool(exploreKind === "tool" ? value : "");
  const byTag = useProjectsByTag(exploreKind === "tag" ? value : "");
  const { data: rows = [], isLoading } = exploreKind === "tool" ? byTool : byTag;

  const ownerIds = useMemo(() => Array.from(new Set(rows.map((p) => p.owner_id))), [rows]);
  const { data: ownersData } = useProfilesByIds(ownerIds);
  const ownersMap = useMemo(() => {
    const map: Record<string, { name: string; avatar: string }> = {};
    (ownersData?.list ?? []).forEach((p) => {
      map[p.user_id ?? p.id] = {
        name: p.display_name || p.username || "ฟรีแลนซ์",
        avatar: p.avatar_url || "",
      };
    });
    return map;
  }, [ownersData]);

  const projects = useMemo(() => mapToCard(rows, ownersMap), [rows, ownersMap]);

  const [hireOpen, setHireOpen] = useState(false);
  const [hireProject, setHireProject] = useState("");
  const [hireFreelancerId, setHireFreelancerId] = useState<string | undefined>();
  const [collabOpen, setCollabOpen] = useState(false);
  const [collabTarget, setCollabTarget] = useState<{
    recipientId?: string;
    recipientName: string;
    projectId?: string;
    projectTitle?: string;
  }>({ recipientName: "" });

  if (!exploreKind || !value) {
    return (
      <div className="min-h-screen bg-app-ambient flex items-center justify-center text-muted-foreground">
        ไม่พบหน้านี้
      </div>
    );
  }

  const Icon = exploreKind === "tool" ? Wrench : Hash;
  const title =
    exploreKind === "tool"
      ? `ผลงานที่ใช้ ${value}`
      : `ผลงานแท็ก #${value.replace(/^#+/, "")}`;

  return (
    <div className="min-h-screen bg-app-ambient pb-24">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            <h1 className="text-sm font-semibold truncate">{title}</h1>
          </div>
          <span className="ml-auto text-xs text-muted-foreground shrink-0">
            {isLoading ? "…" : `${projects.length} ผลงาน`}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <ProjectGridSkeleton />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="ยังไม่มีผลงาน"
            description={
              exploreKind === "tool"
                ? `ยังไม่มีผลงานเผยแพร่ที่ระบุเครื่องมือ "${value}"`
                : `ยังไม่มีผลงานที่ตรงกับแท็ก "${value}" — ลองแท็กอื่นใกล้เคียง`
            }
            action={
              <button
                onClick={() => navigate("/")}
                className="text-sm text-primary hover:underline"
              >
                กลับหน้าแรก
              </button>
            }
          />
        ) : (
          <StaggerGrid
            dense
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
          >
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onHireClick={(title) => {
                  setHireFreelancerId(p.ownerId);
                  setHireProject(title);
                  setHireOpen(true);
                }}
                onCollabClick={(title) => {
                  setCollabTarget({
                    recipientId: p.ownerId,
                    recipientName: p.owner,
                    projectId: p.id,
                    projectTitle: title,
                  });
                  setCollabOpen(true);
                }}
              />
            ))}
          </StaggerGrid>
        )}
      </div>

      <HireDialog open={hireOpen} onOpenChange={setHireOpen} projectTitle={hireProject} freelancerId={hireFreelancerId} />
      <CollabDialog
        open={collabOpen}
        onOpenChange={setCollabOpen}
        recipientId={collabTarget.recipientId}
        recipientName={collabTarget.recipientName}
        projectId={collabTarget.projectId}
        projectTitle={collabTarget.projectTitle}
      />
    </div>
  );
};

export default ExploreProjectsPage;
