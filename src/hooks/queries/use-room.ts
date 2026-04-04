import { queryKeys } from "@/config/query-keys";
import { useBuilding } from "@/context/BuildingContext";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import { CreateRoomFormType } from "@/schemas/validation/admin.validation";
import { roomService } from "@/services/room.service";
import { MutationResult } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useRoom(
  buildingId?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.rooms.list(buildingId!),
    queryFn: () => {
      return roomService.getRooms(buildingId!);
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
      console.log(error.message);
      return {
        success: false,
        message: mapErrorToMessage(error),
      };
    },
  });
}
