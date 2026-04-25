import { Contract } from "./contract";

export enum FurnitureStatus {
  unfurnished = "unfurnished",
  basic = "basic",
  fully_furnished = "fully_furnished",
}

export enum RoomStatus {
  available = "Trống",
  on_hold = "Giữ phòng",
  rented = "Đã thuê",
}

export interface RoomOverview {
  room_id: string;
  code: string;
  occupants_count: number;
  deposit_amount: number;
  current_rent: number;
  status: keyof typeof RoomStatus;
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
  rent_price: number;
  effective_from: string;
  effective_to: string;
}

export interface CreateRoomResponse {
  room: Room;
  room_rent_history: RoomRentHistory;
  message: string;
}
