import { FilterValue } from "@/components/_cms/components/filter/box/type";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { CreateTransactionType } from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult, ResponseStandard } from "@/types/common";
import { BuildingRevenueCombined, Transcription } from "@/types/transcription";

class TransactionService {
  private tableName: string;
  private viewBuildingRevenueCombinedTable: string;
  constructor() {
    this.tableName = "transactions";
    this.viewBuildingRevenueCombinedTable = "building_revenue_combined";
  }

  async getTransaction(
    buildingId: string,
    page?: number,
    limit?: number,
    filters?: Record<string, FilterValue>,
  ): Promise<ResponseStandard<Transcription[]>> {
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

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (key === "id") {
          query.ilike(key, `%${value}%`);
        } else if (Array.isArray(value) && key === "transaction_date") {
          query.gte(key, value[0]).lte(key, value[1]);
        } else {
          query.eq(key, value);
        }
      });
    }

    if (page && limit) {
      query.range((page - 1) * limit, page * limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return {
      data: data || [],
      pagination: {
        page: page || 1,
        limit: limit || 20,
        total: count || 0,
      },
    };
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
