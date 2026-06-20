import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PROJECT_FEED_SELECT } from "@/lib/dbSelects";
import { DRILL_DIFFICULTY_META } from "@/data/designDrillPrompts.vendored";
import { pickDailyDrill } from "@/lib/designDrillPick.vendored";
import { todayISO } from "@/lib/dailySeedPick.vendored";
import { portfolioDrillUrl, projectHasDailyDrillTag } from "@/lib/drillProject";
import PortfolioGrid from "@/components/profile/PortfolioGrid";
import { DrillDifficultyDot } from "@/components/drill/DrillDifficultyDot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/ui/PageLoader";

export default function DrillFeedPanel() {
  const date = todayISO();
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
      return (data ?? []).filter((p) => projectHasDailyDrillTag(p.tags as string[], date));
    },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl glass-panel p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary shrink-0" aria-hidden />
          <div>
            <p className="text-[11px] uppercase tracking-wider text-primary font-semibold">
              โจทย์ประจำวัน · {date}
            </p>
            <h2 className="text-base sm:text-lg font-bold">โจทย์เดียวกับ So1o ทุกคน</h2>
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
          <Link to={portfolioDrillUrl()}>ทำโจทย์วันนี้</Link>
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold">
          ผลงานวันนี้ {projects.length > 0 && `(${projects.length})`}
        </h2>
        {isLoading ? (
          <PageLoader label="กำลังโหลดผลงาน..." />
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12 rounded-2xl border border-dashed">
            ยังไม่มีใครโพสต์ผลงานวันนี้ — เป็นคนแรกที่อวดผลงาน!
          </p>
        ) : (
          <PortfolioGrid projects={projects as Parameters<typeof PortfolioGrid>[0]["projects"]} />
        )}
      </section>
    </div>
  );
}
