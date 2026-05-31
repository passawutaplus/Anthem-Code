import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useFollowState = (followingId: string | undefined) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const counts = useQuery({
    queryKey: ["follow-counts", followingId],
    enabled: !!followingId,
    queryFn: async () => {
      const [followers, following] = await Promise.all([
        supabase.from("follows").select("follower_id", { count: "exact", head: true }).eq("following_id", followingId!),
        supabase.from("follows").select("following_id", { count: "exact", head: true }).eq("follower_id", followingId!),
      ]);
      return { followers: followers.count ?? 0, following: following.count ?? 0 };
    },
  });

  const isFollowing = useQuery({
    queryKey: ["is-following", followingId, user?.id],
    enabled: !!followingId && !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", user!.id)
        .eq("following_id", followingId!)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  const toggle = useMutation({
    mutationFn: async () => {
      if (!user || !followingId) throw new Error("ต้องเข้าสู่ระบบก่อน");
      if (user.id === followingId) throw new Error("ติดตามตัวเองไม่ได้");
      if (isFollowing.data) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", followingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: followingId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["follow-counts", followingId] });
      qc.invalidateQueries({ queryKey: ["is-following", followingId, user?.id] });
    },
  });

  return {
    followers: counts.data?.followers ?? 0,
    following: counts.data?.following ?? 0,
    isFollowing: !!isFollowing.data,
    isSelf: user?.id === followingId,
    canFollow: !!user,
    toggle: toggle.mutate,
    isPending: toggle.isPending,
  };
};
