"use client";

import { FormField } from "@/components/_cms/components/form";

import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useUpdateStatusBill } from "@/hooks/queries/use-bill";
import { useContract } from "@/hooks/queries/use-contract";
import { Bill, BillStatus } from "@/types/bill";
import { formatDateTime } from "@/utils/format-data";
import { Receipt, SaveIcon, UserCircle } from "lucide-react";
import React, { useState } from "react";
import { BillDetailTable } from "./sub components/modal-bill";
import { BillPreviewModal } from "./sub components/modal-bill";
import { Contract } from "@/types/contract";
import { showToast } from "@/lib/toast";
import { Modal } from "@/components/ui/modal";

export default function ModalViewBill({
  currentBill,
  closeModal,
}: {
  currentBill: Bill;
  closeModal: () => void;
}) {
  const { data: contract } = useContract(currentBill?.room_id);
  const [status, setStatus] = useState<keyof typeof BillStatus>(
    currentBill.bill_status,
  );
  const updateStatusBill = useUpdateStatusBill();

  const handleUpdateStatus = async () => {
    try {
      const result = await updateStatusBill.mutateAsync({
        tracking_code: currentBill.tracking_code,
        status: status,
      });

      console.log(currentBill.tracking_code, result);

      if (result.success) {
        closeModal();
        showToast.success({
          title: result.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={true} onClose={closeModal} className="">
      <h2 className="text-2xl font-bold mb-5">Phiếu thu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 mb-3">
        <p>Mã phiếu: #{currentBill?.tracking_code}</p>
        <p>
          Ngày tạo phiếu:{" "}
          {formatDateTime(currentBill?.created_at, { withTime: true })}
        </p>
        <p>
          Ngày cập nhật gần nhất:{" "}
          {formatDateTime(currentBill?.updated_at, { withTime: true })}
        </p>
        <div className="flex gap-2">
          <span>Trạng thái:</span>
          <Badge
            variant="light"
            color={
              currentBill?.bill_status === ("paid" as keyof typeof BillStatus)
                ? "success"
                : currentBill?.bill_status ===
                    ("draft" as keyof typeof BillStatus)
                  ? "light"
                  : currentBill?.bill_status ===
                      ("overdue" as keyof typeof BillStatus)
                    ? "error"
                    : currentBill?.bill_status ===
                        ("unpaid" as keyof typeof BillStatus)
                      ? "dark"
                      : currentBill?.bill_status ===
                          ("confirmed" as keyof typeof BillStatus)
                        ? "warning"
                        : "info"
            }
          >
            {
              BillStatus[
                currentBill.bill_status as unknown as keyof typeof BillStatus
              ]
            }
          </Badge>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 md:p-6 space-y-4 dark:border-gray-800">
          <h4 className="flex items-center gap-3">
            <Receipt /> Thông tin hoá đơn
          </h4>

          <form className="space-y-4 md:space-y-6">
            <div className="grid gap-3 md:gap-5 grid-cols-2">
              <FormField
                field={{
                  label: "Số hóa đơn",
                  type: "text",
                  readOnly: true,
                  value: currentBill?.tracking_code ?? "",
                }}
              />

              <FormField
                field={{
                  label: "Mã phòng",
                  type: "text",
                  readOnly: true,
                  value: currentBill?.rooms.code ?? "",
                }}
              />

              <FormField
                field={{
                  label: "Kì thanh toán",
                  type: "text",
                  value: currentBill?.month_date ?? "",
                  readOnly: true,
                }}
              />

              <FormField
                field={{
                  label: "Trạng thái",
                  type: "select",
                  options: Object.keys(BillStatus).map((key) => ({
                    label: BillStatus[key as keyof typeof BillStatus],
                    value: key,
                  })),
                  defaultValue: status,
                  handleOnChange(value) {
                    setStatus(value as keyof typeof BillStatus);
                  },
                }}
              />
            </div>
          </form>
        </div>
        <div className="border-b border-gray-200 p-3 md:p-6  dark:border-gray-800">
          {contract && (
            <div className="pb-5 space-y-4">
              <h4 className="flex items-center gap-3">
                <UserCircle /> Thông tin khách hàng
              </h4>

              <div className="grid grid-cols-2 gap-5">
                <FormField
                  className="pointer-events-none"
                  field={{
                    label: "Tên khách hàng",
                    type: "text",
                    value: contract.tenant_name ?? "",
                    readOnly: true,
                  }}
                />
                <FormField
                  className="pointer-events-none"
                  field={{
                    label: "Số điện thoại",
                    type: "text",
                    value: contract.tenant_phone ?? "",
                    readOnly: true,
                  }}
                />
                <FormField
                  className="pointer-events-none"
                  field={{
                    label: "Số lượng người ở",
                    type: "text",
                    value: contract.occupants_count ?? "",
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          )}
          {currentBill && (
            <BillDetailTable
              bill={currentBill}
              baseRent={currentBill.base_rent}
              isPreview={false}
            />
          )}
        </div>
        <div className="p-4 sm:p-8">
          <div className="flex gap-3 justify-between md:justify-end">
            {currentBill && contract && (
              <BillPreviewModal
                bill={currentBill}
                infoCustomer={contract as Contract}
              />
            )}
            <Button
              variant="primary"
              className="flex-1 md:flex-none"
              onClick={handleUpdateStatus}
            >
              <SaveIcon />
              Lưu phiếu
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
