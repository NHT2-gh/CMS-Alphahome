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
