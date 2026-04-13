import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { serviceExtraService } from "@/services/service_extra.service";

export const useAllServiceExtra = () => {
  return useQuery({
    queryKey: queryKeys.services.allTypeExtra(),
    queryFn: () => {
      return serviceExtraService.getAllServiceExtra();
    },
  });
};

export const useGetRoomServiceExtra = (room_id: string) => {
  return useQuery({
    queryKey: queryKeys.services.roomServiceExtra(room_id),
    queryFn: () => {
      return serviceExtraService.getRoomServiceExtra(room_id);
    },
  });
};
