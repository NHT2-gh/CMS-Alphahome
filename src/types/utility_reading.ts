import { Service } from "./bill";

export type UtilityReadingType = "electricity" | "water";

export interface UtilityReading {
  utility_type: UtilityReadingType;
  total_consumption: number;
}

export interface MonthData {
  month: string;
  utility_readings: UtilityReading[];
}

export interface YearData {
  total_rooms: number;
  data: MonthData[];
}
export interface UtilityReadingResponse {
  month: string;
  utility_type: UtilityReadingType;
  total_consumption: string;
  total_rooms: number;
}

export interface BuildingService {
  id: string;
  services: Service;
  building_id: string;
  unit_price: number;
}

export interface UtilityReadingDetail {
  type: UtilityReadingType;
  previous_reading: number | null;
  current_reading: number | null;
  consumption: number | null;
  room_id: string;
  month_date: string;
  building_service_id: string;
}
