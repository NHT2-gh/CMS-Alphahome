import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { buildingService } from "@/services/building.service";
import { buildingServicesService } from "@/services/building-services.service";
import { GetWithFilterParams } from "@/types/common";
import { CreateBuildingFormType } from "@/schemas/validation/admin.validation";

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

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBuildingFormType) => {
      const [start_date, end_date] = data.contract_term.split(" to ");
      return buildingService.createBuilding({
        code: data.code,
        address: data.address,
        price_rent: data.price_rent,
        price_deposit: data.price_deposit,
        start_date: start_date as string,
        end_date: end_date as string,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings.list() });
    },
  });
};
