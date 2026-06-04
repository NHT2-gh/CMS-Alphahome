import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FurnitureStatus, RoomStatus } from "@/types/room";
import { FormField } from "@/components/_cms/components/form";
import { RoomInfoType } from "@/schemas/validation/admin.validation";

interface RoomInfoFormProps {
  roomInfoForm: UseFormReturn<RoomInfoType>;
}

export default function RoomInfoForm({ roomInfoForm }: RoomInfoFormProps) {
  return (
    <form className="grid grid-cols-2 gap-4">
      <FormField
        form={roomInfoForm}
        field={{
          name: "code_room",
          label: "Mã phòng",
          type: "text",
          placeholder: "Nhập mã phòng",
          required: true,
        }}
      />

      <FormField
        form={roomInfoForm}
        field={{
          name: "area",
          label: "Diện tích (m²)",
          type: "number",
          placeholder: "Nhập diện tích",
        }}
      />

      <FormField
        form={roomInfoForm}
        field={{
          name: "furniture_status",
          label: "Nội thất",
          type: "select",
          placeholder: "Chọn nội thất",
          required: true,

          options: Array.from(Object.entries(FurnitureStatus)).map(
            ([key, value]) => {
              return {
                value: key,
                label: value,
              };
            },
          ),
        }}
      />

      <FormField
        form={roomInfoForm}
        field={{
          name: "status",
          label: "Trạng thái",
          type: "select",
          readOnly: true,
          options: Array.from(Object.entries(RoomStatus)).map(
            ([key, value]) => {
              return {
                value: key,
                label: value,
              };
            },
          ),
        }}
      />

      <FormField
        form={roomInfoForm}
        field={{
          id: "room_available_from",
          name: "available_from",
          label: "Ngày dự kiến trống",
          placeholder: "Chọn ngày dự kiến trống",
          type: "date",
        }}
      />

      <FormField
        form={roomInfoForm}
        className="col-span-2"
        field={{
          name: "description",
          label: "Mô tả",
          type: "textarea",
          placeholder: "Nhập mô tả",
          rows: 4,
        }}
      />
    </form>
  );
}
