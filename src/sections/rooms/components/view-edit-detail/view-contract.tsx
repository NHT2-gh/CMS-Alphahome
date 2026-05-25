"use client";
import React, { useCallback } from "react";
import { ReceiptText, UserCircle2 } from "lucide-react";
import { Contract, ContractStatus } from "@/types/contract";
import { Badge } from "@/components/_cms/ui/badge";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import { ComponentCard } from "@/components/_cms/common/component-card";
import { useModal } from "@/hooks/useModal";
import { AddContractForm } from ".";
import { Button } from "@/components/_cms/ui/button";
import {
  useContract,
  useUpdateStatusContract,
} from "@/hooks/queries/use-contract";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { Alert } from "@/components/_cms/ui/alert";

interface ViewContractProps {
  contract?: Contract | null;
  roomId: string;
}

export default function ViewContract({ contract, roomId }: ViewContractProps) {
  const modalAddContract = useModal();
  const { data: contractData } = useContract(roomId, contract);
  const updateStatusContract = useUpdateStatusContract();
  const handleUpdateStatusContract = useCallback(
    async (status: keyof typeof ContractStatus) => {
      try {
        const result = await updateStatusContract.mutateAsync({
          roomId,
          status: status,
        });
        if (result) {
          showToast.success({
            title: `Thành công`,
            description: result.message,
          });
        }
      } catch (error) {
        showToast.error({
          title: "Thất bại",
          description: mapErrorToMessage(error),
        });
      }
    },
    [updateStatusContract, roomId],
  );

  return (
    <ComponentCard title="Hợp đồng" className="space-y-5">
      {contractData?.data && contractData?.data !== null ? (
        <>
          <section className="space-y-3">
            <h3 className="text-lg font-semibold inline-flex gap-2 ">
              <ReceiptText /> Thông tin hợp đồng
            </h3>
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="md:col-span-2">
                <b>Mã hợp đồng:</b>{" "}
                {contractData?.data?.id
                  ? contractData?.data?.id.split("-")[0].toUpperCase()
                  : "----"}
              </li>

              <li>
                <b>Ngày bắt đầu hợp đồng:</b>{" "}
                {formatDateTime(contractData?.data?.start_date, {
                  withTime: false,
                })}
              </li>
              <li>
                <b>Ngày kết thúc hợp đồng:</b>{" "}
                {formatDateTime(contractData?.data?.end_date, {
                  withTime: false,
                })}
              </li>
              <li>
                <b>Tiền cọc:</b>{" "}
                <span className="text-red-500">
                  {formatCurrency(contractData.data?.deposit_amount)}
                </span>
              </li>
              <li>
                <b>Trạng thái hợp đồng:</b>{" "}
                <Badge
                  color={
                    contractData.data.status === "active" ? "success" : "error"
                  }
                >
                  <span className="capitalize">{contractData.data.status}</span>
                </Badge>
              </li>

              <li>
                <b>Số lượng người tạm trú: </b>
                {contractData.data.occupants_count}
              </li>

              <li>
                <b>Số lượng xe sở hữu: </b>
                {contractData.data.total_transport}
              </li>
            </ul>

            <div className="space-y-2 pt-3 border-t border-dashed">
              <h3 className="text-lg font-semibold inline-flex gap-2">
                <UserCircle2 /> Thông tin người đại diện thuê phòng
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                <li className="col-span-2">
                  <b>Họ tên người đại diện:</b> {contractData.data.tenant_name}
                </li>
                <li>
                  <b>Số điện thoại:</b> {contractData.data.tenant_phone}
                </li>
              </ul>
            </div>
          </section>
          <div className="flex justify-end gap-5 mt-10">
            {contractData.data?.status === "pending" ? (
              <Button
                disabled={updateStatusContract.isPending}
                onClick={() => handleUpdateStatusContract("active")}
                className="bg-green-600 hover:bg-green-700"
              >
                Duyệt hợp đồng thuê
              </Button>
            ) : (
              contract?.status == "active" &&
              new Date().getTime() - new Date(contract.end_date).getTime() >
                0 && (
                <Button onClick={() => handleUpdateStatusContract("extended")}>
                  Gia hạn hợp đồng
                </Button>
              )
            )}

            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              disabled={updateStatusContract.isPending}
              onClick={() => handleUpdateStatusContract("inactive")}
            >
              Huỷ hợp đồng
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-5">
          <i className="">
            Hiện tại chưa có hợp đồng nào còn hiệu lực, bạn có thể thêm hợp đồng
            mới.
          </i>

          <button
            onClick={() => modalAddContract.openModal()}
            className="w-fit text-blue-500 text-sm underline cursor-pointer"
          >
            Thêm hợp đồng
          </button>
        </div>
      )}

      {modalAddContract.isOpen && <AddContractForm roomId={roomId} />}
      {contract?.status == "active" &&
        new Date().getTime() - new Date(contract.end_date).getTime() > 0 && (
          <Alert
            variant={"info"}
            title={"Lưu ý"}
            message="Khi chọn gia hạn hợp động thì hợp động sẽ tự động gia hạn thêm 6 tháng kể từ ngày hiện tại"
          />
        )}

      {/* <AddContractForm roomId={roomId} /> */}
    </ComponentCard>
  );
}
