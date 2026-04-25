import { queryKeys } from "@/config/query-keys";
import { useBuilding } from "@/context/BuildingContext";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import {
  CreateRoomFormType,
  UpdateRoomInfoType,
} from "@/schemas/validation/admin.validation";
import { roomService } from "@/services/room.service";
import { GetWithFilterParams } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useAllRooms(
  buildingId?: string,
  params?: GetWithFilterParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.rooms.list(buildingId!, params!),
    queryFn: () => {
      return roomService.getRooms(buildingId!, params);
    },

    enabled: options?.enabled ?? !!buildingId,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  const { building } = useBuilding();

  return useMutation({
    mutationKey: queryKeys.rooms.create(),
    mutationFn: (payload: CreateRoomFormType) =>
      roomService.createRoom(payload),
    onSuccess: (data) => {
      if (!building?.id) {
        return;
      } else if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.rooms.list(building?.id),
        });
        return data;
      }
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
