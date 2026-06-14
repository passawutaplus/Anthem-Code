import BriefcaseIcon from "./icons/BriefcaseIcon";
import CollectionIcon from "./icons/CollectionIcon";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, MoreHorizontal, Share2, Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/data/projectTypes";
import { useProjectLike } from "@/hooks/useProjectInteractions";
import SaveToCollectionPopover from "@/components/collections/SaveToCollectionPopover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SafeDemoImage from "@/components/SafeDemoImage";
import { smoothEase } from "@/lib/motion";

interface ProjectCardProps {
  project: Project;
  onHireClick?: (projectId: string) => void;
  onCollabClick?: (projectId: string) => void;
}

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "m";
  if (n >= 1_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "k";
  return String(n);
};

const ProjectCard = ({ project, onHireClick, onCollabClick }: ProjectCardProps) => {
  const navigate = useNavigate();
  const isDbProject = /^[0-9a-f]{8}-/.test(project.id);
  const { likes, isLiked, toggle: toggleLike } = useProjectLike(isDbProject ? project.id : undefined);

  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [menuOpen]);

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fn();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/project/${project.id}`;
    navigator.clipboard?.writeText(url).then(
      () => toast.success("คัดลอกลิงก์แล้ว"),
      () => toast.error("คัดลอกไม่สำเร็จ")
    );
  };

  const goToOwner = () => {
    if (project.ownerId) navigate(`/profile/${project.ownerId}`);
  };

  return (
    <motion.div
      className="group cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.22, ease: smoothEase }}
    >
      <div ref={wrapRef} className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-muted">
        <SafeDemoImage
          src={project.image}
          index={project.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />



        {/* Hover glass overlay (desktop) — gradient blur from bottom */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none transition-opacity duration-300",
            "bg-gradient-to-t from-black/55 via-black/20 to-transparent",
            "supports-[backdrop-filter]:backdrop-blur-md [-webkit-backdrop-filter:blur(12px)]",
            "[mask-image:linear-gradient(to_top,black_28%,transparent_100%)]",
            "[-webkit-mask-image:linear-gradient(to_top,black_28%,transparent_100%)]",
            menuOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
          )}
        />

        {/* Project title — bottom-left, visible on hover or when menu open */}
        <div
          className={cn(
            "absolute bottom-2 left-3 right-12 pointer-events-none transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
          )}
        >
          <p className="text-white text-sm font-medium line-clamp-1 thai-leading-tight drop-shadow">
            {project.title}
          </p>
        </div>

        {/* Action icons row — appears ABOVE the title when 3-dot menu is open */}
        <div
          className={cn(
            "absolute bottom-9 left-2 right-2 flex items-center gap-0.5 transition-all duration-200",
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-1 pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <SaveToCollectionPopover projectId={isDbProject ? project.id : undefined}>
            <button
              aria-label="เก็บเข้าคอลเลกชัน"
              title="เก็บเข้าคอลเลกชัน"
              className="p-1.5 rounded-full text-white hover:bg-white/15 transition-colors"
            >
              <CollectionIcon className="w-4 h-4" />
            </button>
          </SaveToCollectionPopover>
          <button
            onClick={stop(handleShare)}
            aria-label="แชร์"
            title="แชร์"
            className="p-1.5 rounded-full text-white hover:bg-white/15 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {(project.allowHire ?? true) && (
            <button
              onClick={stop(() => onHireClick?.(project.id))}
              aria-label="จ้างงาน"
              title="จ้างงาน"
              className="p-1.5 rounded-full text-white hover:bg-white/15 transition-colors"
            >
              <BriefcaseIcon className="w-4 h-4" />
            </button>
          )}
          {(project.allowCollab ?? true) && (
            <button
              onClick={stop(() => onCollabClick?.(project.id))}
              aria-label="Collab"
              title="Collab"
              className="p-1.5 rounded-full text-white hover:bg-white/15 transition-colors"
            >
              <Handshake className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3-dot trigger — bottom-right, hover-reveal on desktop, always-on mobile */}
        <button
          onClick={stop(() => setMenuOpen((v) => !v))}
          aria-label="ตัวเลือก"
          aria-expanded={menuOpen}
          className={cn(
            "absolute bottom-2 right-2 p-1.5 rounded-full transition-all hover:scale-110 text-white",
            menuOpen
              ? "bg-white/20 border border-white/25 backdrop-blur-md opacity-100"
              : "bg-background/15 border border-white/10 backdrop-blur-md md:bg-transparent md:border-transparent md:backdrop-blur-0 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Owner row — avatar + name, with view/like on the right */}
      <div className="pt-2 px-0.5 flex items-center justify-between gap-2">
        <button
          onClick={stop(goToOwner)}
          className="flex items-center gap-2 min-w-0 group/owner"
          aria-label={`โปรไฟล์ ${project.owner}`}
        >
          <img
            src={project.ownerAvatar}
            alt={project.owner}
            className="w-6 h-6 rounded-full object-cover shrink-0"
            loading="lazy"
          />
          <span className="text-sm text-foreground/90 line-clamp-1 thai-leading-tight group-hover/owner:text-foreground transition-colors">
            {project.owner}
          </span>
        </button>
        <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
          <span className="flex items-center gap-1" title="ยอดเข้าชม" aria-label="ยอดเข้าชม">
            <Eye className="w-3.5 h-3.5" />
            {formatCompact(project.views ?? 0)}
          </span>
          <button
            onClick={stop(() => toggleLike())}
            className="flex items-center gap-1"
            aria-label="ถูกใจ"
          >
            <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-destructive text-destructive")} />
            {formatCompact(isDbProject ? likes : project.likes)}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
