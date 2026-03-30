import { PaymentStatus } from "./bill";

export interface FilterBase {
  page: number;
  limit: number;
  search_text?: string;
  sort?: string;
  order?: string;
}

export interface FilterBill extends FilterBase {
  status?: PaymentStatus;
}
