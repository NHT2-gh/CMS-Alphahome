export enum BillStatus {
  draft = "Nháp",
  confirmed = "Đã xác nhận",
  paid = "Đã thanh toán",
  overdue = "Quá hạn",
}

export enum CalculationMethod {
  by_usage = "m³/kwh",
  per_person = "Người",
  fixed = "Phòng",
}
export type ServiceType = "water" | "electricity" | "fixed";

export interface Bill {
  id: string;
  tracking_code: string;
  room_id: string;
  grand_total: number;
  bill_status: BillStatus;
  month_date: string;
  rooms: {
    building_id: string;
    code: string;
  };
  base_rent: number;
  updated_at: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

export interface BillFilter {
  room_id?: string;
  month_date?: string;
  bill_status?: BillStatus;
}

export interface Service {
  service_name: string;
  service_type: ServiceType;
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

export interface CreateSingleMonthlyBillResponse {
  bill: Bill;
  services: ({
    quantity: number;
    service_id: string;
    unit_price: number;
    total_amount: number;
  } & Service)[];
  message?: string;
}

export type ResponseStatus = "success" | "error" | "already_exists";

export interface CreateMonthlyBillsResponse {
  room_id: string;
  status: ResponseStatus;
  message?: string;
}

export interface FilteredBillResponse {
  success: CreateMonthlyBillsResponse[];
  failed: CreateMonthlyBillsResponse[];
  already_exists: CreateMonthlyBillsResponse[];
}
