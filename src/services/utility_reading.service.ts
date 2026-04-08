import { adaptUtilityData } from "@/adapters/utility_reading.adapter";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { showToast } from "@/lib/toast";
import { supabase } from "@/supabase/supabaseClients";
import { UtilityReadingDetail, YearData } from "@/types/utility_reading";
import { getNextDate, getPreviousMonth } from "@/utils/getTime";

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
      .order("month_date", { ascending: true });

    const { data: UtilityReadingResponse, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return UtilityReadingResponse || [];
  }

  async createUtilityReading(
    payload: UtilityReadingDetail[],
  ): Promise<boolean> {
    const query = supabase.from("room_utility_readings").insert(payload);

    console.log(payload);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return true;
  }
}

export const utilityReadingService = new UtilityReadingService();
