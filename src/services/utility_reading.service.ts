import { adaptUtilityData } from "@/adapters/utility_reading.adapter";
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
      showToast.error({
        title: "Lỗi",
        description: error.message,
      });
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

    const query = supabase
      .from("room_utility_readings")
      .select(
        `
    *,
    rooms!inner (
      building_id
    )
  `,
      )
      .eq("rooms.building_id", buildingId)
      .gte("month_date", getPreviousMonth(date))
      .lt("month_date", date)
      .order("month_date", { ascending: false });

    const { data: UtilityReadingResponse, error } = await query;

    if (error) {
      showToast.error({
        title: "Lỗi",
        description: error.message,
      });
    }

    return UtilityReadingResponse || [];
  }
}

export const utilityReadingService = new UtilityReadingService();
