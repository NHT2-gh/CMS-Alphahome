"use client";
import React, { useEffect, useState } from "react";
import { FormField } from "@/components/_cms/components/form";
import useRooms from "@/hooks/queries/use-room";
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
import { useBuildingServices } from "@/hooks/queries/use-building";
import { Loader2 } from "lucide-react";

interface EditViewReadingProp {
  rangeDateSelected?: [string, string];
}
const currentDate = new Date();

export default function EditViewReading({
  rangeDateSelected,
}: EditViewReadingProp) {
  const { building } = useBuilding();
  const { data: rooms, error } = useRooms(building?.id);
  const {
    data: buildingServices,
    isFetching,
    isLoading,
  } = useBuildingServices(building?.id, {
    enabled: !!building?.id,
  });
  const [rangeDate] = useState<[string, string?]>(
    rangeDateSelected
      ? rangeDateSelected
      : [
          `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`,
          formatDateTime(new Date().toISOString()),
        ],
  );
  const { data: utilityReadingByDate, refetch } = useUtilityReadingByDate(
    building?.id,
    rangeDate[0],
    rangeDate[1],
  );
  const [isFirstReading, setIsFirstReading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [allowAutoFill, setAllowAutoFill] = useState(
    utilityReadingByDate?.length === 0,
  );
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
          month_date: item.month_date,
          building_service_id:
            buildingServices?.find(
              (service) => service.services.service_type === item.type,
            )?.id || "",
          updated_at: item.updated_at,
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
          updated.consumption = currVal - prevVal < 0 ? 0 : currVal - prevVal;
        }
      }

      return {
        ...prev,
        [`${roomId}-${type}`]: updated,
      };
    });
  };

  const handleAutoFill = async () => {
    if (!rooms) return;

    const initData = rooms?.reduce(
      (acc, room) => {
        acc[`${room.room_id}-electricity`] = {
          type: "electricity",
          previous_reading: null,
          current_reading: null,
          consumption: null,
          room_id: room.room_id,
          month_date: rangeDate[0],
          building_service_id:
            buildingServices?.find(
              (service) => service.services.service_type === "electricity",
            )?.id || "",
        };
        acc[`${room.room_id}-water`] = {
          type: "water",
          previous_reading: null,
          current_reading: null,
          consumption: null,
          room_id: room.room_id,
          month_date: rangeDate[0],
          building_service_id:
            buildingServices?.find(
              (service) => service.services.service_type === "water",
            )?.id || "",
        };
        return acc;
      },
      {} as Record<string, UtilityReadingDetail>,
    );

    const result = await createUtilityReading(initData, isFirstReading);

    if (result.success) {
      refetch();
      setAllowAutoFill(false);
      showToast.success({
        title: "Thành công",
        description: "Tự động điền dữ liệu thành công",
      });
    } else {
      showToast.error({
        title: "Lỗi",
        description: result.error,
      });
    }
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
      <div>
        <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Thông tin bản ghi mới của tòa nhà {building?.code}
        </h4>
        <span className="text-sm text-gray-700 dark:text-gray-500 font-normal">
          Cập nhật lần cuối:{" "}
          {utilityReadingByDate?.[0].updated_at
            ? formatDateTime(utilityReadingByDate[0].updated_at, {
                withTime: true,
                formatString: "dd-mm-yyyy",
              })
            : "Chưa có dữ liệu"}
        </span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(readings, isFirstReading);
        }}
        className="flex justify-between items-end"
      >
        {!rangeDateSelected && (
          <>
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

            <FormField
              field={{
                id: "month_date",
                label: "Kì ghi chỉ số",
                type: "text",
                readOnly: true,
                defaultValue: `Tháng ${rangeDate[0].split("-")[1]}`,
              }}
            />
          </>
        )}

        <Button
          disabled={!isEdit}
          className="w-fit h-fit ml-auto"
          type="submit"
        >
          {rangeDateSelected
            ? "Cập nhật bảng ghi"
            : allowAutoFill
              ? "Tạo bảng ghi mới"
              : "Cập nhật bảng ghi"}
        </Button>
      </form>

      <Checkbox
        id="isFirstReading"
        checked={isFirstReading}
        onChange={() => setIsFirstReading(!isFirstReading)}
        label={"Đây là bản ghi đầu tiên"}
      />

      {isFirstReading && (
        <span className="text-sm text-amber-600 dark:text-amber-400 font-normal">
          Lưu ý: Với bản ghi đầu tiên, vui lòng nhập số liệu ban đầu của từng
          loại dịch vụ cho từng phòng vào cột dữ liệu hiện tại.
        </span>
      )}
      {allowAutoFill && (
        <Button
          className="w-fit"
          onClick={() => {
            handleAutoFill();
          }}
        >
          Tự động điền dữ liệu tháng trước
        </Button>
      )}
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

          <TableBody className="max-h-[300px] min-h-[300px] w-full overflow-y-scroll">
            {isLoading || isFetching ? (
              <TableRow>
                <TableCell className="text-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              rooms?.map((room) => (
                <TableRow
                  key={room.room_id}
                  className="!min-w-full border-b border-neutral-300 last:border-0"
                >
                  <TableCell key={room.room_id}>{room.code}</TableCell>
                  <TableCell key="previous_reading_electricity">
                    <Input
                      disabled={isFirstReading}
                      min="0"
                      className="max-w-[120px] max-h-10"
                      value={
                        readings[`${room.room_id}-electricity`]
                          ?.previous_reading || 0
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
                          ?.current_reading || 0
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
                      disabled={isFirstReading}
                      min="0"
                      className="max-w-[120px] max-h-10"
                      value={
                        readings[`${room.room_id}-water`]?.previous_reading || 0
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
                        readings[`${room.room_id}-water`]?.current_reading || 0
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
