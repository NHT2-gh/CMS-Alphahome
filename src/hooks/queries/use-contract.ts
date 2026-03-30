import { queryKeys } from "@/config/query-keys";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import { contractService } from "@/services/contract.service";
import { useQuery } from "@tanstack/react-query";

export function useContractByRoomId(
  roomId?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.contract.byRoomId(roomId!),
    queryFn: () => {
      return contractService.getContractsByRoomId(roomId!);
    },

    enabled: options?.enabled ?? !!roomId,
  });
}
