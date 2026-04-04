import { queryKeys } from "@/config/query-keys";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import { contractService } from "@/services/contract.service";
import { useQuery } from "@tanstack/react-query";

export function useContract(roomId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.contract.byRoomId(roomId!),
    queryFn: () => {
      return contractService.getContract(roomId!);
    },

    enabled: options?.enabled ?? !!roomId,
  });
}
