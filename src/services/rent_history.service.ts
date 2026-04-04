import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult } from "@/types/common";
import { RoomRentHistory } from "@/types/room";

class RentHistory {
  private tableName: string;
  constructor() {
    this.tableName = "room_rent_histories";
  }

  async getRoomRentHistory(roomId: string): Promise<RoomRentHistory[]> {
    const query = supabase
      .from(this.tableName)
      .select("*")
      .eq("room_id", roomId)
      .is("effective_to", null)
      .order("effective_from", { ascending: false });

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }

  async updateRentHistory(
    roomId: string,
    rent: number,
  ): Promise<MutationResult> {
    const query = supabase.from(this.tableName).insert({
      room_id: roomId,
      rent,
    });

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return {
      success: true,
      message: "Tạo phòng thành công",
    };
  }
}

export const roomRentHistoryService = new RentHistory();
