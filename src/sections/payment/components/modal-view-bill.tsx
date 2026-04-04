"use client";

import { FormField } from "@/components/_cms/components/form";

import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useBill } from "@/hooks/queries/use-bill";
import { useContract } from "@/hooks/queries/use-contract";
import { Bill, PaymentStatus } from "@/types/bill";
import { formatDateTime } from "@/utils/format-data";
import { Eye, Receipt, UserCircle } from "lucide-react";
import React, { useState } from "react";
import { BillDetailTable } from "./sub components/modal-bill";
import { useModal } from "@/hooks/useModal";
import { BillPreviewModal } from "./sub components/modal-bill";
import { Contract } from "@/types/contract";

export default function ModalViewBill({ currentBill }: { currentBill: Bill }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { data: bill } = useBill(currentBill.tracking_code ?? "");
  const { data: contract } = useContract(bill?.room_id || "");
  const [status, setStatus] = useState<PaymentStatus>(
    currentBill.payment_status,
  );

  if (!currentBill.tracking_code) {
    closeModal();
    return null;
  }

  return (
    <>
      <button
        onClick={() => {
          openModal();
        }}
        className="group text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <Eye />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[80%] max-h-[90vh] overflow-y-scroll p-5 lg:p-10"
      >
        <h2 className="text-2xl font-bold mb-5">Phiếu thu</h2>
        <div className="grid grid-cols-2 gap-y-2 mb-3">
          <p>Mã phiếu: #{bill?.tracking_code}</p>
          <p>
            Ngày tạo phiếu:{" "}
            {formatDateTime(bill?.created_at, { withTime: true })}
          </p>
          <p>
            Ngày cập nhật gần nhất:{" "}
            {formatDateTime(bill?.updated_at, { withTime: true })}
          </p>
          <div className="flex gap-2">
            <span>Trạng thái:</span>
            <Badge
              variant="light"
              color={
                bill?.payment_status === ("paid" as PaymentStatus)
                  ? "success"
                  : bill?.payment_status === ("draft" as PaymentStatus)
                    ? "warning"
                    : bill?.payment_status === ("overdue" as PaymentStatus)
                      ? "error"
                      : "info"
              }
            >
              {
                PaymentStatus[
                  bill?.payment_status as unknown as keyof typeof PaymentStatus
                ]
              }
            </Badge>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="border-b border-gray-200 p-6 space-y-4 dark:border-gray-800">
            <h4 className="flex items-center gap-3">
              <Receipt /> Thông tin hoá đơn
            </h4>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormField
                  field={{
                    label: "Số hóa đơn",
                    type: "text",
                    readOnly: true,
                    value: bill?.tracking_code ?? "",
                  }}
                />

                <FormField
                  field={{
                    label: "Mã phòng",
                    type: "text",
                    readOnly: true,
                    value: bill?.rooms.code ?? "",
                  }}
                />

                <FormField
                  field={{
                    label: "Kì thanh toán",
                    type: "text",
                    value: bill?.month_date ?? "",
                    readOnly: true,
                  }}
                />

                <FormField
                  field={{
                    label: "Trạng thái",
                    type: "select",
                    options: Object.keys(PaymentStatus).map((key) => ({
                      label: PaymentStatus[key as keyof typeof PaymentStatus],
                      value: key,
                    })),
                    defaultValue: status,
                    handleOnChange(value) {
                      setStatus(value as PaymentStatus);
                    },
                  }}
                />
              </div>
            </form>
          </div>
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
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
            {bill && (
              <BillDetailTable
                billId={bill.id}
                baseRent={bill.base_rent}
                isPreview={false}
              />
            )}
          </div>
          <div className="p-4 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {bill && (
                <BillPreviewModal
                  bill={bill}
                  infoCustomer={contract as Contract}
                />
              )}
              <Button variant="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M13.333 16.6666V12.9166C13.333 12.2262 12.7734 11.6666 12.083 11.6666L7.91634 11.6666C7.22599 11.6666 6.66634 12.2262 6.66634 12.9166L6.66635 16.6666M9.99967 5.83325H6.66634M15.4163 16.6666H4.58301C3.89265 16.6666 3.33301 16.1069 3.33301 15.4166V4.58325C3.33301 3.8929 3.89265 3.33325 4.58301 3.33325H12.8171C13.1483 3.33325 13.4659 3.46468 13.7003 3.69869L16.2995 6.29384C16.5343 6.52832 16.6662 6.84655 16.6662 7.17841L16.6663 15.4166C16.6663 16.1069 16.1066 16.6666 15.4163 16.6666Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Lưu phiếu
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
