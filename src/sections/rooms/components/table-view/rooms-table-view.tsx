"use client";
import React, { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { RoomOverview, RoomStatus } from "@/types/room";
import { useRouter } from "next/navigation";
import useAllRooms from "@/hooks/queries/use-room";
import { Eye, PlusCircle } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { APP_ROUTES } from "@/config/app-routes";
import Button from "@/components/ui/button/Button";
import { useBuilding } from "@/context/BuildingContext";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useFilter } from "@/hooks/use-filter";
import { RoomFilterSchema } from "@/schemas/render-filter-schemas/room-filter.schema";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import TableNotFound from "@/components/_cms/common/table/state/not_found";
import { TableHeaderColumn } from "@/components/_cms/components/data-table/table-header";
import { showToast } from "@/lib/toast";

const _tableHeader: TableHeaderColumn[] = [
  { key: "code", title: "Mã phòng" },
  { key: "occupants_count", title: "Số người", isHiddenOnMobile: true },
  { key: "current_rent", title: "Giá thuê" },
  { key: "area", title: "Diện tích", isHiddenOnMobile: true },
  { key: "furniture_status", title: "Nội thất", isHiddenOnMobile: true },
  { key: "tenant_name", title: "Tên người thuê" },
  { key: "end_date", title: "Hạn hợp đồng" },
  { key: "status", title: "Trạng thái" },
];
export default function RoomsTable() {
  const { building } = useBuilding();
  const { filterValues, updateFilter, applyFilters } = useFilter({
    filterConfigs: RoomFilterSchema,
  });
  const {
    data: rooms,
    error,
    isLoading,
  } = useAllRooms(building?.id, {
    filters: filterValues,
  });

  useEffect(() => {
    if (error) {
      showToast.error({
        title: "Lỗi khi tải danh sách phòng",
      });
    }
  }, [error]);

  const router = useRouter();

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
        <div className="flex items-center gap-6">
          <SingleFilterButtonGroup
            items={Object.entries(RoomStatus).map(([value, label]) => ({
              label,
              value,
            }))}
            onChange={(value) => {
              updateFilter("status", value as RoomStatus);
              applyFilters();
            }}
          />
          <Link href={APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.CREATE()}>
            <Button className="w-fit ">
              <PlusCircle className="size-5" />
              <span className="hidden md:flex">Thêm phòng</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <CMSTableHeader columns={_tableHeader} />
          <TableBody>
            {(rooms?.length === 0 || isLoading) && (
              <TableRow className="">
                <TableCell
                  className="w-full h-fit text-base"
                  colSpan={_tableHeader.length}
                >
                  <TableNotFound
                    message={
                      isLoading
                        ? "Đang tải dữ liệu..."
                        : "Hiện tại không tìm thấy phòng phù hợp"
                    }
                  />
                </TableCell>
              </TableRow>
            )}

            {rooms?.map((room) => (
              <TableRow
                onDoubleClick={() => {
                  router.push(
                    APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.ID(room.code),
                  );
                }}
                className={cn(
                  "cursor-pointer hover:bg-blue-50",
                  {
                    "bg-gray-100":
                      room.status === ("available" as keyof typeof RoomStatus),
                  },
                  {
                    "bg-red-100":
                      room.end_date &&
                      new Date().getTime() - new Date(room.end_date).getTime() >
                        0 &&
                      room.status === ("rented" as keyof typeof RoomStatus),
                  },
                )}
                key={room.room_id}
              >
                <TableCell>{room.code}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {room.occupants_count || 0}
                </TableCell>
                <TableCell>{formatCurrency(room.current_rent)}</TableCell>

                <TableCell className="hidden md:table-cell">
                  {room.area}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {room.furniture_status === "basic"
                    ? "Cơ bản"
                    : room.furniture_status === "unfurnished"
                      ? "Không có"
                      : "Đầy đủ"}
                </TableCell>
                <TableCell className="min-w-[100px] truncate">
                  {room.tenant_name ? room.tenant_name : "--"}
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
                    className="p-2 md:px-2 md:py-1"
                  >
                    <span className="capitalize hidden md:block">
                      {RoomStatus[room.status]}
                    </span>
                  </Badge>
                </TableCell>

                {building?.id && (
                  <TableCell className="hidden md:table-cell">
                    <Link
                      href={APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.ID(room.code)}
                    >
                      <button className="disabled:opacity-30">
                        <Eye className="size-6 " />
                      </button>
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
