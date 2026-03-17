"use client";
import React, { useCallback, useState } from "react";

import { Bill } from "@/types/bill";
import { Table } from "@/components/ui/table";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { Upload } from "lucide-react";

const _tableHeader: { key: keyof Bill | string; title: string }[] = [
  {
    key: "room_id",
    title: "Phòng",
  },
  {
    key: "month_date",
    title: "Tháng",
  },
  {
    key: "base_rent",
    title: "Tiền phòng",
  },
  {
    key: "electricity_total",
    title: "Tiền điện",
  },
  {
    key: "water_total",
    title: "Tiền nước",
  },
  {
    key: "extra_total",
    title: "Tiền dịch vụ",
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
    title: "Tạo",
  },
  {
    key: "created_by",
    title: "Người tạo",
  },
];

export default function PaymentsListTable() {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [showFilter, setShowFilter] = useState<boolean>(false);

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
      </Table>
    </div>
  );
}
