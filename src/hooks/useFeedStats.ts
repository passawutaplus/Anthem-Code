import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function countFrom(res: { count: number | null; error: { message: string } | null }) {
  if (res.error) throw res.error;
  return res.count ?? 0;
}

export const useFeedStats = () =>
  useQuery({
    queryKey: ["feed-stats"],
    staleTime: 60_000,
    queryFn: async () => {
      const [
        { count: designersCount, error: designersError },
        { count: projectsCount, error: projectsError },
        { count: collabsCount, error: collabsError },
        { count: hiresCount, error: hiresError },
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("id", { count: "exact", head: true })
          .eq("status", "Published"),
        supabase.from("collab_requests").select("id", { count: "exact", head: true }),
        supabase.from("hiring_requests").select("id", { count: "exact", head: true }),
      ]);

      return {
        designers: countFrom({ count: designersCount, error: designersError }),
        projects: countFrom({ count: projectsCount, error: projectsError }),
        collabs: countFrom({ count: collabsCount, error: collabsError }),
        hires: countFrom({ count: hiresCount, error: hiresError }),
      };
    },
  });
