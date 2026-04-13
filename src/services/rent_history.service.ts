import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult } from "@/types/common";
import { RoomRentHistory } from "@/types/room";
import { formatDate, formatDateTime } from "@/utils/format-data";

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

      .order("effective_from", { ascending: false });

    const { data, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return data || [];
  }

  async createRentHistory(
    roomId: string,
    rent_price: number,
  ): Promise<MutationResult> {
    const query = supabase.from(this.tableName).insert({
      room_id: roomId,
      rent_price: rent_price,
      effective_from: formatDateTime(new Date().toISOString(), {
        withTime: false,
      }),
    });

    const { error } = await query;

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
