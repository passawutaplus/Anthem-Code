import { useFeedStats } from "@/hooks/useFeedStats";
import TopProjectShowcase from "./TopProjectShowcase";

const formatNum = (n: number) => n.toLocaleString("en-US");

const stat = (label: string, value: number) => (
  <div className="flex flex-col px-4 first:pl-0 last:pr-0">
    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
      {label}
    </span>
    <span className="text-xl md:text-2xl font-semibold text-foreground tabular-nums">
      {formatNum(value)}
    </span>
  </div>
);

const FeedHero = () => {
  const { data } = useFeedStats();
  const s = data ?? { designers: 0, projects: 0, collabs: 0, hires: 0 };

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center pt-2 pb-4">
      <div className="md:col-span-7 flex flex-col gap-5">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.05] thai-display">
            Discover Thailand's
            <br />
            best <span className="bg-gradient-brand bg-clip-text text-transparent">designers</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-md thai-body">
            ฟีดผลงานสด ๆ จากดีไซเนอร์ทั่วประเทศ — จ้างงาน คอลแลป และค้นพบแรงบันดาลใจในที่เดียว
          </p>
        </div>

        <div className="flex items-stretch divide-x divide-border/70 rounded-2xl glass-panel px-4 py-3 w-fit max-w-full overflow-x-auto">
          {stat("Designers", s.designers)}
          {stat("Projects", s.projects)}
          {stat("Collabs", s.collabs)}
          {stat("Hires", s.hires)}
        </div>
      </div>

      <div className="md:col-span-5">
        <TopProjectShowcase />
      </div>
    </section>
  );
};

export default FeedHero;
