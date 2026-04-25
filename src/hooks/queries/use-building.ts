import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { buildingService } from "@/services/building.service";
import { buildingServicesService } from "@/services/building-services.service";
import { GetWithFilterParams } from "@/types/common";

export const useBuildings = (params: GetWithFilterParams) => {
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
      return buildingServicesService.getBuildingServices(id!);
    },
    ...options,
  });
};

export const useUsersBuilding = (
  userId: string,
  params: GetWithFilterParams,
) => {
  return useQuery({
    queryKey: queryKeys.buildings.usersBuilding(userId),
    queryFn: () => {
      return buildingService.getBuildingsByUserId(userId, params);
    },
  });
};
