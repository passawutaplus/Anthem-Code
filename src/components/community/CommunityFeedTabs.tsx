import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityFeedFilter } from "@/data/communityTopics";

type Props = {
  feedSource: CommunityFeedFilter["feedSource"];
  onChange: (source: CommunityFeedFilter["feedSource"]) => void;
  className?: string;
};

const tabs: { id: CommunityFeedFilter["feedSource"]; label: string; icon?: typeof Target }[] = [
  { id: "following", label: "กำลังติดตาม" },
  { id: "all", label: "สำหรับคุณ" },
  { id: "drill", label: "Design Drill", icon: Target },
];

const CommunityFeedTabs = ({ feedSource, onChange, className }: Props) => (
  <div className={cn("flex items-center justify-center gap-8", className)}>
    {tabs.map((tab) => {
      const active = feedSource === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative inline-flex items-center gap-1.5 pb-2 text-sm font-medium transition-colors",
            active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.icon && <tab.icon className="h-3.5 w-3.5" aria-hidden />}
          {tab.label}
          {active && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-brand" />
          )}
        </button>
      );
    })}
  </div>
);

export default CommunityFeedTabs;
