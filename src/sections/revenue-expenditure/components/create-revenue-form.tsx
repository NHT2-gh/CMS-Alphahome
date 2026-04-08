"use client";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  createTransactionSchema,
  CreateTransactionType,
} from "@/schemas/validation/admin.validation";
import useRooms from "@/hooks/queries/use-room";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/_cms/components/form";
import { useCategories } from "@/hooks/queries/use-category";
import { PaymentMethod, TransactionType } from "@/types/transcription";
import Button from "@/components/ui/button/Button";
import { useBuilding } from "@/context/BuildingContext";
import { showToast } from "@/lib/toast";
import {
  useBuildingRevenueCombined,
  useCreateTransaction,
} from "@/hooks/queries/use-transaction";

export default function CreateRevenueForm() {
  const { building } = useBuilding();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const { data: rooms } = useRooms(building?.id);
  const { data: buildingRevenueCombined } = useBuildingRevenueCombined(
    building?.id as string,
  );
  const createRevenueForm = useForm<CreateTransactionType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      category_id: "",
      amount: 0,
      type: "",
      transaction_date: "",
      description: "",
      payment_method: "",
      room_id: undefined,
      building_id: building?.id,
    },
  });
  const category = useWatch({
    control: createRevenueForm.control,
    name: "category_id",
  });
  useEffect(() => {
    if (buildingRevenueCombined && category) {
      const categoryData = buildingRevenueCombined.find(
        (item) =>
          item.category_name ===
          categories?.find((c) => c.id === category)?.name,
      );

      if (categoryData) {
        setValue("type", categoryData.type);
        setValue("amount", categoryData.total_amount);
      } else {
        setValue("type", "");
        setValue("amount", 0);
      }
    }
  }, [buildingRevenueCombined, category]);

  const { handleSubmit, setValue, reset } = createRevenueForm;

  const onSubmit = async (data: CreateTransactionType) => {
    try {
      const result = await createTransaction.mutateAsync(data);
      if (result.success) {
        showToast.success({
          title: "Thành công",
          description: "Thêm doanh thu thành công",
        });
        reset();
      }
    } catch (error) {
      showToast.error({
        title: "Lỗi",
        description: "Thêm doanh thu thất bại",
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-6 gap-6 border-b border-gray-200 pb-6 dark:border-gray-700"
    >
      <FormField
        form={createRevenueForm}
        className="col-span-2"
        field={{
          name: "category_id",
          label: "Hạng mục",
          type: "select",
          placeholder: "Chọn hạng mục",
          options: [
            ...(categories?.map((category) => ({
              value: category.id,
              label: category.name,
            })) || []),
            {
              value: "other",
              label: "Khác",
            },
          ],
        }}
      />
      <FormField
        form={createRevenueForm}
        className="col-span-1"
        field={{
          name: "type",
          label: "Loại",
          type: "select",
          placeholder: "Chọn loại",
          options: [
            ...(Object.entries(TransactionType).map(([key, type]) => ({
              value: key,
              label: type,
            })) || []),
          ],
        }}
      />

      <FormField
        form={createRevenueForm}
        className="col-span-1"
        field={{
          name: "amount",
          label: "Số tiền",
          type: "number",
          placeholder: "Nhập số tiền",
        }}
      />

      <FormField
        form={createRevenueForm}
        field={{
          id: "transaction_date",
          name: "transaction_date",
          label: "Ngày giao dịch",
          type: "date",
          placeholder: "Chọn ngày",
        }}
      />
      <FormField
        form={createRevenueForm}
        field={{
          name: "payment_method",
          label: "Phương thức thanh toán",
          type: "select",
          placeholder: "Chọn phương thức thanh toán",
          options: [
            ...(Object.entries(PaymentMethod).map(([key, method]) => ({
              value: key,
              label: method,
            })) || []),
          ],
        }}
      />

      <FormField
        form={createRevenueForm}
        className="col-span-4"
        field={{
          name: "description",
          label: "Mô tả chi tiết",
          type: "text",
          placeholder: "Nhập mô tả chi tiết",
        }}
      />

      <FormField
        form={createRevenueForm}
        className="col-span-2"
        field={{
          name: "room_id",
          label: "Liên kết số phòng (nếu có)",
          type: "select",
          placeholder: "Chọn số phòng",
          options: [
            {
              value: "",
              label: "Không có",
            },
            ...(rooms?.map((room) => ({
              value: room.room_id,
              label: room.code,
            })) || []),
          ],
        }}
      />

      <Button type="submit" className="w-[8rem] col-end-7 h-fit ml-auto">
        Thêm
      </Button>
    </form>
  );
}
