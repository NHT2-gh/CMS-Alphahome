import { queryKeys } from "@/config/query-keys";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import { billService } from "@/services/bill.service";
import { useQuery } from "@tanstack/react-query";

export function useAllBillsBy(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.bills.allByBuildingId(buildingId),
    queryFn: () => {
      return billService.getAllBills(buildingId);
    },
    throwOnError(error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error),
      });

      return false;
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
    throwOnError(error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error),
      });

      return false;
    },
    enabled: !!trackingCode,
  });
}

export function useBillServicesDetail(billId: string) {
  return useQuery({
    queryKey: queryKeys.bills.servicesDetail(billId),
    queryFn: () => billService.getBillServiceDetail(billId),
    throwOnError(error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error),
      });

      return false;
    },
    enabled: !!billId,
  });
}
