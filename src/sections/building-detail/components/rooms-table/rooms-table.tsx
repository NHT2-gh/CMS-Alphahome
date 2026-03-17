"use client";
import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { RoomOverview } from "@/types/room";
import { useRouter } from "next/navigation";
import useRoom from "@/hooks/queries/use-room";
import Badge from "@/components/ui/badge/Badge";
import { APP_ROUTES } from "@/config/app-routes";
import { useBuilding } from "@/context/BuildingContext";
import { formatDateTime, formatPrice } from "@/utils/format-data";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const _tableHeader: { key: keyof RoomOverview | string; title: string }[] = [
  { key: "code", title: "Mã phòng" },
  { key: "occupants_count", title: "Số người" },
  { key: "current_rent", title: "Giá thuê" },
  { key: "area", title: "Diện tích" },
  { key: "furniture_status", title: "Nội thất" },
  { key: "tenant_name", title: "Tên người thuê" },
  { key: "end_date", title: "Hạn hợp đồng" },
  { key: "status", title: "Trạng thái" },
];
export default function RoomsTable() {
  const { building } = useBuilding();

  if (!building) return null;

  const { data: rooms, error } = useRoom(building.id);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const router = useRouter();

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
            Phòng
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Danh sách phòng trọ
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
                setFilterStatus("available");
                setCurrentPage(1);
              }}
              className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
                filterStatus === "available"
                  ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Đang trống
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
      <Table>
        <CMSTableHeader
          selectAll={false}
          handleSelectAll={() => {}}
          tableHeader={_tableHeader}
        />
        <TableBody>
          {rooms?.map((room) => (
            <TableRow
              onDoubleClick={() => {
                router.push(
                  APP_ROUTES.ADMIN.BUILDINGS.ROOMS.DETAIL(
                    building.id,
                    room.code,
                  ),
                );
              }}
              className={cn(
                "cursor-pointer hover:bg-blue-50",
                { "bg-gray-100": room.status === "available" },
                {
                  "bg-red-100":
                    room.end_date &&
                    new Date().getTime() - new Date(room.end_date).getTime() >
                      0 &&
                    room.status === "rented",
                },
              )}
              key={room.room_id}
            >
              <TableCell>{room.code}</TableCell>
              <TableCell>{room.occupants_count || 0}</TableCell>
              <TableCell>{formatPrice(room.current_rent)}</TableCell>

              <TableCell>{room.area}</TableCell>
              <TableCell>
                {room.furniture_status === "basic"
                  ? "Cơ bản"
                  : room.furniture_status === "unfurnished"
                    ? "Không có"
                    : "Đầy đủ"}
              </TableCell>
              <TableCell>
                {room.tenant_name ? room.tenant_name : "Chưa có"}
              </TableCell>

              <TableCell
                className={
                  room.end_date &&
                  new Date().getTime() - new Date(room.end_date).getTime() >
                    0 &&
                  room.status === "rented"
                    ? "font-bold"
                    : ""
                }
              >
                {room.end_date ? formatDateTime(room.end_date) : "Chưa có"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="light"
                  color={room.status === "available" ? "success" : "error"}
                  size="sm"
                >
                  <span className="capitalize">
                    {room.status === "available" ? "Đang trống" : "Đã thuê"}
                  </span>
                </Badge>
              </TableCell>

              {/* <TableCell>
                <button
                  className="disabled:opacity-30"
                  disabled={room.status === "available"}
                >
                  <BadgeDollarSign className="size-6 " />
                </button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
