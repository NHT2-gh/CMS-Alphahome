"use client";
import React, { useCallback, useState } from "react";

import { CMSTableHeader } from "@/components/_cms/components/table";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { APP_ROUTES } from "@/config/app-routes";
import { useBuildings } from "@/hooks/queries/use-building";
import { formatCurrency } from "@/utils/format-data";
import { EllipsisVertical, Eye, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataEmpty } from "@/components/_cms/common/table/state";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import TableDropdown from "@/components/_cms/common/table-dropdown/table-dropdown";
import { Badge } from "@/components/_cms/ui/badge";
import { DropdownItem } from "@/components/_cms/ui/dropdown";

const _tableHeader: { key: string; title: string }[] = [
  { key: "code", title: "Mã căn hộ" },
  { key: "address", title: "Địa chỉ" },
  { key: "price-rent", title: "Giá thuê" },
  { key: "price-deposit", title: "Giá cọc" },
  { key: "start_date", title: "Ngày bắt đầu" },
  { key: "end_date", title: "Ngày kết thúc" },
  { key: "is_active", title: "Trạng thái" },
  { key: "actions", title: "" },
];

export default function DataTable() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { isLoading, data: buildings } = useBuildings({
    searchText,
  });

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
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <SearchBar
              placeholder="Tìm kiếm theo mã hoặc địa chỉ..."
              className="ml-auto"
              handleKeyDown={handleSearch}
              handleOnChange={handleSearch}
              debounceTime={500}
            />
          </div>
        </div>
      </div>
      <div className="max-w-full min-h-[18.75rem] overflow-x-auto">
        <Table>
          <CMSTableHeader
            selectAll={false}
            handleSelectAll={() => {}}
            columns={_tableHeader}
          />
          <TableBody>
            {isLoading || buildings?.length === 0 ? (
              <DataEmpty
                colSpan={_tableHeader.length}
                message={
                  isLoading
                    ? "Đang tải dữ liệu ..."
                    : "Không tìm thấy thông tin nào"
                }
              />
            ) : (
              buildings?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.code}</TableCell>

                  <TableCell>{item.address}</TableCell>

                  <TableCell>{formatCurrency(item.price_rent)}</TableCell>

                  <TableCell>{formatCurrency(item.price_deposit)}</TableCell>

                  <TableCell>{item.start_date || "NULL"}</TableCell>

                  <TableCell>{item.end_date || "NULL"}</TableCell>

                  <TableCell className="min-w-[9.375rem]">
                    <Badge
                      variant="light"
                      color={item.is_active ? "success" : "error"}
                      size="sm"
                    >
                      <span className="capitalize">
                        {item.is_active ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <TableDropdown
                      dropdownButton={
                        <button className="text-gray-500 dark:text-gray-400 ">
                          <EllipsisVertical className="size-4" />
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
                                APP_ROUTES.ADMIN.BUILDINGS.ID.SETTINGS(
                                  item.code,
                                ),
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
    </div>
  );
}
