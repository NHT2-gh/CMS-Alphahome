import { queryKeys } from "@/config/query-keys";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import { roomService } from "@/services/room.service";
import { useQuery } from "@tanstack/react-query";

export default function useRoom(
  buildingId?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.rooms.list(buildingId!),
    queryFn: () => {
      return roomService.getRoomsByBuildingId(buildingId!);
    },

    enabled: options?.enabled ?? !!buildingId,
  });
}
