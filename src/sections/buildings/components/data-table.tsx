"use client";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { SearchBar } from "@/components/_cms/components/search-bar";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { APP_ROUTES } from "@/config/app-routes";
import { useBuilding } from "@/hooks/queries/use-building";
import { formatPrice } from "@/utils/format-data";
import { Eye, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useCallback, useState } from "react";
const _tableHeader = [
  { key: "code", title: "Mã căn hộ" },
  { key: "address", title: "Địa chỉ" },
  { key: "price-rent", title: "Giá thuê" },
  { key: "price-deposit", title: "Giá cọc" },
  { key: "start_date", title: "Ngày bắt đầu" },
  { key: "end_date", title: "Ngày kết thúc" },
  { key: "filling-rate", title: "Tỷ lệ lấp đầy" },
  { key: "is_active", title: "Trạng thái" },
];

export default function DataTable({}: {}) {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { isLoading, data: buildings } = useBuilding({
    searchText,
  });

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [showFilter, setShowFilter] = useState<boolean>(false);

  const handleSearch = useCallback((value: string) => {
    if (value.trim() === "") {
      setSearchText(undefined);
      return;
    }

    setSearchText(value);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Căn hộ
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Danh sách căn hộ
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
              Còn trống
            </button>
          </div>
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <SearchBar
              placeholder="Tìm kiếm"
              className="ml-auto"
              handleKeyDown={handleSearch}
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

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <Table className="w-full">
          <CMSTableHeader
            selectAll={false}
            handleSelectAll={() => {}}
            tableHeader={_tableHeader}
          />
          <TableBody>
            {buildings?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>

                <TableCell>{item.address}</TableCell>

                <TableCell>{formatPrice(item.price_rent)}</TableCell>

                <TableCell>{formatPrice(item.price_deposit)}</TableCell>

                <TableCell>{item.start_date || "NULL"}</TableCell>

                <TableCell>{item.end_date || "NULL"}</TableCell>

                <TableCell className="min-w-[8rem]">
                  <Tooltip
                    content={`Trống ${item.number_available_rooms}/${item.total_rooms} phòng`}
                    position="top"
                  >
                    <ProgressBar
                      progress={
                        ((item.total_rooms - item.number_available_rooms) /
                          item.total_rooms) *
                        100
                      }
                      size="lg"
                      label="inside"
                    />
                  </Tooltip>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="light"
                    color={item.is_active ? "success" : "error"}
                    size="sm"
                  >
                    <span className="capitalize">
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
                  </Badge>
                </TableCell>

                <TableCell>
                  <button
                    className="group"
                    onClick={() => {
                      router.push(
                        APP_ROUTES.ADMIN.BUILDINGS.ID.BASE(item.code),
                      );
                    }}
                  >
                    <Eye className="group-hover:text-brand-400" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
