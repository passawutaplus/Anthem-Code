import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowLeft, Globe, Instagram, Facebook, MessageSquare, Flag, UserX } from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import FollowButton from "@/components/FollowButton";
import SupportButton from "@/components/gifting/SupportButton";
import ReportDialog from "@/components/report/ReportDialog";

import { useFollowState } from "@/hooks/useFollow";
import { usePublicCollections } from "@/hooks/useCollections";
import PortfolioGrid from "@/components/profile/PortfolioGrid";
import CollectionCard from "@/components/collections/CollectionCard";
import { safeHttpUrl } from "@/lib/safeUrl";
import { highlight } from "@/lib/highlight";
import { PROJECT_FEED_SELECT, PUBLIC_PROFILE_SELECT } from "@/lib/dbSelects";
import SeoHead from "@/components/SeoHead";
import { truncateDescription } from "@/lib/seo";


const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const { followers, following } = useFollowState(userId);
  const { data: collections = [] } = usePublicCollections(userId);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["public-profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(PUBLIC_PROFILE_SELECT)
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["public-projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_FEED_SELECT)
        .eq("owner_id", userId!)
        .eq("status", "Published")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });

  const topCategories = useMemo(() => {
    const counts = new Map<string, number>();
    (projects as any[]).forEach((p) => {
      if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
  }, [projects]);
  const recentProjects = useMemo(() => (projects as any[]).slice(0, 6), [projects]);

  if (isLoading) {
    return <PageLoader label="กำลังโหลดโปรไฟล์..." />;
  }
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <EmptyState
          icon={UserX}
          title="ไม่พบโปรไฟล์นี้"
          description="ลิงก์อาจหมดอายุ หรือผู้ใช้ปิดการแสดงผลแล้ว"
          action={
            <Button onClick={() => navigate("/")} className="rounded-full">
              กลับหน้าหลัก
            </Button>
          }
        />
      </div>
    );
  }

  const displayName = profile.display_name || profile.username || "ครีเอเตอร์";
  const seoDesc = truncateDescription(
    profile.bio || `ดูพอร์ตโฟลิโอและผลงานของ ${displayName} บน Anthem`,
  );

  return (
    <div className="min-h-screen bg-app-ambient">
      <SeoHead
        title={displayName}
        description={seoDesc}
        path={`/u/${userId}`}
        image={profile.avatar_url ?? undefined}
        type="profile"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: displayName,
          description: profile.bio || undefined,
          image: profile.avatar_url || undefined,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        }}
      />
      <div className="sticky top-0 z-20 glass-panel border-x-0 border-t-0 rounded-none">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="relative overflow-hidden rounded-3xl glass-panel p-6 md:p-10">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-brand opacity-40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-gradient-brand-soft blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white/70 shadow-lg" />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-brand flex items-center justify-center text-3xl font-medium text-white border-4 border-white/70 shadow-lg">
                {profile.display_name?.[0] ?? "?"}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-medium text-foreground">{highlight(profile.display_name, q)}</h1>
              {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
              {profile.role && <Badge className="mt-2 rounded-full glass-chip text-foreground border-0">{highlight(profile.role, q)}</Badge>}
              {profile.bio && <p className="text-sm text-foreground/80 mt-3 max-w-xl leading-6">{highlight(profile.bio, q)}</p>}

              {(profile.skills?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {profile.skills!.map((s: string) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {highlight(s, q)}
                    </span>
                  ))}
                </div>
              )}

              {topCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {topCategories.map((c) => (
                    <span key={c} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 mt-4 text-sm flex-wrap">
                {[
                  { label: "ผลงาน", value: projects.length },
                  { label: "ยอดดูรวม", value: projects.reduce((s: number, p: any) => s + (p.views ?? 0), 0) },
                  { label: "ผู้ติดตาม", value: followers },
                  { label: "กำลังติดตาม", value: following },
                ].map((s) => (
                  <div key={s.label} className="glass-chip rounded-2xl px-4 py-2">
                    <div className="font-medium text-foreground leading-tight">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>

              {(profile.website || profile.instagram || profile.facebook || profile.line_id) && (
                <div className="flex items-center gap-3 mt-4 text-muted-foreground">
                  {safeHttpUrl(profile.website) && (
                    <a href={safeHttpUrl(profile.website)} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Globe className="w-4 h-4" /></a>
                  )}
                  {profile.instagram && (
                    <a href={`https://instagram.com/${encodeURIComponent(profile.instagram)}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Instagram className="w-4 h-4" /></a>
                  )}
                  {safeHttpUrl(profile.facebook) && (
                    <a href={safeHttpUrl(profile.facebook)} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Facebook className="w-4 h-4" /></a>
                  )}
                  {profile.line_id && (
                    <span className="flex items-center gap-1 text-xs"><MessageSquare className="w-4 h-4" /> {profile.line_id}</span>
                  )}
                </div>
              )}

            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <FollowButton freelancerId={profile.id} />
              <SupportButton
                recipientId={profile.id}
                recipientName={profile.display_name ?? "ครีเอเตอร์"}
                recipientAvatar={profile.avatar_url ?? undefined}
                variant="compact"
              />
              <ReportDialog targetType="user" targetId={profile.id} targetOwnerId={profile.id}>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive gap-1">
                  <Flag className="w-3.5 h-3.5" /> รายงาน
                </Button>
              </ReportDialog>
            </div>
          </div>
        </div>
      </div>


      {/* Recent works */}
      {recentProjects.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">ผลงานล่าสุด</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {recentProjects.map((p: any) => (
              <button key={p.id} onClick={() => navigate(`/project/${p.id}`)} className="aspect-square rounded-xl overflow-hidden bg-muted relative group">
                {(p.cover_url || p.gallery_urls?.[0]) && (
                  <img src={p.cover_url || p.gallery_urls?.[0]} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                )}
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-[10px] text-white line-clamp-1">{highlight(p.title, q)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <Tabs defaultValue="works" className="mt-6">
          <TabsList className="glass-chip rounded-full p-1 h-auto">
            <TabsTrigger value="works" className="rounded-full data-[state=active]:bg-gradient-brand data-[state=active]:text-white">ผลงาน ({projects.length})</TabsTrigger>
            <TabsTrigger value="collections" className="rounded-full data-[state=active]:bg-gradient-brand data-[state=active]:text-white">คอลเลกชัน ({collections.length})</TabsTrigger>
            <TabsTrigger value="about" className="rounded-full data-[state=active]:bg-gradient-brand data-[state=active]:text-white">เกี่ยวกับ</TabsTrigger>
          </TabsList>

          <TabsContent value="works" className="mt-6">
            {projects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground glass-panel rounded-2xl">ยังไม่มีผลงานที่เผยแพร่</div>
            ) : (
              <PortfolioGrid projects={projects as any} />
            )}
          </TabsContent>

          <TabsContent value="collections" className="mt-6">
            {collections.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground glass-panel rounded-2xl">ยังไม่มีคอลเลกชันสาธารณะ</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {collections.map((c) => (
                  <CollectionCard key={c.id} collection={c} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="rounded-2xl glass-panel p-6 space-y-3">
              <h3 className="font-medium text-foreground">เกี่ยวกับ {profile.display_name}</h3>
              <p className="text-sm text-foreground/80 leading-7 whitespace-pre-wrap">
                {profile.bio || "ยังไม่มีข้อมูลแนะนำตัว"}
              </p>
              {profile.email && (
                <p className="text-sm text-muted-foreground pt-3 border-t border-white/30">
                  ติดต่อ: <span className="text-foreground">{profile.email}</span>
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


export default PublicProfilePage;
