/**
 * Cross-app notification feed (Anthem + So1o).
 * Backed by shared.notifications, exposed via public.notifications view.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppKey = "anthem" | "so1o" | "shared";

type NotificationRow = {
  id: string | null;
  user_id: string | null;
  app: string | null;
  kind: string | null;
  title: string | null;
  body: string | null;
  link: string | null;
  metadata: unknown;
  is_read: boolean | null;
  is_dismissed: boolean | null;
  created_at: string | null;
};

export interface Notification {
  id: string;
  user_id: string;
  app: AppKey;
  kind: string;
  title: string;
  body: string;
  link: string;
  metadata: Record<string, unknown>;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
}

function toNotification(row: NotificationRow): Notification | null {
  if (!row.id || !row.user_id) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    app: (row.app ?? "anthem") as AppKey,
    kind: row.kind ?? "",
    title: row.title ?? "",
    body: row.body ?? "",
    link: row.link ?? "",
    metadata: (row.metadata && typeof row.metadata === "object" ? row.metadata : {}) as Record<string, unknown>,
    is_read: !!row.is_read,
    is_dismissed: !!row.is_dismissed,
    created_at: row.created_at ?? new Date().toISOString(),
  };
}

export function useNotifications(userId: string | null | undefined) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("ecosystem_notifications")
      .select("*")
      .eq("is_dismissed", false)
      .order("created_at", { ascending: false })
      .limit(80);
    if (!error && data) {
      setItems(
        (data as NotificationRow[])
          .map(toNotification)
          .filter((n): n is Notification => n !== null),
      );
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchItems();
    if (!userId) return;
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "shared", table: "notifications", filter: `user_id=eq.${userId}` },
        () => fetchItems(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchItems]);

  const markRead = useCallback(async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }, []);

  const dismiss = useCallback(async (id: string) => {
    await supabase.from("notifications").update({ is_dismissed: true }).eq("id", id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

  return { items, loading, unreadCount, refetch: fetchItems, markRead, dismiss };
}
