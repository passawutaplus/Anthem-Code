import { ArrowDownUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type DesignerSort = "newest" | "projects" | "views";

export const SORT_LABELS: Record<DesignerSort, string> = {
  newest: "ล่าสุด",
  projects: "ผลงานมากสุด",
  views: "วิวมากสุด",
};

interface FilterPanelProps {
  sort: DesignerSort;
  onSort: (s: DesignerSort) => void;
  tools?: string[];
  selectedTools?: string[];
  onToggleTool?: (t: string) => void;
  onClear: () => void;
  showTools?: boolean;
}

export const FilterPanel = ({
  sort,
  onSort,
  tools = [],
  selectedTools = [],
  onToggleTool,
  onClear,
  showTools = true,
}: FilterPanelProps) => {
  const activeCount =
    (sort !== "newest" ? 1 : 0) + (showTools ? selectedTools.length : 0);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
          <ArrowDownUp className="w-3 h-3" /> เรียงตาม
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(SORT_LABELS) as DesignerSort[]).map((k) => {
            const active = sort === k;
            return (
              <button
                key={k}
                onClick={() => onSort(k)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {SORT_LABELS[k]}
              </button>
            );
          })}
        </div>
      </div>

      {showTools && tools.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">เครื่องมือ</p>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto overscroll-contain pr-1 -mr-1" style={{ WebkitOverflowScrolling: "touch" }}>
            {tools.map((t) => {
              const active = selectedTools.includes(t);
              return (
                <label
                  key={t}
                  className="flex items-center gap-2 text-xs cursor-pointer"
                >
                  <Checkbox
                    checked={active}
                    onCheckedChange={() => onToggleTool?.(t)}
                  />
                  <span>{t}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 w-full rounded-full text-xs text-muted-foreground gap-1"
        >
          <X className="w-3 h-3" /> ล้างตัวกรอง
        </Button>
      )}
    </div>
  );
};

export default FilterPanel;
