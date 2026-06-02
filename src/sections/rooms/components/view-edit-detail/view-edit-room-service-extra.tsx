"use client";
import React from "react";
import { Trash } from "lucide-react";
import { DataEmpty } from "@/components/_cms/common/table/state";
import { CalculationMethod, RoomServiceExtra } from "@/types/bill";
import { ComponentCard } from "@/components/_cms/common/component-card";
import { CMSTableHeader } from "@/components/_cms/components/table";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import AddRoomServiceExtraForm from "./add-room-service-extra-form";
import { useGetRoomServiceExtra } from "@/hooks/queries/use-service";
import { Badge } from "@/components/_cms/ui/badge";

interface ViewEditRoomServiceExtraProps {
  roomId: string;
  roomServiceExtras: RoomServiceExtra[];
}

export default function ViewEditRoomServiceExtra({
  roomId,
  roomServiceExtras,
}: ViewEditRoomServiceExtraProps) {
  const { data: servicesExtra } = useGetRoomServiceExtra(
    roomId,
    roomServiceExtras,
  );
  return (
    <ComponentCard
      title="Tiện ích & Dịch vụ phát sinh"
      className="overflow-visible space-y-5"
    >
      <>
        <Table>
          <CMSTableHeader
            columns={[
              { key: "name", title: "Tên dịch vụ" },
              { key: "calculation_method", title: "Đơn vị tính" },
              { key: "unit_price", title: "Đơn giá" },
              { key: "start_date", title: "Ngày áp dụng" },
              { key: "end_date", title: "Ngày kết thúc" },
              { key: "status", title: "Trạng thái" },
              { key: "actions", title: "" },
            ]}
          />

          <TableBody>
            {roomServiceExtras.length === 0 ? (
              <DataEmpty
                message={"Hiện tại không có dịch vụ nào"}
                colSpan={5}
              />
            ) : (
              servicesExtra?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.services.service_name}</TableCell>
                  <TableCell>
                    {item.services.unit_name
                      ? item.services.unit_name
                      : CalculationMethod[
                          item.services
                            .calculation_method as unknown as keyof typeof CalculationMethod
                        ]}
                  </TableCell>
                  <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                  <TableCell>
                    {formatDateTime(item.start_date, { withTime: true })}
                  </TableCell>
                  <TableCell>{item.end_date || "----"}</TableCell>
                  <TableCell>
                    <Badge color={item.end_date ? "error" : "success"}>
                      {item.end_date ? "Không áp dụng" : "Đang áp dụng"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <button
                    // onClick={() =>
                    //   handleDeleteServiceExtra(service.service_id)
                    // }
                    >
                      <Trash className="size-4 text-red-400" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <AddRoomServiceExtraForm id={roomId} />
      </>
    </ComponentCard>
  );
}
