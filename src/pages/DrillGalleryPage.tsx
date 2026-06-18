import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_FEED_SELECT } from "@/lib/dbSelects";
import {
  DRILL_DIFFICULTY_META,
} from "@/data/designDrillPrompts.vendored";
import {
  pickDailyDrill,
} from "@/lib/designDrillPick.vendored";
import { todayISO } from "@/lib/dailySeedPick.vendored";
import PortfolioGrid from "@/components/profile/PortfolioGrid";
import { DrillDifficultyDot } from "@/components/drill/DrillDifficultyDot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/ui/PageLoader";
import SeoHead from "@/components/SeoHead";
import { cn } from "@/lib/utils";
import { MOBILE_PAGE_BOTTOM_CLASS } from "@/lib/mobileLayout";

function projectHasDrillTags(tags: string[] | null | undefined, dailyTag: string): boolean {
  if (!tags?.length) return false;
  return tags.includes("So1oDrill") && tags.includes(dailyTag);
}

export default function DrillGalleryPage() {
  const [params] = useSearchParams();
  const date = params.get("date") ?? todayISO();
  const dailyTag = `DrillDaily${date}`;
  const drill = useMemo(() => pickDailyDrill(), []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["drill-gallery", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_FEED_SELECT)
        .eq("status", "Published")
        .contains("tags", ["So1oDrill"])
        .order("created_at", { ascending: false })
        .limit(120);
      if (error) throw error;
      return (data ?? []).filter((p) => projectHasDrillTags(p.tags as string[], dailyTag));
    },
  });

  return (
    <div className={cn("min-h-screen bg-app-ambient", MOBILE_PAGE_BOTTOM_CLASS)}>
      <SeoHead title="Design Drill Gallery" description="ผลงาน Design Drill ประจำวันจากช community Pixel100" />
      <div className="sticky top-0 z-30 glass-panel border-x-0 border-t-0 rounded-none">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="rounded-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-1" /> ฟีด
            </Link>
          </Button>
          <h1 className="text-sm font-bold">Design Drill Gallery</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        <section className="rounded-2xl glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-primary font-semibold">
                โจทย์ประจำวัน · {date}
              </p>
              <h2 className="text-lg font-bold">โจทย์เดียวกับ So1o ทุกคน</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{drill.meta.label}</Badge>
            <Badge variant="outline" className="gap-1.5">
              <DrillDifficultyDot difficulty={drill.difficulty} />
              {DRILL_DIFFICULTY_META[drill.difficulty].label}
            </Badge>
          </div>
          <p className="text-base font-semibold leading-snug">{drill.brief}</p>
          <Button asChild className="rounded-full">
            <Link to="/portfolio">ทำโจทย์วันนี้</Link>
          </Button>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">
            ผลงานวันนี้ {projects.length > 0 && `(${projects.length})`}
          </h2>
          {isLoading ? (
            <PageLoader label="กำลังโหลดผลงาน..." />
          ) : projects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12 rounded-2xl border border-dashed">
              ยังไม่มีใครโพสผลงานวันนี้ — เป็นคนแรกที่อวดผลงาน!
            </p>
          ) : (
            <PortfolioGrid projects={projects as Parameters<typeof PortfolioGrid>[0]["projects"]} />
          )}
        </section>
      </div>
    </div>
  );
}
