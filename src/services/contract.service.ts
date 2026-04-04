import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { Contract } from "@/types/contract";

class ContractService {
  private tableName: string;
  constructor() {
    this.tableName = "contracts";
  }

  async getContract(roomId: string): Promise<Contract> {
    const query = supabase
      .from(this.tableName)
      .select("*")
      .eq("room_id", roomId)
      .single();

    const { data: contract, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return contract;
  }
}

export const contractService = new ContractService();
