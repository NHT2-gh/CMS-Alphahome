import { CalculationMethod, Service, ServiceType } from "./bill";

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
  total_consumption: number;
  total_rooms: number;
}

export interface BuildingService {
  id: string;
  services: Service;
  building_id: string;
  unit_price: number;
  updated_at: string;
  updated_by: string;
}

export interface BuildingServiceCreateDTO {
  id: string;
  service_id: string;
  service_type: ServiceType;
  unit_price: number;
  calculation_method: keyof typeof CalculationMethod;
  unit?: string;
}

export interface UtilityReadingDetail {
  id: string;
  type: UtilityReadingType;
  previous_reading: number | null;
  current_reading: number | null;
  consumption: number | null;
  room_id: string;
  month_date: string;
  building_service_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface UtilityReadingDetailDTO {
  type: UtilityReadingType;
  previous_reading: number | null;
  current_reading: number | null;
  consumption: number | null;
  room_id: string;
  month_date: string;
  building_service_id: string;
}
