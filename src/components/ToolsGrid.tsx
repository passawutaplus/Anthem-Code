import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { exploreProjectsUrl } from "@/lib/exploreRoutes";

// Map tool display name -> Simple Icons slug
const SLUGS: Record<string, string> = {
  Photoshop: "adobephotoshop",
  Illustrator: "adobeillustrator",
  "After Effects": "adobeaftereffects",
  Premiere: "adobepremierepro",
  Lightroom: "adobelightroom",
  Audition: "adobeaudition",
  Indesign: "adobeindesign",
  Procreate: "procreate",
  Blender: "blender",
  Figma: "figma",
  Sketch: "sketch",
  Framer: "framer",
  Notion: "notion",
  Canva: "canva",
  CapCut: "capcut",
  Webflow: "webflow",
  GitHub: "github",
  React: "react",
  Tailwind: "tailwindcss",
  "Logic Pro": "applelogicpro",
  Ableton: "abletonlive",
  Spline: "spline",
  Cinema4D: "cinema4d",
  ZBrush: "zbrush",
  Unity: "unity",
  Unreal: "unrealengine",
  Davinci: "davinciresolve",
  Affinity: "affinitydesigner",
  Rhino: "rhinoceros",
  Maya: "autodeskmaya",
};

const DESCS: Record<string, string> = {
  Photoshop: "Adobe Photoshop — แต่งภาพ & composite",
  Illustrator: "Adobe Illustrator — งาน vector",
  Procreate: "วาดภาพดิจิทัลบน iPad",
  Blender: "3D modeling & rendering ฟรี",
  "After Effects": "Motion graphics",
  Premiere: "ตัดต่อวิดีโอระดับโปร",
  Figma: "ออกแบบ UI/UX collaborative",
  Notion: "จัดการโปรเจกต์ & docs",
  Canva: "เทมเพลตสำเร็จรูปสำหรับโซเชียล",
  Lightroom: "แต่งสีภาพถ่าย",
  CapCut: "ตัดต่อวิดีโอสายโซเชียล",
};

const slugify = (name: string) =>
  SLUGS[name] ?? name.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

const ToolIcon = ({ name }: { name: string }) => {
  const [errored, setErrored] = useState(false);
  const slug = slugify(name);
  if (errored || !slug) {
    return (
      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-[11px] font-medium text-primary">
        {name[0]?.toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={name}
      className="w-7 h-7 object-contain"
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
};

interface Props {
  tools: string[];
  compact?: boolean;
  linkable?: boolean;
}

const ToolsGrid = ({ tools, compact, linkable = true }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid grid-cols-3 md:grid-cols-4 gap-3"}>
      {tools.map((name) => {
        const chip = (
          <div
            className={
              compact
                ? "flex items-center gap-2 rounded-full glass-panel px-3 py-1.5 hover:border-primary/40 transition-colors"
                : "rounded-xl glass-panel p-4 flex flex-col items-center gap-2 hover:border-primary/40 hover:shadow-sm transition-all"
            }
          >
            <ToolIcon name={name} />
            <p className={compact ? "text-xs font-medium text-foreground" : "text-xs font-medium text-foreground text-center"}>
              {name}
            </p>
          </div>
        );

        return (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              {linkable ? (
                <button
                  type="button"
                  onClick={() => navigate(exploreProjectsUrl("tool", name))}
                  className="text-left cursor-pointer"
                  aria-label={`ดูผลงานที่ใช้ ${name}`}
                >
                  {chip}
                </button>
              ) : (
                chip
              )}
            </TooltipTrigger>
            <TooltipContent>
              {linkable ? `ดูผลงานที่ใช้ ${name}` : (DESCS[name] ?? name)}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ToolsGrid;
