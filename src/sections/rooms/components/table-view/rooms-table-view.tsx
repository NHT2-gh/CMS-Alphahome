"use client";
import React, { useCallback, useState } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { RoomOverview } from "@/types/room";
import { useRouter } from "next/navigation";
import useRooms from "@/hooks/queries/use-room";
import TableAction from "./rooms-table-action";
import { Eye, PlusCircle } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { APP_ROUTES } from "@/config/app-routes";
import Button from "@/components/ui/button/Button";
import { useBuilding } from "@/context/BuildingContext";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
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
  const { data: rooms, error } = useRooms(building?.id);
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
        <div className="flex items-center gap-6">
          <TableAction handleSearch={handleSearch} />
          <Link href={APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.CREATE()}>
            <Button>
              <PlusCircle className="size-5" />
              Thêm phòng
            </Button>
          </Link>
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
              <TableCell>{formatCurrency(room.current_rent)}</TableCell>

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

              {building?.id && (
                <TableCell>
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
  );
}
