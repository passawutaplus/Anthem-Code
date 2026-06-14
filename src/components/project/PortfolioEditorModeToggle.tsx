import { ImagePlus, Sparkles } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAiUsage } from "@/hooks/useAiUsage";
import { ANTHEM_PORTFOLIO_FROM_IMAGES_CREDITS } from "@/lib/aiFeatureCredits";
import { cn } from "@/lib/utils";

export type PortfolioEditorMode = "manual" | "ai";

interface PortfolioEditorModeToggleProps {
  mode: PortfolioEditorMode;
  onModeChange: (mode: PortfolioEditorMode) => void;
}

export function PortfolioEditorModeToggle({ mode, onModeChange }: PortfolioEditorModeToggleProps) {
  const { total_remaining, isLoading } = useAiUsage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 border-b border-border/60 bg-muted/20">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => {
            if (v === "manual" || v === "ai") onModeChange(v);
          }}
          className="inline-flex rounded-full border border-border bg-background p-1 w-full sm:w-auto"
        >
          <ToggleGroupItem
            value="manual"
            className={cn(
              "rounded-full px-4 py-2 text-sm gap-2 data-[state=on]:bg-muted data-[state=on]:text-foreground flex-1 sm:flex-none",
            )}
          >
            <ImagePlus className="w-4 h-4 shrink-0" />
            ลงธรรมดา
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ai"
            className={cn(
              "rounded-full px-4 py-2 text-sm gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex-1 sm:flex-none",
            )}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            AI ช่วยลงผลงาน
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                mode === "ai" ? "bg-primary-foreground/20" : "bg-primary/10 text-primary",
              )}
            >
              {ANTHEM_PORTFOLIO_FROM_IMAGES_CREDITS} เครดิต
            </span>
          </ToggleGroupItem>
        </ToggleGroup>

        {mode === "ai" && (
          <p className="text-xs text-muted-foreground sm:text-right">
            {isLoading ? "กำลังโหลดเครดิต..." : `เหลือ ${total_remaining.toLocaleString("th-TH")} เครดิต`}
          </p>
        )}
      </div>
    </div>
  );
}
