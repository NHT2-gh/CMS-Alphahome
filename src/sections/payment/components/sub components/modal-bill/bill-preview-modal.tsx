"use client";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useBuilding } from "@/context/BuildingContext";
import { useModal } from "@/hooks/useModal";
import { Bill, BillServiceDetail } from "@/types/bill";
import { Contract } from "@/types/contract";
import { formatDateTime } from "@/utils/format-data";
import React, { useRef, useState } from "react";
import { BillDetailTable } from ".";
import { useCopyImage } from "@/hooks/us-copy-image";
import Image from "next/image";

interface BillPreviewModalProps {
  bill: Bill;
  infoCustomer: Contract;
}

export default function BillPreviewModal({
  bill,
  infoCustomer,
}: BillPreviewModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const { building } = useBuilding();
  const billRef = useRef<HTMLDivElement>(null);
  const { isMobile, copyImage } = useCopyImage();
  const [loading, setLoading] = useState(false);
  const [resultLog, setResultLog] = useState<string | undefined>(undefined);
  const handleCopy = async () => {
    setLoading(true);
    const result = await copyImage(billRef.current);

    if (result.method === "clipboard") {
      setResultLog("Đã copy ảnh vào clipboard");
    } else if (result.method === "download") {
      setResultLog("Trình duyệt không hỗ trợ copy, đã tải ảnh");
    } else {
      setResultLog("Có lỗi xảy ra");
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={openModal}
        className="flex-1 md:flex-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M2.46585 10.7925C2.23404 10.2899 2.23404 9.71023 2.46585 9.20764C3.78181 6.35442 6.66064 4.375 10.0003 4.375C13.3399 4.375 16.2187 6.35442 17.5347 9.20765C17.7665 9.71024 17.7665 10.2899 17.5347 10.7925C16.2187 13.6458 13.3399 15.6252 10.0003 15.6252C6.66064 15.6252 3.78181 13.6458 2.46585 10.7925Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.0212 10C13.0212 11.6684 11.6687 13.0208 10.0003 13.0208C8.33196 13.0208 6.97949 11.6684 6.97949 10C6.97949 8.33164 8.33196 6.97917 10.0003 6.97917C11.6687 6.97917 13.0212 8.33164 13.0212 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Xem phiếu
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="relative p-0 ">
        <div ref={billRef} className="p-4 md:p-8 ">
          <h3 className="text-lg text-gray-700 dark:text-gray-500">
            Phiếu: #{bill.tracking_code}
          </h3>

          <div className="">
            {/* <p className="mb-5">
              Mã phiếu:<b> #{bill.tracking_code}</b>
            </p> */}
            <div className=" mb-2 md:mb-9 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Từ
                </span>

                <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
                  AlphaHome
                </h5>

                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {building?.address}
                </p>

                <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Ngày tạo phiếu:
                </span>

                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {formatDateTime(bill?.created_at, { withTime: true })}
                </span>
              </div>

              <div className="md:text-right">
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Đến
                </span>

                <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
                  {infoCustomer.tenant_name}
                </h5>

                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {infoCustomer.tenant_phone}
                </p>

                <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Hạn thanh toán:
                </span>

                <span className="block text-sm text-gray-500 dark:text-gray-400">
                  {bill.month_date.split("-")[2]}/{" "}
                  {bill.month_date.split("-")[1]}/{" "}
                  {bill.month_date.split("-")[0]} - 0
                  {String(new Date(bill.month_date)?.getDay() + 5)}/
                  {bill.month_date.split("-")[1]}/{" "}
                  {bill.month_date.split("-")[0]}
                </span>
              </div>
            </div>

            {/* <!-- Invoice Table --> */}
            <BillDetailTable bill={bill} baseRent={bill.base_rent} />

            <div className="flex items-center justify-center gap-2">
              {/* <Image
                width={200}
                height={179}
                src={`/images/payment-qr/${building?.id}.webp`}
                alt={`Payment QR of builiding ${building?.code}`}
              /> */}

              <div
                style={{
                  minWidth: "200px",
                  minHeight: "179px",
                  backgroundImage: `url(/images/payment-qr/${building?.id}.webp)`,
                }}
              ></div>
              <div className="space-y-3">
                <h4>
                  Chủ tài khoản: <br />
                  <b>NGUYỄN NHẤT TIẾN</b>
                </h4>
                <h4>
                  Số tài khoản: <br />
                  <b>0004100009760007</b>
                </h4>

                <h4>
                  Cú pháp nội dung chuyển khoản: <br />
                  <b className="text-red-400">
                    `[{building?.code}_{bill.tracking_code}]`
                  </b>
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 flex gap-4 items-center">
          <button
            className="bg-blue-100 p-2 rounded-2xl "
            onClick={handleCopy}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "📋 Copy phiếu"}
          </button>

          {resultLog && <span>{resultLog}</span>}
        </div>
      </Modal>
    </>
  );
}
