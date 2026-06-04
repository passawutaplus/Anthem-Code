import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CommentWithProfile {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: { display_name: string; avatar_url: string | null; username: string | null } | null;
}

export const useProjectComments = (projectId: string | undefined) => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["project-comments", projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<CommentWithProfile[]> => {
      const { data, error } = await supabase
        .from("project_comments")
        .select("id, project_id, user_id, content, created_at")
        .eq("project_id", projectId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = data ?? [];
      const ids = Array.from(new Set(rows.map((r) => r.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, username")
        .in("id", ids);
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      return rows.map((r) => ({ ...r, profile: map.get(r.user_id) ?? null }));
    },
  });

  useEffect(() => {
    if (!projectId) return;
    const ch = supabase
      .channel(`comments-${projectId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_comments", filter: `project_id=eq.${projectId}` },
        () => qc.invalidateQueries({ queryKey: ["project-comments", projectId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [projectId, qc]);

  return query;
};

export const useCreateComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { project_id: string; user_id: string; content: string }) => {
      const { error } = await supabase.from("project_comments").insert(payload);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["project-comments", v.project_id] }),
  });
};

export const useDeleteComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; project_id: string }) => {
      const { error } = await supabase.from("project_comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["project-comments", v.project_id] }),
  });
};
