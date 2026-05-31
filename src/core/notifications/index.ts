/**
 * Cross-app notification feed (Anthem + So1o).
 * Backed by shared.notifications, exposed via public.notifications view.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppKey = "anthem" | "so1o" | "shared";

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

export function useNotifications(userId: string | null | undefined) {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // `public.notifications` is a view bridging shared.notifications and is not
  // yet in the generated types — escape via `any` until types regenerate.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tbl = () => (supabase as any).from("notifications");

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await tbl()
      .select("*")
      .eq("is_dismissed", false)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setItems(data as Notification[]);
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
    await tbl().update({ is_read: true }).eq("id", id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }, []);

  const dismiss = useCallback(async (id: string) => {
    await tbl().update({ is_dismissed: true }).eq("id", id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const unreadCount = items.filter((n) => !n.is_read).length;

  return { items, loading, unreadCount, refetch: fetchItems, markRead, dismiss };
}
