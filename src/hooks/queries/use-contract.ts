import { queryKeys } from "@/config/query-keys";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import { contractService } from "@/services/contract.service";
import { useQuery } from "@tanstack/react-query";

export function useContractByRoomId(roomId: string) {
  return useQuery({
    queryKey: queryKeys.contract.byRoomId(roomId),
    queryFn: () => {
      return contractService.getContractsByRoomId(roomId);
    },

    throwOnError(error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error),
      });

      return true;
    },
    enabled: !!roomId, // fallback
  });
}
