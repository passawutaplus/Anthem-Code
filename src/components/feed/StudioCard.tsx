import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudioCardData } from "@/hooks/usePublicStudios";

interface Props {
  data: StudioCardData;
}

const StudioCard = ({ data }: Props) => {
  const navigate = useNavigate();
  const { studio, memberAvatars, projectCovers } = data;
  const tiles = [...projectCovers];
  while (tiles.length < 3) tiles.push({ id: `_${tiles.length}`, title: "", cover: "" });

  return (
    <article className="rounded-2xl glass-panel p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/s/${studio.slug}`)}
          className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-brand text-white grid place-items-center overflow-hidden"
          aria-label={studio.name}
        >
          {studio.avatar_url ? (
            <img src={studio.avatar_url} alt={studio.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-5 h-5" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate(`/s/${studio.slug}`)}
            className="block text-left text-sm font-semibold text-foreground truncate hover:underline"
          >
            <span className="inline-flex items-center gap-1">
              {studio.name}
              {studio.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
            </span>
          </button>
          <p className="text-xs text-muted-foreground truncate">
            {studio.tagline || "Design studio"}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5"><Users className="w-3 h-3" />{studio.member_count}</span>
            {studio.location && (
              <span className="inline-flex items-center gap-0.5 truncate"><MapPin className="w-3 h-3" />{studio.location}</span>
            )}
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate(`/s/${studio.slug}`)}
          className="rounded-full bg-gradient-brand text-white border-0 h-7 px-3 text-xs"
        >
          ดู Studio
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <button
            key={t.id + i}
            onClick={() => t.cover && navigate(`/project/${t.id}`)}
            disabled={!t.cover}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted group"
          >
            {t.cover ? (
              <img
                src={t.cover}
                alt={t.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-[11px] text-muted-foreground">
                ยังไม่มีผลงาน
              </div>
            )}
          </button>
        ))}
      </div>

      {memberAvatars.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {memberAvatars.map((m) => (
              <div
                key={m.id}
                className="w-7 h-7 rounded-full ring-2 ring-background overflow-hidden bg-muted"
                title={m.display_name}
              >
                {m.avatar_url ? (
                  <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-brand" />
                )}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {studio.member_count} สมาชิก · {projectCovers.length} ผลงาน
          </span>
        </div>
      )}
    </article>
  );
};

export default StudioCard;
