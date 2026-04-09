import { showToast } from "@/lib/toast";
import { supabase } from "@/supabase/supabaseClients";
import { Building } from "@/types/building";
import { BuildingService as BuildingServiceType } from "@/types/utility_reading";

export interface BuildingFilter {
  query?: string;
  filters?: {
    [key: string]: string | number;
  };
}

export interface BuildingServiceParams {
  page?: number;
  limit?: number;
  searchText?: string;
  filters?: {
    [key: string]: string | number;
  };
}

class BuildingService {
  async getBuildings({
    page,
    limit,
    searchText,
  }: BuildingServiceParams): Promise<Building[]> {
    let query = supabase
      .from("buildings")
      .select("*")
      .order("created_at", { ascending: false });

    if (page && limit) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    if (searchText) {
      query = query.ilike("address", `%${searchText}%`);
    }

    const { data, error } = await query;

    if (error) {
      showToast.error({
        title: "Lỗi",
        description: error.message,
      });
    }

    return data || [];
  }

  async getBuilding(code: string): Promise<Building | null> {
    const query = supabase.from("buildings").select("*").eq("code", code);

    const { data, error } = await query;

    if (!data || error) return null;

    return data[0];
  }

  async getBuildingServices(
    buildingId: string,
  ): Promise<BuildingServiceType[] | null> {
    const query = supabase
      .from("building_services")
      .select(
        `
        *,
        services!inner (
          id,
          service_name,
          service_type,
          calculation_method
        )`,
      )
      .eq("building_id", buildingId);

    const { data, error } = await query;

    console.log(data);

    if (!data || error) return [];

    return data;
  }
}

export const buildingService = new BuildingService();
