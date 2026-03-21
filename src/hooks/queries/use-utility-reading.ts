import { useQuery } from "@tanstack/react-query";
import { utilityReadingService } from "@/services/utility_reading.service";
import { queryKeys } from "@/config/query-keys";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";

export function useUtilityReadingOverview(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.utilityReading.overview(buildingId),
    queryFn: () => utilityReadingService.getUtilityReadingOverview(buildingId),
    throwOnError(error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error),
      });

      return true;
    },
  });
}

export function useUtilityReadingByDate(buildingId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.utilityReading.detail(buildingId, date),
    queryFn: () =>
      utilityReadingService.getUtilityReadingByDate(buildingId, date),
    throwOnError(error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error),
      });

      return true;
    },
  });
}
