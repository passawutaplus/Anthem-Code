import { categories } from "@/data/projectTypes";
import { cn } from "@/lib/utils";

const WORK_CATEGORIES = categories.filter((c) => c !== "Explore");

type Props = {
  selected: string;
  onSelect: (category: string) => void;
  className?: string;
};

const CommunityCategoryChips = ({ selected, onSelect, className }: Props) => (
  <div
    className={cn(
      "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1",
      className,
    )}
  >
    <Chip active={selected === "All"} onClick={() => onSelect("All")} label="ทั้งหมด" />
    {WORK_CATEGORIES.map((cat) => (
      <Chip key={cat} active={selected === cat} onClick={() => onSelect(cat)} label={cat} />
    ))}
  </div>
);

const Chip = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary",
    )}
  >
    {label}
  </button>
);

export default CommunityCategoryChips;
