import { queryKeys } from "@/config/query-keys";
import { useBuilding } from "@/context/BuildingContext";
import { mapErrorToMessage } from "@/lib/error/app-error";
import {
  CreateRoomFormType,
  UpdateRoomInfoType,
} from "@/schemas/validation/admin.validation";
import { roomService } from "@/services/room.service";
import { GetWithFilterParams } from "@/types/common";
import { Room } from "@/types/room";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useAllRooms(
  buildingId?: string,
  params?: GetWithFilterParams,
) {
  return useQuery({
    queryKey: queryKeys.rooms.list(buildingId, params),
    queryFn: () => {
      return roomService.getRooms(buildingId, params);
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.rooms.create(),
    mutationFn: (payload: CreateRoomFormType) =>
      roomService.createRoom(payload),
    onSuccess: (data, payload) => {
      if (payload) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.rooms.list(payload.building_id),
        });
      }
      return data;
    },
    onError: (error) => {
      return {
        success: false,
        message: mapErrorToMessage(error),
      };
    },
  });
}

export function useUpdateRoom() {
  return useMutation({
    mutationKey: queryKeys.rooms.update(),
    mutationFn: (payload: UpdateRoomInfoType) =>
      roomService.updateRoom(payload),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      return {
        success: false,
        message: mapErrorToMessage(error),
      };
    },
  });
}

export function useGetRoomDetail(buildingCode?: string, initData?: Room) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(initData!.id),
    queryFn: () => {
      return roomService.getRoomDetail(buildingCode!, initData!.code);
    },

    initialData: initData,
  });
}
