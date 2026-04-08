import { adaptMonthlyBillsResponse } from "@/adapters/bill.adapter";
import { handlePostgresError } from "@/lib/error/postgres-error";
import { supabase } from "@/supabase/supabaseClients";
import {
  Bill,
  BillServiceDetail,
  CreateMonthlyBillsResponse,
  CreateSingleMonthlyBillResponse,
  FilteredBillResponse,
} from "@/types/bill";
import { ResponseData } from "@/types/common";

class BillService {
  page: number;
  limit: number;
  constructor() {
    this.page = 1;
    this.limit = 20;
  }

  async getAllBills(buildingId: string, page?: number, limit?: number) {
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
        { count: "exact" },
      )
      .eq("rooms.building_id", buildingId);

    if (page && limit) {
      query.range((page - 1) * limit, page * limit - 1);
    }

    const { data, error, count } = await query;

    console.log(data, count);

    if (error) {
      handlePostgresError(error);
    }

    return {
      data: data || [],
      count: count || 0,
    };
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

  async createMultipleBills(
    trackingCode: string,
    month_date: string,
    room_id: string[],
  ): Promise<{ results: CreateMonthlyBillsResponse[] }> {
    const { data: response, error } = await supabase.rpc(
      "create_multiple_room_monthly_bills",
      {
        p_tracking_code: trackingCode,
        p_month_date: month_date,
        p_room_ids: room_id,
      },
    );

    // const response = adaptMonthlyBillsResponse(data);

    if (error) {
      handlePostgresError(error);
    }
    return response || [];
  }

  async createSignleBill(
    trackingCode: string,
    month_date: string,
    room_id: string,
  ): Promise<CreateSingleMonthlyBillResponse> {
    const { data: response, error } = await supabase.rpc(
      "create_room_monthly_bill",
      {
        p_tracking_code: trackingCode,
        p_month_date: month_date,
        p_room_id: room_id,
        p_return_full: true,
      },
    );
    if (error) {
      handlePostgresError(error);
    }
    return response;
  }
}

export const billService = new BillService();
