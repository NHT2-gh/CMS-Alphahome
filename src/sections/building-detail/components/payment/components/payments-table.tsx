"use client";
import React, { useCallback, useState } from "react";

import { Bill, PaymentStatus } from "@/types/bill";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { Eye, Upload } from "lucide-react";
import { useAllBillsBy } from "@/hooks/queries/use-bill";
import { useBuilding } from "@/context/BuildingContext";
import { formatDateTime, formatPrice } from "@/utils/format-data";
import { Checkbox } from "@/components/_cms/ui/input";
import Badge from "@/components/ui/badge/Badge";
import ModalViewBill from "./modal-view-bill";
import { useModal } from "@/hooks/useModal";

const _tableHeader: { key: keyof Bill | string; title: string }[] = [
  {
    key: "tracking_code",
    title: "Mã hoá đơn",
  },
  {
    key: "room_id",
    title: "Phòng",
  },
  {
    key: "month_date",
    title: "Kì thanh toán",
  },
  {
    key: "grand_total",
    title: "Tổng tiền",
  },
  {
    key: "payment_status",
    title: "Trạng thái",
  },

  {
    key: "updated_at",
    title: "Cập nhật",
  },
  {
    key: "created_at",
    title: "Thời gian tạo",
  },
  {
    key: "created_by",
    title: "Người tạo",
  },
];

export default function PaymentsListTable() {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedBill, setSelectedBill] = useState<string | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { building } = useBuilding();
  if (!building) return null;
  const { data: bills } = useAllBillsBy(building.id);
  const handleSearch = useCallback((value: string) => {
    if (value.trim() === "") {
      setSearch(undefined);
      return;
    }

    setSearch(value);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Hoá đơn
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Danh sách hoá đơn
          </p>
        </div>
        <div className="flex gap-3.5">
          <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
            <button
              onClick={() => {
                setFilterStatus("All");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "All"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => {
                setFilterStatus("Unpaid");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "Unpaid"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Chưa thanh toán
            </button>
            <button
              onClick={() => {
                setFilterStatus("Draft");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "Draft"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Nháp
            </button>
          </div>
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <SearchBar
              placeholder="Tìm kiếm"
              className="ml-auto"
              handleOnChange={handleSearch}
              debounceTime={500}
            />
            {/* <FilterDropdown
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  /> */}
            <button className="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <Upload className="size-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      <Table>
        <CMSTableHeader
          selectAll={false}
          handleSelectAll={() => {}}
          tableHeader={_tableHeader}
        />
        <TableBody>
          {bills?.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>
                <Checkbox
                  checked
                  onChange={() => {}}
                  label={bill.tracking_code}
                />
              </TableCell>
              <TableCell>{bill.rooms.code}</TableCell>
              <TableCell>{new Date(bill.month_date).getMonth() + 1}</TableCell>
              <TableCell>{formatPrice(bill.grand_total)}</TableCell>
              <TableCell className="capitalize">
                <Badge
                  variant="light"
                  color={
                    bill.payment_status === PaymentStatus.PAID
                      ? "success"
                      : bill.payment_status === PaymentStatus.DRAFT
                        ? "warning"
                        : bill.payment_status === PaymentStatus.OVERDUE
                          ? "error"
                          : "info"
                  }
                >
                  {
                    PaymentStatus[
                      bill.payment_status.toUpperCase() as keyof typeof PaymentStatus
                    ]
                  }
                </Badge>
              </TableCell>
              <TableCell>
                {formatDateTime(bill.updated_at, { withTime: true })}
              </TableCell>
              <TableCell>
                {formatDateTime(bill.created_at, { withTime: true })}
              </TableCell>
              <TableCell>{bill.profiles.full_name}</TableCell>

              <TableCell>
                <button
                  onClick={() => {
                    setSelectedBill(bill.tracking_code);
                    openModal();
                  }}
                  className="group"
                >
                  <Eye className="group-hover:text-brand-400" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isOpen && (
        <ModalViewBill
          isOpen={isOpen}
          closeModal={closeModal}
          trackingCode={selectedBill}
        />
      )}
    </div>
  );
}
