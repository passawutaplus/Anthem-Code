import BriefcaseIcon from "../icons/BriefcaseIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users } from "lucide-react";
import type { DesignerCardData } from "@/hooks/useDesigners";
import FollowButton from "@/components/FollowButton";
import { useProjectLike } from "@/hooks/useProjectInteractions";
import { highlight } from "@/lib/highlight";

interface Props {
  data: DesignerCardData;
  onHire: (recipientId: string, recipientName: string) => void;
  onCollab: (recipientId: string, recipientName: string) => void;
  search?: string;
}

const DesignerCard = ({ data, onHire, onCollab, search = "" }: Props) => {
  const navigate = useNavigate();
  const { profile, projects } = data;
  const visible = projects.slice(0, 3);
  const extras = projects.slice(3, 6);
  const featured = projects[0];
  const like = useProjectLike(featured?.id);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!extras.length) return;
    const t = setInterval(() => setTick((v) => v + 1), 3500);
    return () => clearInterval(t);
  }, [extras.length]);

  const name = profile.display_name || profile.username || "ฟรีแลนซ์";
  const goto = (id: string) => navigate(`/project/${id}`);
  const gotoProfile = () => {
    const qs = search ? `?q=${encodeURIComponent(search)}` : "";
    navigate(`/u/${profile.id}${qs}`);
  };

  return (
    <article className="rounded-2xl glass-panel p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button onClick={gotoProfile} className="shrink-0">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-brand" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <button onClick={gotoProfile} className="block text-left text-sm font-semibold text-foreground truncate hover:underline">
            {highlight(name, search)}
          </button>
          <p className="text-xs text-muted-foreground truncate">
            {highlight(profile.role || profile.bio || "Designer", search)}
          </p>
        </div>
        <FollowButton freelancerId={profile.id} size="sm" variant="compact" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {visible.map((proj, i) => {
          const extra = extras[i];
          const showExtra = extra && tick % 2 === 1;
          const shown = showExtra ? extra : proj;
          const src = shown.cover_url || shown.gallery_urls?.[0] || "";
          return (
            <button
              key={i}
              onClick={() => goto(shown.id)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted group"
              title={shown.title}
            >
              {src && (
                <img
                  key={shown.id}
                  src={src}
                  alt={shown.title}
                  className="absolute inset-0 w-full h-full object-cover animate-fade-in transition-transform group-hover:scale-105"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onHire(profile.id, name)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-gradient-brand text-white text-xs font-medium py-2 hover:opacity-90 transition"
        >
          <BriefcaseIcon className="w-3.5 h-3.5" /> จ้างงาน
        </button>
        <button
          onClick={() => onCollab(profile.id, name)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-full glass-panel text-foreground text-xs font-medium py-2 hover:bg-accent/40 transition"
        >
          <Users className="w-3.5 h-3.5" /> คอลแลป
        </button>
        <button
          onClick={() => featured && like.toggle()}
          aria-label="Like featured"
          className="w-9 h-9 flex items-center justify-center rounded-full glass-panel hover:bg-accent/40 transition"
        >
          <Heart className={`w-4 h-4 ${like.isLiked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>
    </article>
  );
};

export default DesignerCard;
