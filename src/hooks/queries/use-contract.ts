import { matationKey } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import { ContractFormType } from "@/schemas/validation/admin.validation";
import { contractService } from "@/services/contract.service";
import { Contract, ContractStatus } from "@/types/contract";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useContract(
  roomId?: string,
  initData?: Contract | null,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.contract.byRoomId(roomId!),
    queryFn: () => {
      return contractService.getContract(roomId!);
    },
    enabled: options?.enabled ?? !!roomId,
    initialData: initData
      ? {
          data: initData,
          success: true,
          message: "",
        }
      : undefined,
  });
}

export function useAddContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: matationKey.contract.add(),
    mutationFn: (contract: ContractFormType) =>
      contractService.createContract(contract),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contract.byRoomId(payload.room_id),
      });
    },
  });
}

export function useUpdateStatusContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: matationKey.contract.updateStatus(),
    mutationFn: (payload: {
      roomId: string;
      status: keyof typeof ContractStatus;
    }) => contractService.updateStatusContract(payload.roomId, payload.status),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.contract.byRoomId(payload.roomId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.detail(payload.roomId),
      });
    },
  });
}
