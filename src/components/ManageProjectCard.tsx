import { Eye, Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@/data/projectTypes";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ManageProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

const ManageProjectCard = ({ project, onDelete, editable }: ManageProjectCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl overflow-hidden glass-panel">
      <div className="relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {project.status === "Published" && (
            <Badge className="bg-success text-success-foreground text-xs">
              ⊕ Published
            </Badge>
          )}
          {project.status === "Draft" && (
            <Badge variant="outline" className="bg-card/80 text-muted-foreground text-xs">
              Draft
            </Badge>
          )}
          <Badge className="bg-primary text-primary-foreground text-xs">
            {project.category}
          </Badge>
        </div>
        {/* Color blocks decoration */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          <div className="w-6 h-3 rounded-sm bg-foreground/80" />
          <div className="w-6 h-3 rounded-sm bg-primary" />
          <div className="w-6 h-3 rounded-sm bg-secondary" />
          <div className="w-6 h-3 rounded-sm bg-muted-foreground/40" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{project.title}</h3>
          <div className="flex items-center gap-1">
            {editable && (
              <button
                onClick={() => navigate(`/portfolio/${project.id}/edit`)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                aria-label="แก้ไข"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete?.(project.id)}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="ลบ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {project.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {project.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {project.comments}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{project.publishedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ManageProjectCard;
