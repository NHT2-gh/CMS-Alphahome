import { handlePostgresError } from "@/lib/error/postgres-error";
import { showToast } from "@/lib/toast";
import {
  CreateRoomFormType,
  UpdateRoomInfoType,
} from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult } from "@/types/common";
import { CreateRoomResponse, Room, RoomOverview } from "@/types/room";

class RoomService {
  constructor() {}

  async getRooms(buildingId: string): Promise<RoomOverview[]> {
    const query = supabase
      .from("room_overview")
      .select("*")
      .eq("building_id", buildingId)
      .order("code", { ascending: true });

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
      .from("rooms")
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

  async updateRoom(room: UpdateRoomInfoType): Promise<Room> {
    const { data: response, error } = await supabase.rpc("update_room", {
      p_code: room.code_room,
      p_area: Number(room.area),
      p_furniture_status: room.furniture_status,
      p_description: room.description,
      p_images: room.images,
      p_builidng_id: room.building_id,
    });

    if (error) {
      handlePostgresError(error);
    }
    return response;
  }
}

export const roomService = new RoomService();
