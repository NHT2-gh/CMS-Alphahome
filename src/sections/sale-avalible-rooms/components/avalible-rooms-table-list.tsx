"use client";
import { TableDropdown } from "@/components/_cms/common/table-dropdown";
import CMSTableHeader, {
  TableHeaderColumn,
} from "@/components/_cms/components/table/table-header";
import { DropdownItem } from "@/components/_cms/ui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import { APP_ROUTES } from "@/config/app-routes";
import useAllRooms from "@/hooks/queries/use-room";
import { FurnitureStatus, RoomOverview } from "@/types/room";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import { EllipsisVertical, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const _columns: TableHeaderColumn[] = [
  { key: "room_code  ", title: "Mã phòng" },
  { key: "address", title: "Địa chỉ" },
  { key: "furniture_status", title: "Nội thất" },
  { key: "available_from", title: "Ngày trống" },
  { key: "price", title: "Giá" },
  { key: "desc", title: "Mô tả" },
  { key: "actions", title: "" },
];

export default function AvalibleRoomsTableList() {
  const router = useRouter();
  const { data: rooms } = useAllRooms(undefined, {
    filters: { status: "available" },
  });
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        <CMSTableHeader columns={_columns} />
        <TableBody>
          {rooms?.map((room: RoomOverview) => (
            <TableRow key={room.room_id}>
              <TableCell>{room.room_code}</TableCell>
              <TableCell className="min-w-[150px]">
                {room.building_address}
              </TableCell>
              <TableCell>
                {
                  FurnitureStatus[
                    room.furniture_status as unknown as keyof typeof FurnitureStatus
                  ]
                }
              </TableCell>

              <TableCell className="min-w-[100px]">
                {room.status !== "available"
                  ? room.available_from
                  : formatDateTime(new Date().toISOString())}
              </TableCell>
              <TableCell>{formatCurrency(room.current_rent)}</TableCell>
              <TableCell className="min-w-[100px]">
                {room.description || "---"}{" "}
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
                            APP_ROUTES.ADMIN.BUILDINGS.ID.ROOMS.ID(
                              room.room_code,
                              room.building_code,
                            ),
                          )
                        }
                      >
                        <Eye className="size-4" /> Xem chi tiết
                      </DropdownItem>
                    </>
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
