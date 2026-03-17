import { showToast } from "@/lib/toast";
import { supabase } from "@/supabase/supabaseClients";
import { RoomOverview } from "@/types/room";

class RoomService {
  constructor() {}

  async getRoomsByBuildingId(buildingId: string): Promise<RoomOverview[]> {
    const query = supabase
      .from("room_overview")
      .select("*")
      .eq("building_id", buildingId)
      .order("code", { ascending: true });

    const { data: rooms, error } = await query;

    if (error) {
      showToast.error({
        title: "Lỗi",
        description: error.message,
      });
    }

    return rooms || [];
  }
}

export const roomService = new RoomService();
