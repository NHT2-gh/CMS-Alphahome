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
