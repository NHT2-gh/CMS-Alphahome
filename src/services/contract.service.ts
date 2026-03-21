import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { Contract } from "@/types/contract";

class ContractService {
  constructor() {}

  async getContractsByRoomId(roomId: string): Promise<Contract[]> {
    const query = supabase.from("contracts").select("*").eq("room_id", roomId);

    const { data: contracts, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return contracts || [];
  }
}

export const contractService = new ContractService();
