import { FilterValue } from "@/components/_cms/components/filter/box/type";
import { queryKeys } from "@/config/query-keys";
import { CreateTransactionType } from "@/schemas/validation/admin.validation";
import { transactionService } from "@/services/transaction.service";
import { Pagination } from "@/types/common";
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

export function useAllTransactions({
  buildingId,
  pagination,
  filters,
}: {
  buildingId: string;
  pagination: Pagination;
  filters: Record<string, FilterValue>;
}) {
  return useQuery({
    queryKey: queryKeys.transactions.allByBuildingId(
      buildingId,
      pagination,
      filters,
    ),
    queryFn: () =>
      transactionService.getTransaction(
        buildingId,
        pagination.page,
        pagination.limit,
        filters,
      ),
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

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.transactions.delete(),
    mutationFn: (payload: { id: string; buildingId: string }) =>
      transactionService.deleteTransaction(payload.id),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.allByBuildingId(payload.buildingId),
      });
    },
  });
}
