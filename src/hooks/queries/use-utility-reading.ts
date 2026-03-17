import { useQuery } from "@tanstack/react-query";
import { utilityReadingService } from "@/services/utility_reading.service";
import { queryKeys } from "@/config/query-keys";

export function useUtilityReadingOverview(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.utilityReading.overview(buildingId),
    queryFn: () => utilityReadingService.getUtilityReadingOverview(buildingId),
  });
}

export function useUtilityReadingByDate(buildingId: string, date: string) {
  return useQuery({
    queryKey: queryKeys.utilityReading.detail(buildingId, date),
    queryFn: () =>
      utilityReadingService.getUtilityReadingByDate(buildingId, date),
  });
}
