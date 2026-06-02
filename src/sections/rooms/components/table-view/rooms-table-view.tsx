"use client";
import React, { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { FurnitureStatus, Room, RoomOverview, RoomStatus } from "@/types/room";
import { useRouter } from "next/navigation";
import useAllRooms from "@/hooks/queries/use-room";
import { Eye, FilterIcon, PlusCircle, RefreshCcwIcon } from "lucide-react";
import { Badge } from "@/components/_cms/ui/badge";
import { APP_ROUTES } from "@/config/app-routes";
import { Button } from "@/components/_cms/ui/button";
import { useBuilding } from "@/context/BuildingContext";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import { CMSTableHeader } from "@/components/_cms/components/table";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import { useFilter } from "@/hooks/use-filter";
import { RoomFilterSchema } from "@/schemas/render-filter-schemas/room-filter.schema";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import { DataEmpty } from "@/components/_cms/common/table/state";
import { TableHeaderColumn } from "@/components/_cms/components/table/table-header";
import { showToast } from "@/lib/toast";
import { FilterBoxRender } from "@/components/_cms/components/filter/box";
import { Checkbox } from "@/components/_cms/ui/input";

const _tableHeader: TableHeaderColumn[] = [
  { key: "code", title: "Mã phòng" },
  { key: "current_rent", title: "Giá thuê" },
  { key: "furniture_status", title: "Nội thất", isHiddenOnMobile: true },
  { key: "tenant_name", title: "Tên người thuê" },
  { key: "end_date", title: "Hạn hợp đồng" },
  { key: "status", title: "Trạng thái" },
  { key: "actions", title: "", isHiddenOnMobile: true },
];
export default function RoomsTable() {
  const { building } = useBuilding();
  const { filterValues, updateFilter, applyFilters, clearFilters } = useFilter({
    filterConfigs: RoomFilterSchema,
  });
  const {
    data: rooms,
    error,
    isLoading,
    refetch,
  } = useAllRooms(building?.id, {
    filters: filterValues,
  });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedRooms, setSelectedRooms] = useState<
    Record<string, RoomOverview>
  >({});
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

          <Button
            variant="outline"
            className="text-sm"
            disabled={isLoading || !rooms}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon className="size-4" /> Bộ lọc
          </Button>

          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcwIcon className="size-4" />
          </Button>

          <Link href={APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.CREATE()}>
            <Button className="w-fit ">
              <PlusCircle className="size-5" />
              <span className="hidden md:flex">Thêm phòng</span>
            </Button>
          </Link>
        </div>
      </div>

      {Object.keys(selectedRooms).length > 0 && (
        <div className="rows-actions">
          <span className="text-xs">
            Đã chọn {Object.keys(selectedRooms).length} phòng
          </span>
        </div>
      )}

      {isFilterOpen && (
        <FilterBoxRender
          filterConfigs={RoomFilterSchema}
          filterValues={filterValues}
          handleFilterChange={updateFilter}
          handleClearAllFilters={clearFilters}
        />
      )}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <CMSTableHeader
            selectAll={
              Object.keys(selectedRooms).length === (rooms?.length || 0)
            }
            handleSelectAll={() => {
              if (!rooms) return;
              if (Object.keys(selectedRooms).length === (rooms?.length || 0)) {
                setSelectedRooms({});
                return;
              }
              setSelectedRooms((prev) => {
                const newPrev = { ...prev };
                rooms.forEach((room) => {
                  newPrev[room.room_id] = room;
                });
                return newPrev;
              });
            }}
            columns={_tableHeader}
          />
          <TableBody>
            {(rooms?.length === 0 || isLoading) && (
              <DataEmpty
                colSpan={_tableHeader.length}
                message={
                  isLoading
                    ? "Đang tải dữ liệu..."
                    : "Hiện tại không tìm thấy phòng phù hợp"
                }
              />
            )}

            {rooms?.map((room) => (
              <TableRow
                onDoubleClick={() => {
                  router.push(
                    APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.ID(
                      room.room_code,
                      room.building_code,
                    ),
                  );
                }}
                className={cn(
                  "cursor-pointer hover:bg-green-50 dark:hover:bg-green-950",
                  {
                    "bg-gray-100 dark:bg-gray-700":
                      room.status === ("available" as keyof typeof RoomStatus),
                  },
                )}
                key={room.room_id}
              >
                <TableCell>
                  <Checkbox
                    id={room.room_id}
                    label={room.room_code}
                    checked={selectedRooms[room.room_id] !== undefined}
                    onChange={() => {
                      setSelectedRooms((prev) => {
                        const newPrev = { ...prev };
                        if (newPrev[room.room_id]) {
                          delete newPrev[room.room_id];
                        } else {
                          newPrev[room.room_id] = room;
                        }
                        return newPrev;
                      });
                    }}
                  />
                </TableCell>

                <TableCell>{formatCurrency(room.current_rent)}</TableCell>

                <TableCell className="hidden md:table-cell">
                  {
                    FurnitureStatus[
                      room.furniture_status as unknown as keyof typeof FurnitureStatus
                    ]
                  }
                </TableCell>
                <TableCell className="min-w-[100px] truncate">
                  {room.tenant_name ? room.tenant_name : "--"}
                </TableCell>

                <TableCell
                  className={cn("min-w-[6.25rem]", {
                    "text-red-600 text-sm":
                      room.end_date &&
                      new Date().getTime() - new Date(room.end_date).getTime() >
                        0 &&
                      room.status === "rented",
                  })}
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
                    <button
                      className="disabled:opacity-30"
                      onClick={() =>
                        router.push(
                          APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.ID(
                            room.room_code,
                            building.code,
                          ),
                        )
                      }
                    >
                      <Eye className="size-6 " />
                    </button>
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
