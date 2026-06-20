import { Skeleton } from "@/components/ui/skeleton";
import { useFeedStats } from "@/hooks/useFeedStats";
import { BRAND_CONCEPT } from "@/lib/brandConfig";
import { FadeUp } from "@/components/motion/FadeUp";
import TopProjectShowcase from "./TopProjectShowcase";

const formatNum = (n: number) => n.toLocaleString("th-TH");

const STATS = [
  { key: "designers", label: "ดีไซเนอร์" },
  { key: "projects", label: "ผลงาน" },
  { key: "collabs", label: "คอลแลป" },
  { key: "hires", label: "จ้างงาน" },
] as const;

const FeedHero = () => {
  const { data, isLoading } = useFeedStats();
  const s = data ?? { designers: 0, projects: 0, collabs: 0, hires: 0 };

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] ring-1 ring-border/35 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] min-h-[26rem] sm:min-h-[28rem] md:min-h-[19rem] lg:min-h-[21rem] -mx-1 sm:mx-0">
      <TopProjectShowcase />

      {/* Mobile: image top, copy anchored bottom */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none md:hidden bg-gradient-to-b from-transparent from-[18%] via-background/55 via-[48%] to-background to-[72%]"
        aria-hidden
      />
      {/* Desktop: fade left → right so artwork shows on the right half */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block bg-gradient-to-r from-background from-[0%] via-background/94 via-[34%] via-background/40 via-[48%] to-transparent to-[100%]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block bg-gradient-to-t from-black/[0.06] via-transparent to-transparent"
        aria-hidden
      />

      <FadeUp className="relative z-10 flex h-full min-h-[inherit] flex-col justify-end md:justify-center gap-6 px-5 pb-8 pt-[11.5rem] sm:px-7 sm:pb-9 sm:pt-[12rem] md:max-w-[min(100%,30rem)] md:px-8 md:py-10 lg:max-w-[28rem] lg:px-10 lg:py-12">
        <div className="space-y-3 md:space-y-4">
          <p className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-primary thai-body">
            {BRAND_CONCEPT}
          </p>
          <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.65rem] font-semibold tracking-tight text-foreground leading-[1.12] thai-display">
            ค้นพบดีไซเนอร์
            <br />
            <span className="bg-gradient-brand bg-clip-text text-transparent">ที่ใช่สำหรับคุณ</span>
          </h1>
          <p className="text-sm md:text-[0.95rem] text-muted-foreground max-w-[20rem] sm:max-w-md thai-body leading-relaxed">
            ดูผลงานจริง จ้างงาน ขอคอลแลป และหาแรงบันดาลใจ — ยิ่งมีคนยิ่งคม ทุกอย่างอยู่ในฟีดเดียว
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 w-full sm:w-auto">
          {STATS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-sm dark:bg-card dark:shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/_0.04)]"
            >
              <span className="block text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium thai-body">
                {label}
              </span>
              {isLoading ? (
                <Skeleton className="h-7 w-10 mt-1.5" />
              ) : (
                <span className="mt-1 block text-xl md:text-2xl font-semibold text-foreground tabular-nums leading-none">
                  {formatNum(s[key])}
                </span>
              )}
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
};

export default FeedHero;
