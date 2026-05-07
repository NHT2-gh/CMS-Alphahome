import { supabase } from "@/supabase/supabaseClients";
import { BuildingDashboard } from "@/types/dashboard";
import { ResponseStandard } from "@/types/common";

class DashboardService {
  async getBuildingDashboard(
    buildingId: string,
  ): Promise<ResponseStandard<BuildingDashboard | null>> {
    if (!buildingId) {
      return {
        data: null,
        success: false,
        message: "Building Id không tồn tại",
      };
    }
    const { data, error } = await supabase.rpc("get_building_dashboard", {
      p_building_id: buildingId,
    });

    if (error || !data) {
      return {
        data: null,
        success: false,
        message: error ? error.message : undefined,
      };
    }

    return {
      data: data,
      success: true,
      message: "Thành công lấy dữ liệu thống kê toà nhà",
    };
  }
}

export const dashboardService = new DashboardService();
