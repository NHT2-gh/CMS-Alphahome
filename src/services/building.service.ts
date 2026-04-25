import { handlePostgresError } from "@/lib/error/postgres-error";
import { showToast } from "@/lib/toast";
import {
  UpdateBuildingInfoType,
  UpsertUsersBuildingType,
} from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { Building, UserBuilding } from "@/types/building";
import { GetWithFilterParams, MutationResult } from "@/types/common";

export interface BuildingFilter {
  query?: string;
  filters?: {
    [key: string]: string | number;
  };
}

class BuildingService {
  async getAllBuildings({
    page,
    limit,
    searchText,
  }: GetWithFilterParams): Promise<Building[]> {
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

  async getBuildingsByUserId(
    userId: string,
    { page, limit, searchText }: GetWithFilterParams,
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
          email,
          role
        )
      `,
      )
      .eq("building_id", buildingId);

    const { data, error } = await query;

    if (error) return handlePostgresError(error);

    return data;
  }

  async updateBuildingInfo(
    buildingId: string,
    data: UpdateBuildingInfoType,
  ): Promise<MutationResult> {
    const updateBuildingQuery = supabase
      .from("buildings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", buildingId)
      .select();

    const { data: updatedBuilding, error } = await updateBuildingQuery;

    if (!updatedBuilding) {
      return {
        success: false,
        message: "Cập nhật thông tin căn hộ thất bại",
      };
    }
    if (error) {
      handlePostgresError(error);
    }

    return {
      success: true,
      message: "Cập nhật thông tin căn hộ thành công",
    };
  }

  async updateBuildingUsers(
    buildingId: string,
    usersBuilding: UpsertUsersBuildingType[],
  ): Promise<MutationResult> {
    const query = supabase
      .from("users_building")
      .upsert(
        usersBuilding.map((user) => ({
          id: user.id,
          building_id: buildingId,
          user_id: user.user_id,
          role: user.role,
        })),
      )
      .select();

    const { error, data } = await query;

    if (!data) {
      return {
        success: false,
        message: "Cập nhật thông tin người dùng thất bại",
      };
    }

    if (error) {
      handlePostgresError(error);
    }
    return {
      success: true,
      message: "Cập nhật thông tin người dùng thành công",
    };
  }

  async deleteBuildingUser(
    buildingId: string,
    userBuildingIds: string[],
  ): Promise<MutationResult> {
    const query = supabase
      .from("users_building")
      .delete()
      .eq("building_id", buildingId)
      .in("id", userBuildingIds);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }
    return {
      success: true,
      message: "Xóa người dùng khỏi căn hộ thành công",
    };
  }
}

export const buildingService = new BuildingService();
