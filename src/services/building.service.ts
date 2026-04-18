import { handlePostgresError } from "@/lib/error/postgres-error";
import { showToast } from "@/lib/toast";
import { supabase } from "@/supabase/supabaseClients";
import { Building, UserBuilding } from "@/types/building";
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
  async getAllBuildings({
    page,
    limit,
    searchText,
  }: BuildingServiceParams): Promise<Building[]> {
    const query = supabase
      .from("buildings")
      .select("*")
      .order("created_at", { ascending: false });

    if (page && limit) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query.range(from, to);
    }

    if (searchText) {
      query.ilike("address", `%${searchText}%`);
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

    if (!data || error) return [];

    return data;
  }

  async getBuildingsByUserId(
    userId: string,
    { page, limit, searchText }: BuildingServiceParams,
  ): Promise<UserBuilding[]> {
    const query = supabase
      .from("users_building")
      .select(
        `
        *,
        buildings!inner (*)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (page && limit) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query.range(from, to);
    }

    if (searchText) {
      query.ilike("address", `%${searchText}%`);
    }

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }

  async getUsersBuilding(buildingId: string): Promise<UserBuilding[] | null> {
    const query = supabase
      .from("users_building")
      .select(
        `
        *,
        profiles!inner (
          id,
          full_name,
          phone,
          email
        )
      `,
      )
      .eq("building_id", buildingId)
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) return handlePostgresError(error);

    return data;
  }
}

export const buildingService = new BuildingService();
