import { useQuery } from "@tanstack/react-query";
import { utilityReadingService } from "@/services/utility_reading.service";
import { queryKeys } from "@/config/query-keys";

export function useUtilityReadingOverview(
  buildingId?: string,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: queryKeys.utilityReading.overview(buildingId!),
    queryFn: () => utilityReadingService.getUtilityReadingOverview(buildingId!),
    enabled: !!buildingId && options?.enabled,
  });
}

export function useUtilityReadingByDate(
  buildingId?: string,
  startDate?: string,
  endDate?: string,
  options?: {
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: queryKeys.utilityReading.detail(buildingId!, startDate!),
    queryFn: () =>
      utilityReadingService.getUtilityReadingByDate(
        buildingId!,
        startDate!,
        endDate!,
      ),
    enabled: !!buildingId && !!startDate && options?.enabled,
  });
}
