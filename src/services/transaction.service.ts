import { handlePostgresError } from "@/lib/error/postgres-error";
import { CreateTransactionType } from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult } from "@/types/common";
import { BuildingRevenueCombined, Transcription } from "@/types/transcription";

class TransactionService {
  private tableName: string;
  private viewBuildingRevenueCombinedTable: string;
  constructor() {
    this.tableName = "transactions";
    this.viewBuildingRevenueCombinedTable = "building_revenue_combined";
  }

  async getTransaction(buildingId: string): Promise<Transcription[]> {
    const query = supabase
      .from(this.tableName)
      .select(
        `
        *,
        categories!inner(
          name
        )
        `,
      )
      .eq("building_id", buildingId);

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }

  async createTransaction(
    transaction: CreateTransactionType,
  ): Promise<MutationResult> {
    const query = supabase.from(this.tableName).insert(transaction);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }
    return {
      success: true,
      message: "Thành công thêm hạng mục",
    };
  }

  async getBuildingRevenueCombined(
    buildingId: string,
  ): Promise<BuildingRevenueCombined[]> {
    const query = supabase
      .from(this.viewBuildingRevenueCombinedTable)
      .select("*")
      .eq("building_id", buildingId);

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }

  async deleteTransaction(id: string): Promise<MutationResult> {
    const query = supabase.from(this.tableName).delete().eq("id", id);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }
    return {
      success: true,
      message: "Thành công xóa giao dịch",
    };
  }
}

export const transactionService = new TransactionService();
