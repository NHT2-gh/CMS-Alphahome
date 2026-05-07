"use client";
import { FormField } from "@/components/_cms/components/form";
import Button from "@/components/ui/button/Button";
import { useCreateBuilding } from "@/hooks/queries/use-building";
import { showToast } from "@/lib/toast";
import {
  createBuildingFormSchema,
  CreateBuildingFormType,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

export default function BuildingCreateForm() {
  const createBuilding = useCreateBuilding();
  const createBuildingForm = useForm<CreateBuildingFormType>({
    resolver: zodResolver(createBuildingFormSchema),
    defaultValues: {
      code: "",
      address: "",
      price_rent: 0,
      price_deposit: 0,
      contract_term: "",
    },
  });

  const { handleSubmit } = createBuildingForm;

  const onSubmit = async (data: CreateBuildingFormType) => {
    try {
      const result = await createBuilding.mutateAsync(data);
      if (result.success) {
        showToast.success({
          title: "Thông báo",
          description: "Tạo tòa nhà thành công",
        });
        createBuildingForm.reset();
      }
    } catch (error) {
      showToast.error({
        title: "Thông báo",
        description: "Tạo tòa nhà thất bại",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-10 gap-y-5"
    >
      <FormField
        form={createBuildingForm}
        field={{
          name: "code",
          label: "Mã tòa nhà",
          placeholder: "Nhập mã tòa nhà",
          type: "text",
        }}
      />
      <FormField
        form={createBuildingForm}
        field={{
          name: "address",
          label: "Địa chỉ",
          placeholder: "Nhập địa chỉ",
          type: "text",
        }}
      />

      <FormField
        form={createBuildingForm}
        field={{
          name: "price_rent",
          label: "Giá thuê (VND)",
          placeholder: "Nhập giá thuê",
          type: "number",
          min: 0,
          formatCurrency: true,
        }}
      />
      <FormField
        form={createBuildingForm}
        field={{
          name: "price_deposit",
          label: "Giá cọc (VND)",
          placeholder: "Nhập giá cọc",
          type: "number",
          min: 0,
          formatCurrency: true,
        }}
      />
      <FormField
        form={createBuildingForm}
        field={{
          id: "contract_term",
          name: "contract_term",
          label: "Thời hạn hợp đồng",
          placeholder: "Chọn thời hạn hợp đồng",
          type: "date",
          mode: "range",
        }}
      />

      <Button type="submit" className="w-fit ml-auto col-span-2">
        Tạo tòa nhà
      </Button>
    </form>
  );
}
