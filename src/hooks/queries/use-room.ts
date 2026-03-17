import { queryKeys } from "@/config/query-keys";
import { roomService } from "@/services/room.service";
import { useQuery } from "@tanstack/react-query";

export default function useRoom(buildingId: string) {
  return useQuery({
    queryKey: queryKeys.rooms.list(buildingId),
    queryFn: () => {
      return roomService.getRoomsByBuildingId(buildingId);
    },
  });
}
