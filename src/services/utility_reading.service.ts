import { adaptUtilityData } from "@/adapters/utility_reading.adapter";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult } from "@/types/common";
import {
  UtilityReadingDetail,
  UtilityReadingDetailDTO,
  YearData,
} from "@/types/utility_reading";

class UtilityReadingService {
  async getUtilityReadingOverview(
    buildingId: string,
  ): Promise<Map<number, YearData>> {
    const query = supabase
      .from("building_utility_monthly_summary")
      .select("*")
      .eq("building_id", buildingId)
      .order("month", { ascending: false });

    const { data: UtilityReadingResponse, error } = await query;

    const utilityReadingOverview = adaptUtilityData(
      UtilityReadingResponse || [],
    );

    if (error) {
      handlePostgresError(error);
    }

    return utilityReadingOverview;
  }

  async getUtilityReadingByDate(
    buildingId: string,
    startDate: string,
    endDate: string,
  ): Promise<UtilityReadingDetail[]> {
    const query = supabase
      .from("room_utility_readings")
      .select(
        `
    *,
    rooms!inner (
      building_id,
      code
    )
  `,
      )
      .eq("rooms.building_id", buildingId)
      .gte("month_date", startDate)
      .lt("month_date", endDate)
      .order("updated_at", { ascending: true });

    const { data: UtilityReadingResponse, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return UtilityReadingResponse || [];
  }

  async createUtilityReading(
    payload: UtilityReadingDetailDTO[],
  ): Promise<boolean> {
    const query = supabase.from("room_utility_readings").insert(payload);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return true;
  }

  async updateUtilityReading(
    payload: UtilityReadingDetail[],
  ): Promise<MutationResult> {
    const query = supabase.from("room_utility_readings").upsert(payload);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return {
      success: true,
      message: "Cập nhật thành công",
    };
  }
}

export const utilityReadingService = new UtilityReadingService();
