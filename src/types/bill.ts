export interface Bill {
  id: string;
  room_id: string;
  base_rent: number;
  electricity_total: number;
  water_total: number;
  extra_total: number;
  grand_total: number;
  payment_status: string;
  month_date: string;
  updated_at: string;
  created_at: string;
  created_by: string;
}
