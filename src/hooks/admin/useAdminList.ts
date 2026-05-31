import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type TableName =
  | "profiles" | "studios" | "projects" | "job_posts" | "hiring_requests"
  | "collab_requests" | "conversations" | "project_comments" | "collections"
  | "admin_audit_log";

export function useAdminList<T>(table: TableName, select = "*", orderCol = "created_at") {
  return useQuery<T[]>({
    queryKey: ["admin-list", table, select],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select(select).order(orderCol, { ascending: false }).limit(200);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}
