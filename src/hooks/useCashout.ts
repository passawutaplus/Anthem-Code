import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { notifyAnthem } from "@/lib/notifyAnthem";

export type CashoutStatus =
  | "pending"
  | "processing"
  | "paid"
  | "mock_paid"
  | "rejected"
  | "failed";

export interface CashoutRequest {
  id: string;
  user_id: string;
  gross_px: number;
  fee_px: number;
  net_px: number;
  bank_info: { bank?: string; account_number?: string; account_name?: string };
  status: CashoutStatus;
  stripe_transfer_id?: string | null;
  failure_reason?: string | null;
  created_at: string;
  processed_at: string | null;
}

export const PLATFORM_FEE_RATE = 0.15;
export const MIN_CASHOUT_PX = 1000;

export const useCashoutHistory = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["cashouts", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cashout_requests")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CashoutRequest[];
    },
  });
};

export const useRequestCashout = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      amountPx: number;
      bank: string;
      accountNumber: string;
      accountName: string;
    }) => {
      const { data, error } = await supabase.rpc("request_cashout", {
        _amount_px: vars.amountPx,
        _bank_info: {
          bank: vars.bank,
          account_number: vars.accountNumber,
          account_name: vars.accountName,
        },
      });
      if (error) throw error;
      return data as CashoutRequest;
    },
    onSuccess: (data) => {
      notifyAnthem({ event: "cashout", request_id: data.id, status: "submitted" });
      qc.invalidateQueries({ queryKey: ["wallet", user?.id] });
      qc.invalidateQueries({ queryKey: ["cashouts", user?.id] });
    },
  });
};

export function cashoutStatusLabel(status: CashoutStatus): string {
  switch (status) {
    case "paid":
    case "mock_paid":
      return "โอนแล้ว";
    case "pending":
      return "รอดำเนินการ";
    case "processing":
      return "กำลังโอน";
    case "failed":
      return "โอนล้มเหลว";
    case "rejected":
      return "ปฏิเสธ";
    default:
      return status;
  }
}
