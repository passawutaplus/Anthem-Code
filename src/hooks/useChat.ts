import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Database } from "@/integrations/supabase/types";

export type ChatKind = "hire" | "collab";
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

/* ───────────────── Conversations list ───────────────── */

export const useConversations = (kind?: ChatKind) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["conversations", user?.id, kind ?? "all"],
    enabled: !!user?.id,
    queryFn: async () => {
      let q = supabase
        .from("conversations")
        .select("*")
        .or(`client_id.eq.${user!.id},freelancer_id.eq.${user!.id}`)
        .order("last_message_at", { ascending: false });
      if (kind) q = q.eq("kind", kind);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Conversation[];
    },
  });

  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`conv-rt-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "shared", table: "conversations" },
        () => qc.invalidateQueries({ queryKey: ["conversations", user.id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user?.id, qc]);

  return query;
};

export const useConversation = (id: string | undefined) => {
  return useQuery({
    queryKey: ["conversation", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as Conversation | null;
    },
  });
};

/* ───────────────── Messages ───────────────── */

export const useMessages = (conversationId: string | undefined) => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  useEffect(() => {
    if (!conversationId) return;
    const ch = supabase
      .channel(`msg-rt-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "shared", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        () => qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [conversationId, qc]);

  return query;
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, content, attachmentUrl }: { conversationId: string; content: string; attachmentUrl?: string }) => {
      if (!user?.id) throw new Error("ต้องเข้าสู่ระบบ");
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        attachment_url: attachmentUrl ?? null,
      });
      if (error) throw error;
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["messages", vars.conversationId] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

/* ───────────────── Accept / Reject ───────────────── */

type AcceptArgs = {
  kind: ChatKind;
  requestId: string;
  clientId: string; // sender side
  freelancerId: string; // recipient side
  projectId?: string | null;
  projectTitle?: string;
};

export const useAcceptRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ kind, requestId, clientId, freelancerId, projectId, projectTitle }: AcceptArgs) => {
      // 1) update request status
      if (kind === "hire") {
        const { error } = await supabase.from("hiring_requests").update({ status: "ตอบรับ" as never }).eq("id", requestId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("collab_requests").update({ status: "accepted" as never }).eq("id", requestId);
        if (error) throw error;
      }

      // 2) find existing conversation or create
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("kind", kind)
        .eq("request_id", requestId)
        .maybeSingle();

      if (existing?.id) return existing.id as string;

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          kind,
          request_id: requestId,
          client_id: clientId,
          freelancer_id: freelancerId,
          project_id: projectId ?? null,
          project_title: projectTitle ?? "",
        })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({ queryKey: ["hiring_requests"] });
      qc.invalidateQueries({ queryKey: ["collab-requests"] });
    },
  });
};

export const useRejectRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ kind, requestId }: { kind: ChatKind; requestId: string }) => {
      if (kind === "hire") {
        const { error } = await supabase.from("hiring_requests").update({ status: "ปฏิเสธ" as never }).eq("id", requestId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("collab_requests").update({ status: "declined" as never }).eq("id", requestId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hiring_requests"] });
      qc.invalidateQueries({ queryKey: ["collab-requests"] });
    },
  });
};

/* ───────────────── Unread counts (sidebar badges) ───────────────── */

export const useConversationUnreadCounts = (conversationIds: string[]) => {
  const { user } = useAuth();
  const sortedIds = [...conversationIds].sort().join(",");

  return useQuery({
    queryKey: ["chat-unread-counts", user?.id, sortedIds],
    enabled: !!user?.id && conversationIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("conversation_id")
        .in("conversation_id", conversationIds)
        .neq("sender_id", user!.id)
        .is("read_at", null);
      if (error) throw error;
      const map: Record<string, number> = {};
      (data ?? []).forEach((m) => {
        map[m.conversation_id] = (map[m.conversation_id] ?? 0) + 1;
      });
      return map;
    },
  });
};

/* Find existing conversation by request (useful for "เปิดแชท" button) */
export const useFindConversationByRequest = () => {
  return async (kind: ChatKind, requestId: string) => {
    const { data } = await supabase
      .from("conversations")
      .select("id")
      .eq("kind", kind)
      .eq("request_id", requestId)
      .maybeSingle();
    return (data?.id as string | undefined) ?? null;
  };
};
