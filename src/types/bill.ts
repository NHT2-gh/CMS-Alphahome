export enum PaymentStatus {
  DRAFT = "draft",
  CONFIRMED = "confirmed",
  PAID = "paid",
  OVERDUE = "overdue",
}

export enum CalculationMethod {
  by_usage = "m³/kwh",
  per_person = "Người",
  fixed = "Phòng",
}
export interface Bill {
  id: string;
  tracking_code: string;
  room_id: string;
  grand_total: number;
  payment_status: PaymentStatus;
  month_date: string;
  rooms: {
    building_id: string;
    code: string;
  };
  updated_at: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export interface BillFilter {
  room_id?: string;
  month_date?: string;
  payment_status?: PaymentStatus;
}

export interface Service {
  service_name: string;
  calculation_method: CalculationMethod;
}

export interface BillServiceDetail {
  id: string;
  service_id: string;
  services: Service;
  quantity: number;
  unit_price: number;
  total_amount: number;
}
