"use client";
import React from "react";
import { FormField } from "@/components/_cms/components/form";
import { useFormContext } from "react-hook-form";
import { UpdateBuildingSettingType } from "@/schemas/validation/admin.validation";

export default function UpdateBuildingInfoForm() {
  const formBuildingSetting = useFormContext<UpdateBuildingSettingType>();
  return (
    <>
      <FormField
        form={formBuildingSetting}
        field={{
          name: "info.code",
          type: "text",
          label: "Mã toà nhà",
          placeholder: "Nhập mã toà nhà",
        }}
      />
      <FormField
        form={formBuildingSetting}
        field={{
          name: "info.address",
          type: "text",
          label: "Địa chỉ",
          placeholder: "Nhập địa chỉ",
        }}
      />
      <FormField
        form={formBuildingSetting}
        field={{
          name: "info.price_rent",
          type: "number",
          label: "Giá thuê",
          placeholder: "Nhập giá thuê",
          min: 0,
          formatCurrency: true,
        }}
      />
      <FormField
        form={formBuildingSetting}
        field={{
          name: "info.price_deposit",
          type: "number",
          label: "Giá cọc",
          placeholder: "Nhập giá cọc",
          formatCurrency: true,
        }}
      />
      <FormField
        form={formBuildingSetting}
        field={{
          id: "start_date",
          name: "info.start_date",
          type: "date",
          label: "Ngày bắt đầu",
          placeholder: "Nhập ngày bắt đầu",
        }}
      />
      <FormField
        form={formBuildingSetting}
        field={{
          id: "end_date",
          name: "info.end_date",
          type: "date",
          label: "Ngày kết thúc",
          placeholder: "Nhập ngày kết thúc",
        }}
      />
      <FormField
        form={formBuildingSetting}
        field={{
          name: "info.is_active",
          type: "switch",
          label: "Đang hoạt động",
        }}
      />
    </>
  );
}
