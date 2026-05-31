import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const PortfolioGrid = ({ projects }: { projects: Project[] }) => {
  if (!projects.length) {
    return null;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {projects.map((p) => (
        <Link
          key={p.id}
          to={`/project/${p.id}`}
          className="group rounded-2xl overflow-hidden glass-panel hover:shadow-lg transition-all"
        >
          <div className="aspect-square bg-muted overflow-hidden relative">
            {p.cover_url ? (
              <img
                src={p.cover_url}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">ไม่มีรูป</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.views}</span>
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{p.likes}</span>
            </div>
          </div>
          <div className="p-3">
            <Badge className="bg-primary/15 text-primary border-0 hover:bg-primary/15 text-[10px] mb-1">{p.category}</Badge>
            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{p.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PortfolioGrid;
