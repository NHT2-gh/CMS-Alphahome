export enum ContractStatus {
  active = "Có hiệu lực",
  inactive = "Hết hiệu lực",
  pending = "Chờ duyệt",
  extended = "Đã gia hạn",
}

export interface Contract {
  id: string;
  tenant_name: string;
  tenant_phone: string;
  status: keyof typeof ContractStatus;
  start_date: string;
  end_date: string;
  occupants_count: number;
  total_transport: number;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
  room_id: string;
}
