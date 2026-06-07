import { useMemo } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToolSuggestions, normalizeToolKey } from "@/hooks/useToolSuggestions";
import { cn } from "@/lib/utils";

interface Props {
  userId?: string;
  tools: string[];
  onChange: (tools: string[]) => void;
  input: string;
  setInput: (v: string) => void;
  max?: number;
}

const ToolPicker = ({ userId, tools, onChange, input, setInput, max = 20 }: Props) => {
  const suggestions = useToolSuggestions(userId);
  const selectedKeys = useMemo(() => new Set(tools.map(normalizeToolKey)), [tools]);

  const addTool = (raw: string) => {
    const label = raw.trim();
    const key = normalizeToolKey(label);
    if (!key || selectedKeys.has(key) || tools.length >= max) return;
    onChange([...tools, label]);
    setInput("");
  };

  const filteredSuggestions = useMemo(() => {
    const q = normalizeToolKey(input);
    const pool = suggestions.filter((s) => !selectedKeys.has(normalizeToolKey(s)));
    if (!q) return pool.slice(0, 12);
    return pool
      .filter((s) => normalizeToolKey(s).includes(q) || q.includes(normalizeToolKey(s)))
      .slice(0, 12);
  }, [suggestions, input, selectedKeys]);

  const showQuick = !input.trim() && filteredSuggestions.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <Label className="text-xs font-semibold text-muted-foreground uppercase">เครื่องมือที่ใช้</Label>

      {tools.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tools.map((t, i) => (
            <Badge key={t + i} variant="secondary" className="rounded-full pl-3 pr-1 py-1 text-xs">
              {t}
              <button
                type="button"
                onClick={() => onChange(tools.filter((_, j) => j !== i))}
                className="ml-1 hover:text-destructive"
                aria-label={`ลบ ${t}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTool(input);
            }
          }}
          placeholder="พิมพ์เครื่องมือใหม่ หรือเลือกด้านล่าง"
          disabled={tools.length >= max}
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          disabled={!input.trim() || tools.length >= max}
          onClick={() => addTool(input)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {showQuick && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">เครื่องมือที่ใช้บ่อย</p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTool(s)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full border border-border/80 bg-muted/40",
                  "text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-colors",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {input.trim() && filteredSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground">แนะนำ</p>
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTool(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">
        {tools.length}/{max} เครื่องมือ — กด Enter เพื่อเพิ่มเอง
      </p>
    </div>
  );
};

export default ToolPicker;
