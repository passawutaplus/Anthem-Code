import { useState } from "react";
import { cn } from "@/lib/utils";
import { resolveToolIconSlug, toolIconUrl } from "@/lib/toolIcons";

interface Props {
  name: string;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const SIZE_CLASS = {
  xs: "w-4 h-4 text-[9px]",
  sm: "w-5 h-5 text-[10px]",
  md: "w-7 h-7 text-[11px]",
} as const;

const ToolIcon = ({ name, size = "md", className }: Props) => {
  const [errored, setErrored] = useState(false);
  const slug = resolveToolIconSlug(name);
  const sizeClass = SIZE_CLASS[size];

  if (errored || !slug) {
    return (
      <div
        className={cn(
          "rounded-md bg-primary/10 flex items-center justify-center font-medium text-primary shrink-0",
          sizeClass,
          className,
        )}
      >
        {name[0]?.toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={toolIconUrl(slug)}
      alt=""
      aria-hidden
      className={cn("object-contain shrink-0", sizeClass, className)}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
};

export default ToolIcon;
