"use client";

import { FormField } from "@/components/_cms/components/form";
import { Button } from "@/components/_cms/ui/button";
import {
  useAddRoomServiceExtra,
  useGetServices,
} from "@/hooks/queries/use-service";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { showToast } from "@/lib/toast";
import {
  addRoomServiceExtraFormSchema,
  AddRoomServiceExtraFormType,
} from "@/schemas/validation/admin.validation";
import { CalculationMethod } from "@/types/bill";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

interface AddRoomExtraServiceFormProps {
  id: string;
}

export default function AddRoomExtraServiceForm({
  id,
}: AddRoomExtraServiceFormProps) {
  const addServiceForm = useForm<AddRoomServiceExtraFormType>({
    resolver: zodResolver(addRoomServiceExtraFormSchema),
    defaultValues: {
      service_id: "",
      quantity: 1,
      calculation_method: "",
      unit_price: 0,
      start_date: new Date().toISOString().split("T")[0],
      end_date: null,
    },
  });
  const { data: servicesExtra } = useGetServices("extra");
  const addRoomServiceExtra = useAddRoomServiceExtra();
  const service_id = useWatch({
    control: addServiceForm.control,
    name: "service_id",
  });
  const quantity = useWatch({
    control: addServiceForm.control,
    name: "quantity",
  });
  const unit_price = useWatch({
    control: addServiceForm.control,
    name: "unit_price",
  });

  useEffect(() => {
    if (service_id) {
      const service = servicesExtra?.find(
        (item) => String(item.id) === String(service_id),
      );

      if (service) {
        addServiceForm.setValue(
          "calculation_method",
          service.unit_name ||
            CalculationMethod[
              service.calculation_method as unknown as keyof typeof CalculationMethod
            ],
        );
      }
    }
  }, [service_id]);

  const {
    handleSubmit,
    formState: { isLoading },
  } = addServiceForm;

  const onSubmit = async (data: AddRoomServiceExtraFormType) => {
    try {
      const result = await addRoomServiceExtra.mutateAsync({
        data: {
          room_id: id,
          service_id: data.service_id,
          quantity: data.quantity,
          unit_price: data.unit_price,
          start_date: data.start_date,
          end_date: data.end_date,
        },
      });
      if (result.success) {
        showToast.success({ title: "Thêm dịch vụ thành công" });
        addServiceForm.reset();
      }
    } catch (error) {
      showToast.error({
        title: "Lỗi",
        description: mapErrorToMessage(error) ?? "Lỗi hệ thống",
      });
      console.log(error);
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 items-end sm:grid-cols-3 lg:grid-cols-13">
          <FormField
            className="w-full lg:col-span-3"
            form={addServiceForm}
            field={{
              name: "service_id",
              type: "select",
              label: "Dịch vụ",
              placeholder: "Chọn dịch vụ",
              options:
                servicesExtra
                  ?.filter((item) => item.calculation_method !== "by_usage")
                  .map((item) => ({
                    label: item.service_name,
                    value: item.id,
                  })) ?? [],
            }}
          />

          <FormField
            className="w-full lg:col-span-2"
            form={addServiceForm}
            field={{
              name: "calculation_method",
              type: "text",
              placeholder: "Đơn vị tính",
              label: "Đơn vị tính",
              readOnly: true,
            }}
          />

          <FormField
            className="w-full lg:col-span-2"
            form={addServiceForm}
            field={{
              name: "unit_price",
              type: "number",
              placeholder: "Nhập đơn giá",
              label: "Đơn giá",
              formatCurrency: true,
            }}
          />

          <FormField
            className="w-full lg:col-span-2"
            form={addServiceForm}
            field={{
              name: "quantity",
              type: "number",
              placeholder: "Nhập số lượng",
              label: "Số lượng",
              className: "w-full lg:col-span-2",
            }}
          />

          <FormField
            className="w-full lg:col-span-2"
            field={{
              type: "number",
              defaultValue: 0,
              label: "Tổng tiền",
              className: "w-full lg:col-span-2",
              readOnly: true,
              value: quantity * Number(unit_price),
              formatCurrency: true,
            }}
          />

          <FormField
            className="w-full lg:col-span-2"
            form={addServiceForm}
            field={{
              id: "start_date",
              name: "start_date",
              type: "date",
              defaultDate: "",
              label: "Ngày áp dụng",
              className: "w-full lg:col-span-2",
            }}
          />

          <Button
            disabled={isLoading || !service_id}
            type="submit"
            size="sm"
            className="h-fit !px-2 lg:col-span-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Thêm dịch vụ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
