import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import { Bill, BillServiceDetail } from "@/types/bill";

class BillService {
  constructor() {}

  // async createBill(payload: CreateInvoiceFormType) {
  //     const query = supabase.from("invoices").insert(payload);

  //     const { error } = await query;

  //     if (error) {
  //         handlePostgresError(error);
  //     }

  //     return true;
  // }

  async getAllBills(buildingId: string): Promise<Bill[]> {
    const query = supabase
      .from("room_monthly_bills")
      .select(
        `
    *,
    rooms!inner (
      building_id,
      code
    ),
    profiles!inner (
      full_name
    )

  `,
      )
      .eq("rooms.building_id", buildingId);

    const { data: bills, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return bills || [];
  }

  async getBill(trackingCode: string): Promise<Bill | null> {
    const query = supabase
      .from("room_monthly_bills")
      .select(
        `
    *,
    rooms!inner (
      building_id,
      code
    ),
    profiles!inner (
      full_name
    )

  `,
      )
      .eq("tracking_code", trackingCode)
      .single();

    const { data: bill, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return bill || null;
  }

  async getBillServiceDetail(billId: string): Promise<BillServiceDetail[]> {
    const query = supabase
      .from("bill_service_details")
      .select(
        `
        *, 
        services!inner (
          service_name,
          calculation_method
        )`,
      )
      .eq("bill_id", billId);

    const { data: services, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    return services || [];
  }
}

export const billService = new BillService();
