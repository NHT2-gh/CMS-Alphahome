"use client";

import { FormField } from "@/components/_cms/components/form";
import InvoicePreviewModal from "@/components/ecommerce/invoices/InvoicePreviewModal";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useBill } from "@/hooks/queries/use-bill";
import { useContractByRoomId } from "@/hooks/queries/use-contract";
import { PaymentStatus } from "@/types/bill";
import { formatDateTime } from "@/utils/format-data";
import { Receipt, UserCircle } from "lucide-react";
import React from "react";
import { BillDetailTable } from "./sub components/modal-bill";

export default function ModalViewBill({
  isOpen,
  closeModal,
  trackingCode,
}: {
  isOpen: boolean;
  closeModal: () => void;
  trackingCode?: string;
}) {
  const { data: bill } = useBill(trackingCode ?? "");
  const { data: contracts } = useContractByRoomId(bill?.room_id || "");

  if (!trackingCode) {
    closeModal();
    return null;
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[80%] max-h-[90vh] overflow-y-scroll p-5 lg:p-10"
    >
      <div className="mb-5 space-y-2">
        <h2 className="text-2xl font-bold ">Phiếu thu tiền #{trackingCode}</h2>
        <p>
          Ngày tạo phiếu: {formatDateTime(bill?.created_at, { withTime: true })}
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
              bill?.payment_status === PaymentStatus.PAID
                ? "success"
                : bill?.payment_status === PaymentStatus.DRAFT
                  ? "warning"
                  : bill?.payment_status === PaymentStatus.OVERDUE
                    ? "error"
                    : "info"
            }
          >
            {
              PaymentStatus[
                bill?.payment_status.toUpperCase() as keyof typeof PaymentStatus
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
            </div>
          </form>
        </div>
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          {contracts && (
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
                    value: contracts[0].tenant_name ?? "",
                    readOnly: true,
                  }}
                />
                <FormField
                  className="pointer-events-none"
                  field={{
                    label: "Số điện thoại",
                    type: "text",
                    value: contracts[0].tenant_phone ?? "",
                    readOnly: true,
                  }}
                />
                <FormField
                  className="pointer-events-none"
                  field={{
                    label: "Số lượng người ở",
                    type: "text",
                    value: contracts[0].occupants_count ?? "",
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          )}
          {bill && <BillDetailTable billId={bill.id} />}
        </div>
        <div className="p-4 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <InvoicePreviewModal />
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
              Save Invoice
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
