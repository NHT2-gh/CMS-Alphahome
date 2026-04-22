import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { buildingServicesService } from "@/services/building-services.service";
import { ServiceType } from "@/types/bill";

export const useGetServices = (type?: ServiceType) => {
  return useQuery({
    queryKey: queryKeys.services.allTypeExtra(),
    queryFn: () => {
      return buildingServicesService.getServices(type);
    },
  });
};

export const useGetRoomServiceExtra = (room_id: string) => {
  return useQuery({
    queryKey: queryKeys.services.roomServiceExtra(room_id),
    queryFn: () => {
      return buildingServicesService.getRoomServiceExtra(room_id);
    },
  });
};
