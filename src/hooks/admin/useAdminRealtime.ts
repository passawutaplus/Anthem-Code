import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to Postgres realtime changes on admin-managed tables and invalidates
 * the corresponding React Query caches so admin pages update instantly without refresh.
 */
export function useAdminRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("admin-realtime")
      // Ads
      .on("postgres_changes", { event: "*", schema: "public", table: "ad_campaigns" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-ad-campaigns"] });
        qc.invalidateQueries({ queryKey: ["admin-ad-overview"] });
        qc.invalidateQueries({ queryKey: ["active-ads"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "ad_applications" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-ad-applications"] });
        qc.invalidateQueries({ queryKey: ["my-ad-applications"] });
        qc.invalidateQueries({ queryKey: ["admin-ad-overview"] });
        qc.invalidateQueries({ queryKey: ["ad-app-notifications"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "ad_events" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-ad-overview"] });
        qc.invalidateQueries({ queryKey: ["ad-daily-stats"] });
      })
      // Core entities
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-projects"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-users"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "studios" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-studios"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "job_posts" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "hiring_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-hiring"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "collab_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-collabs"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}
