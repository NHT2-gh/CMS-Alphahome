import { adaptUtilityData } from "@/adapters/utility_reading.adapter";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { showToast } from "@/lib/toast";
import { supabase } from "@/supabase/supabaseClients";
import { UtilityReadingDetail, YearData } from "@/types/utility_reading";

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
    date: string,
  ): Promise<UtilityReadingDetail[]> {
    const getPreviousMonth = (date: string) => {
      const d = new Date(date);
      d.setMonth(d.getMonth() - 1);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");

      return `${year}-${month}-01`;
    };

    const getNextDate = (date: string) => {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

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
      .gte("month_date", getPreviousMonth(date))
      .lt("month_date", getNextDate(date))
      .order("month_date", { ascending: true });

    const { data: UtilityReadingResponse, error } = await query;

    if (error) {
      showToast.error({
        title: "Lỗi",
        description: error.message,
      });
    }

    return UtilityReadingResponse || [];
  }

  async createUtilityReading(
    payload: UtilityReadingDetail[],
  ): Promise<boolean> {
    const query = supabase.from("room_utility_readings").insert(payload);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return true;
  }
}

export const utilityReadingService = new UtilityReadingService();
