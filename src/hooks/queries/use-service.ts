import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { buildingServicesService } from "@/services/building-services.service";
import { RoomServiceExtra, ServiceType } from "@/types/bill";
import { AddRoomServiceExtraFormType } from "@/schemas/validation/admin.validation";
import { CreateRoomServiceExtraDTO } from "@/types/room";

export const useGetServices = (types?: ServiceType[]) => {
  return useQuery({
    queryKey: queryKeys.services.allTypeExtra(),
    queryFn: () => {
      return buildingServicesService.getServices(types);
    },
  });
};

export const useGetRoomServiceExtra = (
  room_id: string,
  initData?: RoomServiceExtra[],
) => {
  return useQuery({
    queryKey: queryKeys.services.roomServiceExtra(room_id),
    queryFn: () => {
      return buildingServicesService.getRoomServiceExtra(room_id);
    },

    initialData: initData!,
  });
};

export const useAddRoomServiceExtra = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { data: CreateRoomServiceExtraDTO }) => {
      return buildingServicesService.addRoomServiceExtra(data);
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.roomServiceExtra(payload.data.room_id),
      });
    },
  });
};
