"use client";
import React, { useCallback, useState } from "react";

import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { SearchBar } from "@/components/_cms/components/search-bar";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { APP_ROUTES } from "@/config/app-routes";
import { useBuildings, useUsersBuilding } from "@/hooks/queries/use-building";
import { formatCurrency } from "@/utils/format-data";
import { Eye, Settings, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import TableDropdown from "@/components/common/TableDropdown";
import { NotFound } from "@/components/_cms/common/table/state";
import { useAuth } from "@/context/AuthContext";
import useAllRooms from "@/hooks/queries/use-room";

const _tableHeader: { key: string; title: string }[] = [
  { key: "code", title: "Mã căn hộ" },
  { key: "address", title: "Địa chỉ" },
  { key: "price-rent", title: "Giá thuê" },
  { key: "price-deposit", title: "Giá cọc" },
  { key: "start_date", title: "Ngày bắt đầu" },
  { key: "end_date", title: "Ngày kết thúc" },
  { key: "filling-rate", title: "Tỷ lệ lấp đầy" },
  { key: "is_active", title: "Trạng thái" },
];

export default function DataTable() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { user } = useAuth();
  const { isLoading, data: buildings } = useBuildings({
    searchText,
  });

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

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

      <Table className="w-full">
        <CMSTableHeader
          selectAll={false}
          handleSelectAll={() => {}}
          columns={_tableHeader}
        />
        <TableBody>
          {isLoading || buildings?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={_tableHeader.length}>
                <NotFound
                  message={
                    isLoading
                      ? "Đang tải dữ liệu ..."
                      : "Không tìm thấy thông tin nào"
                  }
                />
              </TableCell>
            </TableRow>
          ) : (
            buildings?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.code}</TableCell>

                <TableCell>{item.address}</TableCell>

                <TableCell>{formatCurrency(item.price_rent)}</TableCell>

                <TableCell>{formatCurrency(item.price_deposit)}</TableCell>

                <TableCell>{item.start_date || "NULL"}</TableCell>

                <TableCell>{item.end_date || "NULL"}</TableCell>

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
                  <TableDropdown
                    dropdownButton={
                      <button className="text-gray-500 dark:text-gray-400 ">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    }
                    dropdownContent={
                      <>
                        <DropdownItem
                          onItemClick={() =>
                            router.push(
                              APP_ROUTES.ADMIN.BUILDINGS.ID.DETAIL(item.code),
                            )
                          }
                        >
                          <Eye className="size-4" /> Xem chi tiết
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={() =>
                            router.push(
                              APP_ROUTES.ADMIN.BUILDINGS.ID.SETTINGS(item.code),
                            )
                          }
                        >
                          <Settings className="size-4" /> Thiết lập nâng cao
                        </DropdownItem>
                      </>
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
