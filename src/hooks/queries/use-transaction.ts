import { queryKeys } from "@/config/query-keys";
import { CreateTransactionType } from "@/schemas/validation/admin.validation";
import { transactionService } from "@/services/transaction.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.transactions.create(),
    mutationFn: (payload: CreateTransactionType) =>
      transactionService.createTransaction(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.allByBuildingId(payload.building_id),
      });
    },
  });
}

export function useAllTransactions(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.transactions.allByBuildingId(buildingId),
    queryFn: () => transactionService.getTransaction(buildingId),
    enabled: !!buildingId,
  });
}
export function useBuildingRevenueCombined(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.buildings.buildingRevenueCombined(buildingId),
    queryFn: () => transactionService.getBuildingRevenueCombined(buildingId),
    enabled: !!buildingId,
  });
}
