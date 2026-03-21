export type ContractStatus = "active" | "inactive" | "pending";

export interface Contract {
  id: string;
  tenant_name: string;
  tenant_phone: string;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  occupants_count: number;
  deposit_amount: number;
  created_at: string;
  updated_at: string;
}
