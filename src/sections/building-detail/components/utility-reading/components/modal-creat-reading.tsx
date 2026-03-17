"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/_cms/components/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUtilityReadingFormSchema,
  CreateUtilityReadingFormType,
} from "@/schemas/validation/admin.validation";
import useRoom from "@/hooks/queries/use-room";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/_cms/ui/input";
import { formatDate } from "@/utils/format-data";
import {
  UtilityReadingDetail,
  UtilityReadingType,
} from "@/types/utility_reading";
import { useUtilityReadingByDate } from "@/hooks/queries/use-utility-reading";
import { useBuilding } from "@/context/BuildingContext";

export default function ModalCreatReading({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const { building } = useBuilding();
  const createForm = useForm<CreateUtilityReadingFormType>({
    resolver: zodResolver(createUtilityReadingFormSchema),
    defaultValues: {
      month: formatDate(new Date()),
    },
    mode: "onTouched",
  });

  if (!building) return null;
  const { data: utilityReadingByDate } = useUtilityReadingByDate(
    building.id,
    new Date().toISOString().split("T")[0],
  );

  const [readings, setReadings] = useState<
    Record<string, UtilityReadingDetail>
  >({});

  useEffect(() => {
    if (!utilityReadingByDate) return;

    const mapped = Object.fromEntries(
      utilityReadingByDate.map((item) => [
        `${item.room_id}-${item.type}`,
        item,
      ]),
    );

    setReadings(mapped);
  }, [utilityReadingByDate]);

  const { data: rooms, error } = useRoom(building.id);

  const handleChange = (
    roomId: string,
    field: keyof UtilityReadingDetail,
    type: UtilityReadingType,
    value: string,
  ) => {
    setReadings((prev) => {
      const roomData = prev[`${roomId}-${type}`] ?? {
        type,
        previous_reading: "",
        current_reading: "",
        consumption: "",
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[80%] p-5 lg:p-10"
    >
      <div className="flex flex-col gap-5">
        {/* <FormInModal /> */}
        <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Thông tin bản ghi mới của tòa nhà {building.code}
        </h4>
        <form className="grid grid-cols-2 gap-10">
          <FormField
            form={createForm}
            field={{
              required: true,
              name: "month",
              label: "Thời gian ghi chỉ số",
              type: "text",
              readOnly: true,
              className: "capitalize",
            }}
          />
        </form>

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
                          ?.previous_reading
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
                        readings[`${room.room_id}-electricity`]?.current_reading
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
                    {readings[`${room.room_id}-electricity`]?.consumption}
                  </TableCell>

                  <TableCell key="previous_reading_water">
                    <Input
                      min="0"
                      className="max-w-[120px] max-h-10"
                      value={
                        readings[`${room.room_id}-water`]?.previous_reading
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
                      value={readings[`${room.room_id}-water`]?.current_reading}
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
    </Modal>
  );
}
