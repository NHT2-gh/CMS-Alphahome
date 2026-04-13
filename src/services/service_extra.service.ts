import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { RoomServiceExtra, Service, ServiceType } from "@/types/bill";

class ServiceExtraService {
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
  async getAllServiceExtra(): Promise<Service[]> {
    const query = supabase
      .from(this.tableName)
      .select("*")
      .eq("service_type", "extra" as ServiceType);

    const { data, error } = await query;

    console.log(data);

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }
}
export const serviceExtraService = new ServiceExtraService();
