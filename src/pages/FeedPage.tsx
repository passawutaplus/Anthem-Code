import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, SearchX } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ProjectGridSkeleton from "@/components/ui/ProjectGridSkeleton";
import { useProfilesByIds } from "@/core/profiles";


import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FilterChips from "@/components/FilterChips";
import FeedModeDropdown from "@/components/feed/FeedModeDropdown";
import ProjectCard from "@/components/ProjectCard";
import AdCard from "@/components/feed/AdCard";
import { useActiveAds } from "@/hooks/useAds";
import { interleaveAds } from "@/lib/interleaveAds";
import HireDialog from "@/components/HireDialog";
import CollabDialog from "@/components/CollabDialog";
import ProfileButton from "@/components/ProfileButton";
import FeedHero from "@/components/feed/FeedHero";
import FeedModeToggle, { type FeedMode } from "@/components/feed/FeedModeToggle";
import DesignerGrid from "@/components/feed/DesignerGrid";
import { FilterPanel, type DesignerSort } from "@/components/feed/DesignerToolbar";
import StudioGrid from "@/components/feed/StudioGrid";
import { useDesigners } from "@/hooks/useDesigners";

import { categories as allCategories, type Category, type Project, type ProjectStatus, type SpecialFilter } from "@/data/projectTypes";
import {
  usePublishedProjects,
  useTopProjects,
  useFollowingProjects,
  useForYouProjects,
  type DBProject,
} from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useAuthDialog } from "@/stores/authDialogStore";
import { isCategoryAllowed } from "@/lib/cookieConsent";

type FeedMode2 = "Explore" | SpecialFilter;
const requiresAuth = (m: FeedMode2) => m === "For You" || m === "Following";

const CATEGORY_CHIPS: Category[] = allCategories.filter((c) => c !== "Explore");

const FeedPage = (_props: { onMyPortClick: () => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [feedMode, setFeedModeRaw] = useState<FeedMode2>("Explore");
  const [category, setCategory] = useState<Category | "All">("All");
  const [mode, setMode] = useState<FeedMode>(() => {
    if (typeof window === "undefined") return "projects";
    if (!isCategoryAllowed("functional")) return "projects";
    return (localStorage.getItem("feed-mode") as FeedMode) || "projects";
  });
  const [hireOpen, setHireOpen] = useState(false);
  const [hireProject, setHireProject] = useState("");
  const [hireFreelancerId, setHireFreelancerId] = useState<string | undefined>();
  const [collabOpen, setCollabOpen] = useState(false);
  const [collabTarget, setCollabTarget] = useState<{ recipientId?: string; recipientName: string; projectId?: string; projectTitle?: string }>({ recipientName: "" });
  const [designerSort, setDesignerSort] = useState<DesignerSort>("newest");
  const [designerCats, setDesignerCats] = useState<string[]>([]);
  const [designerTools, setDesignerTools] = useState<string[]>([]);

  const { data: designersAll = [] } = useDesigners();
  const designerToolOptions = useMemo(() => {
    const set = new Set<string>();
    designersAll.forEach((d) => d.projects.forEach((p) => (p.tools ?? []).forEach((t) => t && set.add(t))));
    return Array.from(set).sort();
  }, [designersAll]);
  const designerCatOptions = useMemo(() => {
    const set = new Set<string>();
    designersAll.forEach((d) => d.projects.forEach((p) => p.category && set.add(p.category)));
    return Array.from(set).sort();
  }, [designersAll]);

  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  const changeMode = (m: FeedMode) => {
    setMode(m);
    if (isCategoryAllowed("functional")) localStorage.setItem("feed-mode", m);
  };

  const setFeedMode = (m: FeedMode2) => {
    if (m === "Collections") {
      if (user) navigate("/collections");
      else useAuthDialog.getState().openSignup();
      return;
    }
    setFeedModeRaw(m);
  };

  const published = usePublishedProjects();
  const top = useTopProjects();
  const following = useFollowingProjects(feedMode === "Following" ? user?.id : undefined);
  const forYou = useForYouProjects(feedMode === "For You" ? user?.id : undefined);

  const projectsLoading =
    feedMode === "Top 1"
      ? top.isLoading
      : feedMode === "Following"
        ? following.isLoading
        : feedMode === "For You"
          ? forYou.isLoading
          : published.isLoading;

  const sourceData: DBProject[] = useMemo(() => {
    switch (feedMode) {
      case "Top 1":      return (top.data ?? []) as DBProject[];
      case "Following":  return (following.data ?? []) as DBProject[];
      case "For You":    return (forYou.data ?? []) as DBProject[];
      case "Newest":     return (published.data ?? []) as DBProject[];
      default:           return (published.data ?? []) as DBProject[];
    }
  }, [feedMode, published.data, top.data, following.data, forYou.data]);

  const ownerIds = useMemo(
    () => Array.from(new Set(sourceData.map((p) => p.owner_id).filter(Boolean))),
    [sourceData]
  );

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

  const projects: Project[] = useMemo(() => {
    const mapped: Project[] = sourceData.map((p) => {
      const o = ownersMap[p.owner_id];
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
        allowHire: (p as any).allow_hire ?? true,
        allowCollab: (p as any).allow_collab ?? true,
        licenseType: (p as { license_type?: string }).license_type ?? "all_rights",
      };
    });
    if (feedMode === "Newest") {
      return [...mapped].sort(
        (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
      );
    }
    return mapped;
  }, [sourceData, ownersMap, feedMode]);

  const filtered = projects.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const needsLogin = requiresAuth(feedMode) && !user;
  const { data: ads = [] } = useActiveAds(12);
  const feedItems = useMemo(() => interleaveAds(filtered, ads, { minGap: 8, maxGap: 14 }), [filtered, ads]);

  const handleHireDesigner = (recipientId: string, recipientName: string) => {
    setHireFreelancerId(recipientId);
    setHireProject(recipientName);
    setHireOpen(true);
  };

  const handleCollabDesigner = (recipientId: string, recipientName: string) => {
    setCollabTarget({ recipientId, recipientName });
    setCollabOpen(true);
  };

  return (
    <div className="min-h-screen bg-app-ambient pb-24 lg:pb-0">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 2xl:px-10 pt-4 py-4 space-y-4">
        <FeedHero />

        <div className="sticky top-0 z-30 -mx-3 sm:-mx-4 lg:-mx-6 2xl:-mx-10 px-3 sm:px-4 lg:px-6 2xl:px-10 py-3 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder={mode === "designers" ? "ค้นหาดีไซเนอร์ / แนวงาน เช่น logo, ux, branding" : "ค้นหาผลงานหรือผู้สร้าง"}
                filterCount={(designerSort !== "newest" ? 1 : 0) + (mode === "designers" ? designerTools.length : 0)}
                filterContent={
                  <FilterPanel
                    sort={designerSort}
                    onSort={setDesignerSort}
                    tools={mode === "designers" ? designerToolOptions : []}
                    selectedTools={designerTools}
                    onToggleTool={(t) => setDesignerTools((l) => toggle(l, t))}
                    showTools={mode === "designers"}
                    onClear={() => { setDesignerSort("newest"); setDesignerTools([]); }}
                  />
                }
              />
            </div>
            <div className="shrink-0">
              <ProfileButton />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FeedModeDropdown value={feedMode} onChange={setFeedMode} />
            <div className="flex-1 min-w-0 overflow-x-auto hidden sm:block">
              <FilterChips
                categories={["All" as Category, ...CATEGORY_CHIPS]}
                selected={category}
                onSelect={(c) => setCategory(c as Category | "All")}
              />
            </div>
            <div className="ml-auto sm:ml-0">
              <FeedModeToggle value={mode} onChange={changeMode} />
            </div>
          </div>
          <div className="sm:hidden -mx-1 px-1 overflow-x-auto">
            <FilterChips
              categories={["All" as Category, ...CATEGORY_CHIPS]}
              selected={category}
              onSelect={(c) => setCategory(c as Category | "All")}
            />
          </div>
        </div>


        <div>
          {needsLogin ? (
            <div className="text-center py-16 glass-panel rounded-2xl">
              <p className="text-foreground font-medium mb-2 thai-display">เข้าสู่ระบบเพื่อใช้หมวด "{feedMode}"</p>
              <p className="text-sm text-muted-foreground mb-4 thai-body">ระบบจะแนะนำผลงานที่เหมาะกับคุณ</p>
              <Button onClick={() => useAuthDialog.getState().openSignup()} className="rounded-full bg-gradient-brand text-white hover:opacity-90">
                <LogIn className="w-4 h-4 mr-1.5" /> เข้าสู่ระบบ
              </Button>
            </div>
          ) : mode === "designers" ? (
            <DesignerGrid
              onHire={handleHireDesigner}
              onCollab={handleCollabDesigner}
              search={search}
              sort={designerSort}
              categories={designerCats}
              tools={designerTools}
            />
          ) : mode === "studios" ? (
            <StudioGrid search={search} />
          ) : projectsLoading ? (
            <ProjectGridSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                {feedItems.map((item) =>
                  item.kind === "ad" ? (
                    <AdCard key={item.key} ad={item.data} />
                  ) : (
                    <ProjectCard
                      key={item.key}
                      project={item.data}
                      onHireClick={(title) => {
                        setHireFreelancerId(item.data.ownerId);
                        setHireProject(title);
                        setHireOpen(true);
                      }}
                      onCollabClick={(title) => {
                        setCollabTarget({
                          recipientId: item.data.ownerId,
                          recipientName: item.data.owner,
                          projectId: item.data.id,
                          projectTitle: title,
                        });
                        setCollabOpen(true);
                      }}
                    />
                  )
                )}
              </div>

              {!projectsLoading && filtered.length === 0 && (
                <EmptyState
                  icon={SearchX}
                  title="ไม่พบผลงานที่ตรงกับตัวกรอง"
                  description={
                    feedMode === "Following"
                      ? "ติดตามดีไซเนอร์ที่ชอบ แล้วกลับมาดูผลงานล่าสุดของพวกเขาที่นี่"
                      : search
                        ? `ลองคำอื่น หรือเปลี่ยนหมวดหมู่ — ไม่มีผลลัพธ์สำหรับ "${search}"`
                        : "ลองเปลี่ยนหมวดหมู่หรือโหมดฟีด (เช่น Top 1 / Newest)"
                  }
                  action={
                    search || category !== "All" ? (
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setSearch("");
                          setCategory("All");
                        }}
                      >
                        ล้างตัวกรอง
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

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

export default FeedPage;
