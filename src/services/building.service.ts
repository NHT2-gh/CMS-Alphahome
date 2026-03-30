import { showToast } from "@/lib/toast";
import { supabase } from "@/supabase/supabaseClients";
import { Building } from "@/types/building";

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

  async getBuildingById(id: string): Promise<Building | null> {
    const query = supabase.from("buildings").select("*").eq("id", id);

    const { data, error } = await query;

    if (!data || error) return null;

    return data[0];
  }

  async getBuildingServices(buildingId: string): Promise<Building | null> {
    const query = supabase
      .from("building_services")
      .select("*")
      .eq("building_id", buildingId);

    const { data, error } = await query;

    if (!data || error) return null;

    return data[0];
  }
}

export const buildingService = new BuildingService();
