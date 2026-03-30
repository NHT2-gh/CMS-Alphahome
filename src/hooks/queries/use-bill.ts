import { queryKeys } from "@/config/query-keys";
import { useBuilding } from "@/context/BuildingContext";
import { billService } from "@/services/bill.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAllBillsBy(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.bills.allByBuildingId(buildingId),
    queryFn: () => {
      return billService.getAllBills(buildingId);
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

type CreateMultipleBillsPayload = {
  trackingCode: string;
  month_date: string;
  room_ids: string[];
};

type CreateOneBillsPayload = {
  trackingCode: string;
  month_date: string;
  room_id: string;
};

export function useCreateMultipleRoomMonthlyBills() {
  const queryClient = useQueryClient();
  const { building } = useBuilding();
  return useMutation({
    mutationKey: queryKeys.bills.createMultipleBills(),
    mutationFn: (payload: CreateMultipleBillsPayload) =>
      billService.createMultipleBills(
        payload.trackingCode,
        payload.month_date,
        payload.room_ids,
      ),

    onSuccess: () => {
      if (!building?.id) {
        return;
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.bills.allByBuildingId(building?.id),
      });
    },
  });
}

export function useCreateSingleRoomMonthlyBill() {
  const queryClient = useQueryClient();
  const { building } = useBuilding();
  return useMutation({
    mutationKey: queryKeys.bills.createSignleBill(),
    mutationFn: (payload: CreateOneBillsPayload) =>
      billService.createSignleBill(
        payload.trackingCode,
        payload.month_date,
        payload.room_id,
      ),

    onSuccess: () => {
      if (!building?.id) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.bills.allByBuildingId(building?.id),
      });
    },
  });
}
