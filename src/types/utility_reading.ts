export type UtilityReadingType = "electricity" | "water";

export interface UtilityReading {
  utility_type: UtilityReadingType;
  total_consumption: string;
}

export interface MonthData {
  month: number;
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

export interface UtilityReadingDetail {
  type: UtilityReadingType;
  previous_reading: string | number;
  current_reading: string | number;
  consumption: string | number;
  room_id: string;
}
