import { Skeleton } from "@/components/ui/skeleton";
import { useFeedStats } from "@/hooks/useFeedStats";
import TopProjectShowcase from "./TopProjectShowcase";

const formatNum = (n: number) => n.toLocaleString("th-TH");

const stat = (label: string, value: number, loading: boolean) => (
  <div className="flex flex-col px-4 first:pl-0 last:pr-0 min-w-[4.5rem]">
    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium thai-body">
      {label}
    </span>
    {loading ? (
      <Skeleton className="h-7 w-12 mt-1" />
    ) : (
      <span className="text-xl md:text-2xl font-semibold text-foreground tabular-nums">
        {formatNum(value)}
      </span>
    )}
  </div>
);

const FeedHero = () => {
  const { data, isLoading } = useFeedStats();
  const s = data ?? { designers: 0, projects: 0, collabs: 0, hires: 0 };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center pt-2 pb-4">
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-xs font-medium text-primary tracking-wide thai-body">ชุมชนครีเอทีฟไทย</p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.08] thai-display">
            ค้นพบดีไซเนอร์
            <br />
            <span className="bg-gradient-brand bg-clip-text text-transparent">ที่ใช่สำหรับคุณ</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md thai-body leading-relaxed">
            ดูผลงานจริง จ้างงาน ขอคอลแลป และหาแรงบันดาลใจ — ทุกอย่างอยู่ในฟีดเดียว
          </p>
        </div>

        <div className="flex items-stretch divide-x divide-border/70 rounded-2xl glass-panel px-4 py-3 w-fit max-w-full overflow-x-auto">
          {stat("ดีไซเนอร์", s.designers, isLoading)}
          {stat("ผลงาน", s.projects, isLoading)}
          {stat("คอลแลป", s.collabs, isLoading)}
          {stat("จ้างงาน", s.hires, isLoading)}
        </div>
      </div>

      <div className="md:col-span-5">
        <TopProjectShowcase />
      </div>
    </section>
  );
};

export default FeedHero;
