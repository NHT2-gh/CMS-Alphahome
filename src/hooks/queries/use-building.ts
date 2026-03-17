import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import {
  buildingService,
  BuildingServiceParams,
} from "@/services/building.service";

export const useBuilding = (params: BuildingServiceParams) => {
  return useQuery({
    queryKey: queryKeys.buildings.list(params),
    queryFn: () => {
      return buildingService.getBuildings(params);
    },

    staleTime: 5 * 60 * 1000,
    throwOnError: true,
    refetchOnReconnect: false,
  });
};

export const useBuildingDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.buildings.detail(id),
    queryFn: () => {
      return buildingService.getBuildingById(id);
    },

    staleTime: 5 * 60 * 1000,
    throwOnError: true,
    refetchOnReconnect: false,
  });
};
