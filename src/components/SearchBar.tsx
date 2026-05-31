import { Search, SlidersHorizontal } from "lucide-react";
import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  filterContent?: ReactNode;
  filterCount?: number;
}

const SearchBar = ({
  placeholder = "Find inspiration or creators",
  value,
  onChange,
  filterContent,
  filterCount = 0,
}: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-12 py-3 rounded-2xl bg-secondary/60 border-0 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
      {filterContent && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-secondary transition-colors"
              aria-label="ตัวกรอง"
            >
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {filterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm rounded-2xl p-4 glass-panel max-h-[70vh] overflow-y-auto overscroll-contain"
          >
            {filterContent}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default SearchBar;
