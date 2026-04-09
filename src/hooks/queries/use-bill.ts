import { FilterValue } from "@/components/_cms/components/filter/box/type";
import { queryKeys } from "@/config/query-keys";
import { billService } from "@/services/bill.service";
import { BillStatus } from "@/types/bill";
import { Pagination } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CreateMultipleBillsPayload = {
  trackingCode: string;
  month_date: string;
  room_ids: string[];
  building_id: string;
};

type CreateOneBillsPayload = {
  trackingCode: string;
  month_date: string;
  room_id: string;
  building_id: string;
};

export function useAllBills({
  buildingId,
  pagination,
  filters,
}: {
  buildingId: string;
  pagination?: Pagination;
  filters?: Record<string, FilterValue>;
}) {
  return useQuery({
    queryKey: queryKeys.bills.allByBuildingId(buildingId, pagination, filters),
    queryFn: () => {
      return billService.getAllBills(
        buildingId,
        pagination?.page,
        pagination?.limit,
        filters,
      );
    },

    enabled: !!buildingId,
  });
}

export function useBill(trackingCode: string) {
  return useQuery({
    queryKey: queryKeys.bills.byTrackingCode(trackingCode),
    queryFn: () => {
      return billService.getBill(trackingCode);
    },
    enabled: !!trackingCode,
  });
}

export function useBillServicesDetail(billId: string) {
  return useQuery({
    queryKey: queryKeys.bills.servicesDetail(billId),
    queryFn: () => billService.getBillServiceDetail(billId),
    enabled: !!billId,
  });
}

export function useCreateMultipleRoomMonthlyBills() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.bills.createMultipleBills(),
    mutationFn: (payload: CreateMultipleBillsPayload) =>
      billService.createMultipleBills(
        payload.trackingCode,
        payload.month_date,
        payload.room_ids,
      ),

    onSuccess: (_, payload) => {
      if (!payload.building_id) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.bills.allByBuildingId(payload.building_id),
      });
    },
  });
}

export function useCreateSingleRoomMonthlyBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.bills.createSignleBill(),
    mutationFn: (payload: CreateOneBillsPayload) =>
      billService.createSignleBill(
        payload.trackingCode,
        payload.month_date,
        payload.room_id,
      ),

    onSuccess: (_, payload) => {
      if (!payload.building_id) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.bills.allByBuildingId(payload.building_id),
      });
    },
  });
}

export function useUpdateStatusBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.bills.updateStatusBill(),
    mutationFn: (paylod: { tracking_code: string; status: BillStatus }) =>
      billService.updateStatusBill(paylod.tracking_code, paylod.status),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bills.byTrackingCode(payload.tracking_code),
      });
    },
  });
}
