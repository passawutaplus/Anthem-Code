import { LayoutGrid, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type FeedMode = "projects" | "designers" | "studios";

interface Props {
  value: FeedMode;
  onChange: (v: FeedMode) => void;
}

const items: { id: FeedMode; label: string; icon: typeof LayoutGrid }[] = [
  { id: "projects", label: "Projects", icon: LayoutGrid },
  { id: "designers", label: "Designers", icon: Users },
  { id: "studios", label: "Studios", icon: Building2 },
];

const FeedModeToggle = ({ value, onChange }: Props) => (
  <div className="shrink-0 flex items-center rounded-full glass-panel p-0.5">
    {items.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        aria-label={`${label} view`}
        onClick={() => onChange(id)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition",
          value === id
            ? "bg-gradient-brand text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    ))}
  </div>
);

export default FeedModeToggle;
