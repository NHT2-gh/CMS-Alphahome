import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { roomRentHistoryService } from "@/services/rent_history.service";
import { MutationResult } from "@/types/common";
import { queryKeys } from "@/config/query-keys";

export const useRoomRentHistory = (room_id: string) => {
  return useQuery({
    queryKey: queryKeys.historyRent.all(room_id),
    queryFn: () => {
      return roomRentHistoryService.getRoomRentHistory(room_id!);
    },
  });
};

export const useCreateRentHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.historyRent.create(),
    mutationFn: (payload: { roomId: string; rent: number }) =>
      roomRentHistoryService.createRentHistory(payload.roomId, payload.rent),

    onSuccess(_, payload) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.historyRent.all(payload.roomId),
      });
    },
  });
};
