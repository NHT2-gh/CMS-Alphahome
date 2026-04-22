import { Profile } from "./profile";
import { BuildingService } from "./utility_reading";

export enum TenantRole {
  owner = "Chủ sở hữu",
  manager = "Quản lý",
}

export interface Building {
  id: string;
  code: string;
  address: string;
  price_rent: number;
  price_deposit: number;
  start_date: string | null;
  end_date: string | null;
  total_rooms: number;
  number_available_rooms: number;
  is_active: boolean;
}

export interface UserBuilding {
  id: string;
  building_id: string;
  created_at: string;
  created_by: string;
  profiles: Profile;
  buildings: Building;
  role: keyof typeof TenantRole;
}

export interface UserBuildingUpsertDTO {
  user_id: string;
  role: keyof typeof TenantRole;
}

export interface BuildingSetting {
  info: Building;
  services: BuildingService[];
  users: UserBuilding[];
}
