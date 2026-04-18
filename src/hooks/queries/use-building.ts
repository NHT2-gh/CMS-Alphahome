import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import {
  buildingService,
  BuildingServiceParams,
} from "@/services/building.service";

export const useBuildings = (params: BuildingServiceParams) => {
  return useQuery({
    queryKey: queryKeys.buildings.list(params),
    queryFn: () => {
      return buildingService.getAllBuildings(params);
    },
  });
};

export const useBuildingDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.buildings.detail(id),
    queryFn: () => {
      return buildingService.getBuilding(id);
    },
  });
};

export const useBuildingServices = (
  id?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.buildings.services(id!),
    queryFn: () => {
      return buildingService.getBuildingServices(id!);
    },
    ...options,
  });
};

export const useUsersBuilding = (
  userId: string,
  params: BuildingServiceParams,
) => {
  return useQuery({
    queryKey: queryKeys.buildings.usersBuilding(userId),
    queryFn: () => {
      return buildingService.getBuildingsByUserId(userId, params);
    },
  });
};
