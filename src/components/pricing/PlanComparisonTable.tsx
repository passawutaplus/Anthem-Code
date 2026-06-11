import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  PLAN_COMPARISON_ROWS,
  PLAN_COMPARISON_TIER_LABELS,
  PLAN_COMPARISON_TIER_ORDER,
  type ComparisonCell,
} from "@/data/planComparison";
import type { PlanId } from "@/data/plans";
import { cn } from "@/lib/utils";

function ComparisonCellValue({ value }: { value: ComparisonCell }) {
  if (value === true) {
    return <Check className="h-4 w-4 text-primary mx-auto" aria-label="มี" />;
  }
  if (value === false) {
    return <Minus className="h-4 w-4 text-muted-foreground/50 mx-auto" aria-label="ไม่มี" />;
  }
  if (value === "coming_soon") {
    return (
      <Badge variant="outline" className="text-[10px] font-normal whitespace-nowrap">
        เร็วๆ นี้
      </Badge>
    );
  }
  return <span className="text-foreground/90">{value}</span>;
}

type Props = {
  currentTier?: PlanId;
  className?: string;
};

export function PlanComparisonTable({ currentTier, className }: Props) {
  return (
    <section className={cn("max-w-6xl mx-auto", className)}>
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">เปรียบเทียบแพ็กเกจ</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          ดูความแตกต่างของ Free, Pro, Pro+ และ In-House ในที่เดียว
        </p>
      </div>

      <Card className="overflow-hidden border border-border glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  scope="col"
                  className="text-left font-semibold px-4 sm:px-5 py-3 text-muted-foreground w-[28%]"
                >
                  หมวด
                </th>
                {PLAN_COMPARISON_TIER_ORDER.map((tier) => (
                  <th
                    key={tier}
                    scope="col"
                    className={cn(
                      "text-center font-semibold px-3 py-3 min-w-[88px]",
                      currentTier === tier && "bg-primary/10 text-primary",
                    )}
                  >
                    {PLAN_COMPARISON_TIER_LABELS[tier]}
                    {currentTier === tier && (
                      <span className="block text-[10px] font-normal text-primary/80 mt-0.5">
                        ปัจจุบัน
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON_ROWS.map((row, idx) => (
                <tr
                  key={row.label}
                  className={cn(
                    "border-b border-border last:border-0",
                    idx % 2 === 1 && "bg-muted/20",
                  )}
                >
                  <th
                    scope="row"
                    className="text-left font-medium px-4 sm:px-5 py-3 text-foreground/90"
                  >
                    {row.label}
                  </th>
                  {PLAN_COMPARISON_TIER_ORDER.map((tier) => (
                    <td
                      key={tier}
                      className={cn(
                        "text-center px-3 py-3 tabular-nums",
                        currentTier === tier && "bg-primary/5",
                      )}
                    >
                      <ComparisonCellValue value={row.values[tier]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
