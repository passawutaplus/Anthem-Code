import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildCommentTree, type CommentNode } from "@/lib/commentTree";
import {
  useModerationState,
  useRecordProfanityStrike,
  prepareModeratedContent,
} from "@/hooks/useModeration";

export type CommunityPostKind = "tip" | "question";

export interface CommunityPost {
  id: string;
  author_id: string;
  post_kind: CommunityPostKind;
  title: string;
  body: string;
  category: string;
  tags: string[];
  status: string;
  reply_count: number;
  created_at: string;
  updated_at: string;
  profile?: { display_name: string; avatar_url: string | null; username: string | null } | null;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  depth: number;
  created_at: string;
  profile?: { display_name: string; avatar_url: string | null; username: string | null } | null;
}

export type CommunityCommentTree = CommentNode<CommunityComment>;

export const useCommunityPosts = (postKind?: CommunityPostKind) => {
  return useQuery({
    queryKey: ["community-posts", postKind ?? "all"],
    queryFn: async (): Promise<CommunityPost[]> => {
      let q = supabase
        .from("community_posts")
        .select("id, author_id, post_kind, title, body, category, tags, status, reply_count, created_at, updated_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(60);
      if (postKind) q = q.eq("post_kind", postKind);
      const { data, error } = await q;
      if (error) throw error;
      const rows = (data ?? []) as CommunityPost[];
      const ids = Array.from(new Set(rows.map((r) => r.author_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .in("user_id", ids);
      const map = new Map((profs ?? []).map((p) => [p.user_id, p]));
      return rows.map((r) => ({ ...r, profile: map.get(r.author_id) ?? null }));
    },
  });
};

export const useCommunityPost = (id: string | undefined) =>
  useQuery({
    queryKey: ["community-post", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const row = data as CommunityPost;
      const { data: prof } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .eq("user_id", row.author_id)
        .maybeSingle();
      return { ...row, profile: prof ?? null };
    },
  });

export const useCreateCommunityPost = () => {
  const qc = useQueryClient();
  const { refetch: refetchMod } = useModerationState();
  const recordStrike = useRecordProfanityStrike();

  return useMutation({
    mutationFn: async (input: {
      author_id: string;
      post_kind: CommunityPostKind;
      title: string;
      body: string;
      category: string;
    }) => {
      const checkCanPost = async () => {
        const { data } = await refetchMod();
        return data ?? { allowed: true, reason: null, banned_until: null, strikes: 0 };
      };
      const title = await prepareModeratedContent(
        input.title,
        { context: "community_post_title", maskOnProfanity: true },
        checkCanPost,
        (ctx) => recordStrike.mutateAsync(ctx),
      );
      const body = await prepareModeratedContent(
        input.body,
        { context: "community_post_body", maskOnProfanity: true },
        checkCanPost,
        (ctx) => recordStrike.mutateAsync(ctx),
      );
      if (!title || !body) throw new Error("ไม่สามารถโพสต์ได้");

      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          author_id: input.author_id,
          post_kind: input.post_kind,
          title,
          body,
          category: input.category,
        })
        .select("id")
        .single();
      if (error) throw error;
      return data as { id: string };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community-posts"] }),
  });
};

export const useCommunityComments = (postId: string | undefined) => {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["community-comments", postId],
    enabled: !!postId,
    queryFn: async (): Promise<CommunityCommentTree[]> => {
      const { data, error } = await supabase
        .from("community_post_comments")
        .select("id, post_id, user_id, content, parent_id, depth, created_at")
        .eq("post_id", postId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const rows = (data ?? []) as CommunityComment[];
      const ids = Array.from(new Set(rows.map((r) => r.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url, username")
        .in("user_id", ids);
      const map = new Map((profs ?? []).map((p) => [p.user_id, p]));
      const enriched = rows.map((r) => ({
        ...r,
        parent_id: r.parent_id ?? null,
        profile: map.get(r.user_id) ?? null,
      }));
      return buildCommentTree(enriched);
    },
  });

  useEffect(() => {
    if (!postId) return;
    const ch = supabase
      .channel(`community-comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "anthem", table: "community_post_comments", filter: `post_id=eq.${postId}` },
        () => qc.invalidateQueries({ queryKey: ["community-comments", postId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [postId, qc]);

  return query;
};

export const useCreateCommunityComment = () => {
  const qc = useQueryClient();
  const { refetch: refetchMod } = useModerationState();
  const recordStrike = useRecordProfanityStrike();

  return useMutation({
    mutationFn: async (payload: {
      post_id: string;
      user_id: string;
      content: string;
      parent_id?: string | null;
      depth?: number;
    }) => {
      const checkCanPost = async () => {
        const { data } = await refetchMod();
        return data ?? { allowed: true, reason: null, banned_until: null, strikes: 0 };
      };
      const content = await prepareModeratedContent(
        payload.content,
        { context: "community_comment", maskOnProfanity: true },
        checkCanPost,
        (ctx) => recordStrike.mutateAsync(ctx),
      );
      if (!content) throw new Error("ไม่สามารถส่งคอมเมนต์ได้");

      const { error } = await supabase.from("community_post_comments").insert({
        post_id: payload.post_id,
        user_id: payload.user_id,
        content,
        parent_id: payload.parent_id ?? null,
        depth: payload.depth ?? 0,
      });
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["community-comments", v.post_id] });
      qc.invalidateQueries({ queryKey: ["community-post", v.post_id] });
      qc.invalidateQueries({ queryKey: ["community-posts"] });
    },
  });
};
