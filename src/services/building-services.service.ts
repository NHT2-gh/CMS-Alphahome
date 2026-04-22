import { handlePostgresError } from "@/lib/error/postgres-error";
import { UpsertBuildingServiceType } from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { RoomServiceExtra, Service, ServiceType } from "@/types/bill";
import { MutationResult } from "@/types/common";
import { BuildingService } from "@/types/utility_reading";

class BuildingServicesService {
  private tableName: string;
  private tableRoomServiceExtra: string;
  constructor() {
    this.tableName = "services";
    this.tableRoomServiceExtra = "room_service_extras";
  }
  async getRoomServiceExtra(roomId: string): Promise<RoomServiceExtra[]> {
    const query = supabase
      .from(this.tableRoomServiceExtra)
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
      .eq("room_id", roomId);

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }
  async getServices(type?: ServiceType): Promise<Service[]> {
    const query = supabase.from(this.tableName).select("*");
    if (type) {
      query.eq("service_type", type);
    }

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }
  async getBuildingServices(
    buildingId: string,
  ): Promise<BuildingService[] | null> {
    const query = supabase
      .from("building_services")
      .select(
        `
          *,
          services!inner (
            id,
            service_name,
            service_type,
            calculation_method,
            unit
          )`,
      )
      .eq("building_id", buildingId);

    const { data, error } = await query;

    if (!data || error) return [];

    return data;
  }

  async upsertBuildingServices(
    buildingId: string,
    services: UpsertBuildingServiceType[],
  ): Promise<MutationResult> {
    const query = supabase
      .from("building_services")
      .upsert(
        services.map((service) => ({
          id: service.id,
          building_id: buildingId,
          service_id: service.service_id,
          unit_price: service.unit_price,
          updated_at: new Date().toISOString(),
        })),
      )
      .select();

    const { error, data } = await query;

    if (!data) {
      return { success: false, message: "Cập nhật phí dịch vụ thất bại" };
    }

    if (error) {
      handlePostgresError(error);
    }
    return { success: true, message: "Cập nhật phí dịch vụ thành công" };
  }
}
export const buildingServicesService = new BuildingServicesService();
