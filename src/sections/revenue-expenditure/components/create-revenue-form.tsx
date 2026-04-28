"use client";
import React, { useEffect } from "react";

import { showToast } from "@/lib/toast";
import {
  useBuildingRevenueCombined,
  useCreateTransaction,
} from "@/hooks/queries/use-transaction";
import {
  createTransactionSchema,
  CreateTransactionType,
} from "@/schemas/validation/admin.validation";
import useAllRooms from "@/hooks/queries/use-room";
import Button from "@/components/ui/button/Button";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuilding } from "@/context/BuildingContext";
import { useCategories } from "@/hooks/queries/use-category";
import { FormField } from "@/components/_cms/components/form";
import { PaymentMethod, TransactionType } from "@/types/transcription";

export default function CreateRevenueForm() {
  const { building } = useBuilding();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const { data: rooms } = useAllRooms(building?.id);
  const { data: buildingRevenueCombined } = useBuildingRevenueCombined(
    building?.id as string,
  );
  const createRevenueForm = useForm<CreateTransactionType>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: "",
      amount: 0,
      description: "",
      category_id: "",
      room_id: undefined,
      payment_method: "",
      transaction_date: "",
      building_id: building?.id,
    },
  });
  const category = useWatch({
    control: createRevenueForm.control,
    name: "category_id",
  });

  const transaction_date = useWatch({
    control: createRevenueForm.control,
    name: "transaction_date",
  });
  useEffect(() => {
    if (buildingRevenueCombined && category) {
      const categoryData = buildingRevenueCombined.find(
        (item) =>
          item.category_name ===
            categories?.find((c) => c.id === category)?.name &&
          new Date(item.month).getMonth() ===
            new Date(transaction_date).getMonth(),
      );

      if (categoryData) {
        setValue("type", categoryData.type);
        setValue("amount", categoryData.total_amount);
      } else {
        setValue("type", "");
        setValue("amount", 0);
      }
    }
  }, [buildingRevenueCombined, category, transaction_date]);

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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 border-b border-gray-200 pb-6 dark:border-gray-700"
    >
      <FormField
        form={createRevenueForm}
        className="col-span-2"
        field={{
          name: "category_id",
          required: true,
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
        className="md:col-span-1 col-span-2"
        field={{
          id: "transaction_date",
          required: true,

          name: "transaction_date",
          label: "Ngày giao dịch",
          type: "date",
          placeholder: "Chọn ngày",
          defaultValue: new Date().toISOString().split("T")[0],
        }}
      />
      <FormField
        form={createRevenueForm}
        field={{
          name: "type",
          required: true,

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
        field={{
          name: "amount",
          required: true,

          label: "Số tiền",
          type: "number",
          placeholder: "Nhập số tiền",
          formatCurrency: true,
        }}
      />

      <FormField
        form={createRevenueForm}
        field={{
          name: "payment_method",
          label: "Thanh toán",
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
        field={{
          name: "room_id",
          label: "Số phòng",
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

      <FormField
        form={createRevenueForm}
        className="col-span-2 lg:col-span-4"
        field={{
          name: "description",
          label: "Mô tả chi tiết",
          type: "text",
          placeholder: "Nhập mô tả chi tiết",
        }}
      />

      <Button
        type="submit"
        className="w-full md:w-[8rem] col-span-2 md:col-span-1 md:col-end-4 lg:col-end-7 h-fit self-end"
      >
        Thêm
      </Button>
    </form>
  );
}
