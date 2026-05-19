import { handlePostgresError } from "@/lib/error/postgres-error";
import {
  CreateRoomFormType,
  UpdateRoomInfoType,
} from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { RoomServiceExtra } from "@/types/bill";
import { GetWithFilterParams, MutationResult } from "@/types/common";
import { CreateRoomResponse, Room, RoomOverview } from "@/types/room";

class RoomService {
  private tableName: string;
  constructor() {
    this.tableName = "rooms";
  }

  async getRooms(
    buildingId: string,
    params?: GetWithFilterParams,
  ): Promise<RoomOverview[]> {
    const query = supabase
      .from("room_overview")
      .select("*")
      .eq("building_id", buildingId)
      .order("code", { ascending: true });

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            query.in(key, value);
          } else {
            query.eq(key, value);
          }
        }
      });
    }

    const { data: rooms, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return rooms || [];
  }

  async createRoom(room: CreateRoomFormType): Promise<CreateRoomResponse> {
    const { data: response, error } = await supabase.rpc("create_room", {
      p_code: room.code_room,
      p_area: Number(room.area),
      p_furniture_status: room.furniture_status,
      p_description: room.description,
      p_images: room.images,
      p_builidng_id: room.building_id,
      p_current_rent: Number(room.current_rent),
    });

    if (error) {
      handlePostgresError(error);
    }

    return response;
  }

  async getRoomDetail(buildingCode: string, roomCode: string): Promise<Room> {
    const query = supabase
      .from(this.tableName)
      .select(`*, buildings!inner(code)`)
      .eq("code", roomCode)
      .eq("buildings.code", buildingCode)
      .single();

    const { data: room, error } = await query;

    if (error) {
      handlePostgresError(error);
    }
    return room;
  }

  async updateRoom(room: UpdateRoomInfoType): Promise<MutationResult> {
    const { error } = await supabase
      .from(this.tableName)
      .update({
        code: room.code_room,
        area: Number(room.area),
        furniture_status: room.furniture_status,
        description: room.description,
        images: room.images,
        updated_at: new Date().toISOString(),
        status: room.status,
      })
      .eq("id", room.id);

    if (error) {
      handlePostgresError(error);
    }

    return {
      success: true,
      message: "Room updated successfully",
    };
  }

  async getRoomServiceExtras(roomId: string): Promise<RoomServiceExtra[]> {
    const query = supabase
      .from("room_service_extras")
      .select(
        `
        *,
        services!inner(
          id,
          service_name,
          service_type,
          calculation_method
        )
        `,
      )
      .eq("room_id", roomId);

    const { data: roomServiceExtra, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return roomServiceExtra || [];
  }
}

export const roomService = new RoomService();
