import { Contract } from "./contract";

export type FurnitureStatus = "unfurnished" | "basic" | "fully_furnished";

export type RoomStatus = "available" | "on_hold" | "rented";

export interface RoomOverview {
  room_id: string;
  code: string;
  occupants_count: number;
  deposit_amount: number;
  current_rent: number;
  status: RoomStatus;
  area: number;
  furniture_status: FurnitureStatus;
  tenant_name: string;
  start_date: string;
  end_date: string;
  updated_at: string;
}

export interface Room {
  id: string;
  code: string;
  area: number;
  furniture_status: FurnitureStatus;
  description: string;
  images: string[];
}

export interface RoomDetail extends Room {
  room_rent_history: RoomRentHistory[];
  contract: Contract[];
}

export interface RoomRentHistory {
  id: string;
  room_id: string;
  rent_price: string;
  effective_from: string;
  effective_to: string;
}

export interface CreateRoomResponse {
  room: Room;
  room_rent_history: RoomRentHistory;
  message: string;
}
