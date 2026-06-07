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
      // Core entities (matches useAdminList query keys)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "projects"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "profiles"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "studios" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "studios"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "job_posts" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "job_posts"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "hiring_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "hiring_requests"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "collab_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "collab_requests"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "project_comments" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "project_comments"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "collections" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "collections"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "inspire_boards" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-list", "inspire_boards"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "gifts" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-gifts-catalog"] });
      })
      .on("postgres_changes", { event: "*", schema: "shared", table: "notifications" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-notifications"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "aml_flags" }, () => {
        qc.invalidateQueries({ queryKey: ["aml-flags"] });
        qc.invalidateQueries({ queryKey: ["aml-overview"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "kyc_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["kyc-requests"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "project_likes" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
        qc.invalidateQueries({ queryKey: ["admin-platform-activity"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "follows" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
        qc.invalidateQueries({ queryKey: ["admin-platform-activity"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "gift_transactions" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
        qc.invalidateQueries({ queryKey: ["admin-platform-activity"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
        qc.invalidateQueries({ queryKey: ["admin-platform-activity"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "platform_events" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-platform-activity"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "user_reports" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-alert-counts"] });
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "cashout_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-alert-counts"] });
        qc.invalidateQueries({ queryKey: ["admin-wallet-ledger"] });
        qc.invalidateQueries({ queryKey: ["admin-stats"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "job_applications" }, () => {
        qc.invalidateQueries({ queryKey: ["admin-applications"] });
        qc.invalidateQueries({ queryKey: ["admin-analytics"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}
