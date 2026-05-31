import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface KycRequest {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  contact_note: string;
  admin_note: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export const useMyKycRequests = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["kyc-mine", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kyc_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as KycRequest[];
    },
  });
};

export const useSubmitKyc = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contact_note: string) => {
      const { data, error } = await supabase.rpc("submit_kyc_request", { _contact_note: contact_note });
      if (error) throw error;
      return data as KycRequest;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kyc-mine", user?.id] });
    },
  });
};

/** Admin */
export const useAdminKycList = (status: "pending" | "approved" | "rejected" | "all" = "pending") =>
  useQuery({
    queryKey: ["admin-kyc", status],
    queryFn: async () => {
      let q = supabase.from("kyc_requests").select("*, profiles!kyc_requests_user_id_fkey(display_name, username, avatar_url, email)").order("submitted_at", { ascending: false }).limit(200);
      // FK not declared; fall back to manual join
      const { data, error } = await supabase
        .from("kyc_requests")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      let rows = (data ?? []) as KycRequest[];
      if (status !== "all") rows = rows.filter((r) => r.status === status);
      const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
      if (userIds.length === 0) return rows.map((r) => ({ ...r, profile: null as any }));
      const { data: profs } = await supabase.from("profiles").select("id, display_name, username, avatar_url, email").in("id", userIds);
      const byId = new Map((profs ?? []).map((p: any) => [p.id, p]));
      return rows.map((r) => ({ ...r, profile: byId.get(r.user_id) ?? null }));
    },
  });

export const useAdminApproveKyc = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note?: string }) => {
      const { data, error } = await supabase.rpc("admin_approve_kyc", { _request_id: id, _note: note ?? "" });
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-kyc"] }),
  });
};

export const useAdminRejectKyc = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note?: string }) => {
      const { data, error } = await supabase.rpc("admin_reject_kyc", { _request_id: id, _note: note ?? "" });
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-kyc"] }),
  });
};
