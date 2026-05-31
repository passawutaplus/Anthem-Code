import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate, Tables } from "@/integrations/supabase/types";
import { PROJECT_DETAIL_SELECT, PROJECT_FEED_SELECT, PROJECT_MANAGE_SELECT } from "@/lib/dbSelects";

export type DBProject = Tables<"projects">;

const PUBLISHED_LIST_LIMIT = 120;
const TOP_LIST_LIMIT = 200;
const FOR_YOU_LIMIT = 80;

export const useMyProjects = (userId: string | undefined) =>
  useQuery({
    queryKey: ["my-projects", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_MANAGE_SELECT)
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

export const usePublishedProjects = () =>
  useQuery({
    queryKey: ["published-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_FEED_SELECT)
        .eq("status", "Published")
        .order("created_at", { ascending: false })
        .limit(PUBLISHED_LIST_LIMIT);
      if (error) throw error;
      return data ?? [];
    },
  });

export const useTopProjects = () =>
  useQuery({
    queryKey: ["top-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_FEED_SELECT)
        .eq("status", "Published")
        .order("likes", { ascending: false })
        .order("views", { ascending: false })
        .limit(TOP_LIST_LIMIT);
      if (error) throw error;
      return data ?? [];
    },
  });

export const useFollowingProjects = (userId: string | undefined) =>
  useQuery({
    queryKey: ["following-projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: follows, error: fErr } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", userId!);
      if (fErr) throw fErr;
      const ids = (follows ?? []).map((f) => f.following_id);
      if (!ids.length) return [];
      const { data, error } = await supabase
        .from("projects")
        .select(PROJECT_FEED_SELECT)
        .eq("status", "Published")
        .in("owner_id", ids)
        .order("created_at", { ascending: false })
        .limit(PUBLISHED_LIST_LIMIT);
      if (error) throw error;
      return data ?? [];
    },
  });

export const useForYouProjects = (userId: string | undefined) =>
  useQuery({
    queryKey: ["for-you-projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      // Gather signal categories: views + bookmarks + project likes + per-image likes
      const [viewsRes, bookmarksRes, likesRes, imgLikesRes] = await Promise.all([
        supabase.from("project_views").select("project_id").eq("user_id", userId!).order("viewed_at", { ascending: false }).limit(100),
        supabase.from("project_bookmarks").select("project_id").eq("user_id", userId!),
        supabase.from("project_likes").select("project_id").eq("user_id", userId!),
        supabase.from("image_likes").select("project_id").eq("user_id", userId!).order("created_at", { ascending: false }).limit(50),
      ]);
      const likedIds = new Set<string>([
        ...(likesRes.data ?? []).map((r) => r.project_id),
        ...(imgLikesRes.data ?? []).map((r) => r.project_id),
      ]);
      const seenIds = new Set<string>([
        ...(viewsRes.data ?? []).map((r) => r.project_id),
        ...(bookmarksRes.data ?? []).map((r) => r.project_id),
        ...likedIds,
      ]);

      // Try AI-based recommendation from like history first
      let aiRecs: DBProject[] = [];
      if (likedIds.size > 0) {
        const { data: recIds } = await supabase.rpc("recommend_from_likes", { _user_id: userId!, _limit: 40 });
        const ids = (recIds ?? []).map((r) => r.id);
        if (ids.length) {
          const { data: full } = await supabase.from("projects").select(PROJECT_FEED_SELECT).in("id", ids);
          // Preserve RPC similarity order
          const orderMap = new Map(ids.map((id, i) => [id, i]));
          aiRecs = (full ?? []).sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
        }
      }

      if (!seenIds.size && aiRecs.length === 0) {
        const { data } = await supabase
          .from("projects")
          .select(PROJECT_FEED_SELECT)
          .eq("status", "Published")
          .order("created_at", { ascending: false })
          .limit(60);
        return data ?? [];
      }

      const { data: signalProjects } = await supabase.from("projects").select("category").in("id", Array.from(seenIds));
      const catFreq: Record<string, number> = {};
      (signalProjects ?? []).forEach((p) => { if (p.category) catFreq[p.category] = (catFreq[p.category] ?? 0) + 1; });
      const topCats = Object.entries(catFreq).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([c]) => c);
      const query = supabase.from("projects").select(PROJECT_FEED_SELECT).eq("status", "Published");
      const { data: catBased, error } = topCats.length
        ? await query.in("category", topCats).order("likes", { ascending: false }).limit(FOR_YOU_LIMIT)
        : await query.order("created_at", { ascending: false }).limit(60);
      if (error) throw error;

      // Blend: AI recs first, then category-based; dedupe and push already-seen to bottom
      const seenInList = new Set<string>();
      const blended: DBProject[] = [];
      for (const p of [...aiRecs, ...(catBased ?? [])]) {
        if (seenInList.has(p.id)) continue;
        seenInList.add(p.id);
        blended.push(p);
      }
      return blended.sort((a, b) => Number(seenIds.has(a.id)) - Number(seenIds.has(b.id)));
    },
  });



export const useProject = (id: string | undefined) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("projects").select(PROJECT_DETAIL_SELECT).eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TablesInsert<"projects">) => {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-projects"] });
      qc.invalidateQueries({ queryKey: ["published-projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"projects"> }) => {
      const { data, error } = await supabase.from("projects").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["my-projects"] });
      qc.invalidateQueries({ queryKey: ["published-projects"] });
      qc.invalidateQueries({ queryKey: ["project", vars.id] });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-projects"] });
      qc.invalidateQueries({ queryKey: ["published-projects"] });
    },
  });
};
