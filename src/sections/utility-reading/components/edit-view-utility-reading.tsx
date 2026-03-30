"use client";
import React, { useEffect, useState } from "react";
import { FormField } from "@/components/_cms/components/form";
import useRoom from "@/hooks/queries/use-room";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox, Input } from "@/components/_cms/ui/input";
import {
  UtilityReadingDetail,
  UtilityReadingType,
} from "@/types/utility_reading";
import { useUtilityReadingByDate } from "@/hooks/queries/use-utility-reading";
import { useBuilding } from "@/context/BuildingContext";
import Button from "@/components/ui/button/Button";
import { createUtilityReading } from "@/lib/server-action/utility-action.action";
import { showToast } from "@/lib/toast";
import { formatDateTime } from "@/utils/format-data";

interface EditViewReadingProp {
  currentDate?: string;
}

export default function EditViewReading({
  currentDate = formatDateTime(new Date().toISOString()),
}: EditViewReadingProp) {
  console.log(currentDate);
  const { building } = useBuilding();
  const { data: rooms, error } = useRoom(building?.id);
  const { data: utilityReadingByDate } = useUtilityReadingByDate(
    building?.id,
    currentDate,
  );
  const [isFirstReading, setIsFirstReading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [readings, setReadings] = useState<
    Record<string, UtilityReadingDetail>
  >({});

  useEffect(() => {
    if (error || !building?.id) {
      showToast.error({
        title: "Lỗi",
        description: "Không tìm thấy thông tin tòa nhà",
      });
    }
  }, [error, building?.id]);

  useEffect(() => {
    if (!utilityReadingByDate) return;

    const mapped = Object.fromEntries(
      utilityReadingByDate.map((item) => [
        `${item.room_id}-${item.type}`,
        {
          type: item.type,
          previous_reading: item.previous_reading,
          current_reading: item.current_reading,
          consumption: item.consumption,
          room_id: item.room_id,
        },
      ]),
    );

    setReadings(mapped);
  }, [utilityReadingByDate]);

  const handleChange = (
    roomId: string,
    field: keyof UtilityReadingDetail,
    type: UtilityReadingType,
    value: string,
  ) => {
    setIsEdit(true);
    setReadings((prev) => {
      const roomData = prev[`${roomId}-${type}`] ?? {
        type,
        previous_reading: "",
        current_reading: "",
        consumption: "",
        room_id: roomId,
      };

      const updated = {
        ...roomData,
        [field]: value,
      };

      // auto calculate consumption
      if (field === "previous_reading" || field === "current_reading") {
        const prevVal = Number(updated.previous_reading);
        const currVal = Number(updated.current_reading);

        if (!isNaN(prevVal) && !isNaN(currVal)) {
          updated.consumption = String(
            currVal - prevVal < 0 ? 0 : currVal - prevVal,
          );
        }
      }

      return {
        ...prev,
        [`${roomId}-${type}`]: updated,
      };
    });
  };

  const onSubmit = async (
    data: Record<string, UtilityReadingDetail>,
    isFirstReading: boolean,
  ) => {
    const result = await createUtilityReading(data, isFirstReading);
    if (result.success) {
      showToast.success({
        title: "Thành công",
        description: "Tạo bản ghi mới thành công",
      });
    } else {
      showToast.error({
        title: "Lỗi",
        description: result.error,
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* <FormInModal /> */}
      <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Thông tin bản ghi mới của tòa nhà {building?.code}
      </h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(readings, isFirstReading);
        }}
        className="flex justify-between items-end"
      >
        <FormField
          field={{
            required: true,
            label: "Thời gian ghi chỉ số",
            type: "text",
            readOnly: true,
            defaultValue: formatDateTime(new Date().toISOString(), {
              withTime: true,
            }),
          }}
        />

        <Button disabled={!isEdit} className="w-fit h-fit" type="submit">
          Tạo bản ghi mới
        </Button>
      </form>

      <Checkbox
        id="isFirstReading"
        checked={isFirstReading}
        onChange={() => setIsFirstReading(!isFirstReading)}
        label={"Đây là bản ghi đầu tiên"}
      />

      <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
        Danh sách chỉ số
      </h4>

      <div className="w-full grow space-y-2 border border-neutral-200 rounded-xl max-h-[40vh] overflow-y-scroll">
        <Table className="w-full text-left  text-sm text-gray-700">
          <CMSTableHeader
            className="bg-neutral-100  sticky top-0 z-10"
            tableHeader={[
              { key: "room_code", title: "Số phòng" },
              {
                key: "previous_reading_electricity",
                title: "Số điện cũ",
              },
              { key: "electricity", title: "Số điện hiện tại" },
              { key: "total_consumption_elec", title: "Điện đã sử dụng" },
              {
                key: "previous_reading_water",
                title: "Số nước cũ",
              },
              {
                key: "water",
                title: "Số nước hiện tại",
              },
              { key: "total_consumption_water", title: "Nước đã sử dụng" },
            ]}
          />

          <TableBody className="max-h-[300px] w-full overflow-y-scroll">
            {rooms?.map((room) => (
              <TableRow
                key={room.room_id}
                className="!min-w-full border-b border-neutral-300 last:border-0"
              >
                <TableCell key={room.room_id}>{room.code}</TableCell>
                <TableCell key="previous_reading_electricity">
                  <Input
                    min="0"
                    className="max-w-[120px] max-h-10"
                    value={
                      readings[`${room.room_id}-electricity`]
                        ?.previous_reading || ""
                    }
                    type="number"
                    onChange={(e) => {
                      handleChange(
                        room.room_id,
                        "previous_reading",
                        "electricity",
                        e.target.value,
                      );
                    }}
                  />
                </TableCell>

                <TableCell key="current_reading_electricity">
                  <Input
                    min="0"
                    className="max-w-[120px] max-h-10"
                    value={
                      readings[`${room.room_id}-electricity`]
                        ?.current_reading || ""
                    }
                    type="number"
                    onChange={(e) => {
                      handleChange(
                        room.room_id,
                        "current_reading",
                        "electricity",
                        e.target.value,
                      );
                    }}
                  />
                </TableCell>

                <TableCell>
                  {readings[`${room.room_id}-electricity`]?.consumption || ""}
                </TableCell>

                <TableCell key="previous_reading_water">
                  <Input
                    min="0"
                    className="max-w-[120px] max-h-10"
                    value={
                      readings[`${room.room_id}-water`]?.previous_reading || ""
                    }
                    type="number"
                    onChange={(e) => {
                      handleChange(
                        room.room_id,
                        "previous_reading",
                        "water",
                        e.target.value,
                      );
                    }}
                  />
                </TableCell>
                <TableCell key="current_reading_water">
                  <Input
                    min="0"
                    className="max-w-[120px] max-h-10"
                    value={
                      readings[`${room.room_id}-water`]?.current_reading || ""
                    }
                    type="number"
                    onChange={(e) => {
                      handleChange(
                        room.room_id,
                        "current_reading",
                        "water",
                        e.target.value,
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  {readings[`${room.room_id}-water`]?.consumption}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
