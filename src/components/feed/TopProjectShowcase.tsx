import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTopProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

const TopProjectShowcase = () => {
  const navigate = useNavigate();
  const { data: top = [] } = useTopProjects();
  const slides = useMemo(() => top.slice(0, 6), [top]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[idx];
  const ownerId = current?.owner_id;

  const { data: owner } = useQuery({
    queryKey: ["showcase-owner", ownerId],
    enabled: !!ownerId,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .eq("id", ownerId!)
        .maybeSingle();
      return data;
    },
  });

  if (!current) {
    return (
      <div className="relative aspect-[4/3] rounded-2xl glass-panel animate-pulse" />
    );
  }

  const cover = current.cover_url || current.gallery_urls?.[0] || "";

  return (
    <div className="relative">
      <div
        className="relative aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden glass-panel p-2 md:p-3 rotate-[-1.5deg] shadow-xl transition-transform hover:rotate-0"
        style={{ WebkitBackdropFilter: "blur(14px)", backdropFilter: "blur(14px)" }}
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-muted">
          {cover && (
            <img
              key={current.id}
              src={cover}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover animate-fade-in cursor-pointer"
              onClick={() => navigate(`/project/${current.id}`)}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <button
              onClick={() => navigate(`/project/${current.id}`)}
              className="block text-left text-white font-semibold text-sm md:text-base line-clamp-1 hover:underline"
            >
              {current.title}
            </button>
            {owner && (
              <button
                onClick={() => navigate(`/profile/${owner.id}`)}
                className="flex items-center gap-1.5 mt-1 text-white/85 text-xs hover:text-white"
              >
                {owner.avatar_url ? (
                  <img src={owner.avatar_url} className="w-4 h-4 rounded-full object-cover" alt="" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-white/20" />
                )}
                <span className="hover:underline">{owner.display_name || owner.username}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full glass-panel">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProjectShowcase;
