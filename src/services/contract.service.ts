import { handlePostgresError } from "@/lib/error/postgres-error";
import { ContractFormType } from "@/schemas/validation/admin.validation";
import { supabase } from "@/supabase/supabaseClients";
import { MutationResult, ResponseStandard } from "@/types/common";
import { Contract, ContractStatus } from "@/types/contract";
import { roomService } from "./room.service";
import { RoomStatus } from "@/types/room";

class ContractService {
  private tableName: string;
  constructor() {
    this.tableName = "contracts";
  }

  async getContract(roomId: string): Promise<ResponseStandard<Contract>> {
    const query = supabase
      .from(this.tableName)
      .select("*")
      .eq("room_id", roomId)
      .neq("status", "inactive");

    const { data: contract, error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    if (!contract || contract.length === 0) {
      return {
        data: null,
        success: false,
        message: "Không tìm thấy hợp đồng",
      };
    }

    return {
      data: contract[0],
      success: true,
      message: "Thành công lấy hợp đồng",
    };
  }

  async createContract(contract: ContractFormType): Promise<MutationResult> {
    const query = supabase
      .from("contracts")
      .insert({ ...contract, status: "pending" });
    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    try {
      const result = await roomService.updateRoom({
        id: contract.room_id,
        status: "on_hold",
      });
      if (result.success) {
        return {
          success: true,
          message: "Hợp đồng đã được tạo thành công",
        };
      }
    } catch (error) {
      console.log(error);
      query.rollback();
      return {
        success: false,
        message: "Vui lòng kiểm tra lại thông tin phòng",
      };
    }

    return {
      success: true,
      message: "Hợp đồng đã được tạo thành công",
    };
  }

  async updateStatusContract(
    room_id: string,
    status: keyof typeof ContractStatus,
  ): Promise<MutationResult> {
    if (!status) {
      return {
        success: false,
        message: "Thiếu thông tin trạng thái",
      };
    }

    const query = supabase
      .from(this.tableName)
      .update({
        status: status,
        updated_at: new Date(),
        end_date: status === "inactive" ? new Date() : undefined,
      })
      .eq("room_id", room_id);

    const { error } = await query;

    if (error) {
      handlePostgresError(error);
    }

    if (status === "inactive") {
      try {
        await roomService.updateRoom({
          id: room_id,
          status: "inactive" as RoomStatus,
        });
      } catch (error) {
        query.rollback();

        return {
          success: false,
          message: "Cập nhật hợp đồng thất bại",
        };
      }
    }

    return {
      success: true,
      message: "Cập nhật hợp đồng thành công",
    };
  }
}

export const contractService = new ContractService();
