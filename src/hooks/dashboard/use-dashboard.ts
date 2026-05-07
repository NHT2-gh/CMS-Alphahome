import { queryKeys } from "@/config/query-keys";
import { dashboardService } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { useBuildingDashboardRealtime } from "./use-dashboard-realtime";

export const useBuildingDashboard = (
  id?: string,
  options?: { enabled?: boolean },
) => {
  // useBuildingDashboardRealtime(id!);
  return useQuery({
    queryKey: queryKeys.dashboard.building(id!),
    queryFn: () => dashboardService.getBuildingDashboard(id!),
    ...options,
  });
};
