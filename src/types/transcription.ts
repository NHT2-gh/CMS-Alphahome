import { Profile } from "./profile";
import { Room } from "./room";

export enum TransactionType {
  income = "Thu",
  expense = "Chi",
}

export enum PaymentMethod {
  cash = "Tiền mặt",
  bank = "Chuyển khoản",
}
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  description?: string;
  create_at: string;
}

export interface Transcription {
  id: string;
  categories: Category;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  payment_method: PaymentMethod;
  create_at: string;
  room_id?: string;
  description?: string;
  profiles: Profile;
  rooms: Room;
}

export interface BuildingRevenueCombined {
  category_name: string;
  type: TransactionType;
  total_amount: number;
  month: string;
}
