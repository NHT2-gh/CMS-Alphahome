"use client";

import { FormField } from "@/components/_cms/components/form";
import Button from "@/components/ui/button/Button";
import { useAddServiceToBill } from "@/hooks/queries/use-bill";
import { useGetServices } from "@/hooks/queries/use-service";
import {
  addBillServiceDetaiFormSchema,
  AddBillServiceDetaiFormType,
} from "@/schemas/validation/admin.validation";
import { CalculationMethod } from "@/types/bill";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

interface AddServiceFormProps {
  billId: string;
}

export default function AddServiceForm({ billId }: AddServiceFormProps) {
  const addServiceForm = useForm<AddBillServiceDetaiFormType>({
    resolver: zodResolver(addBillServiceDetaiFormSchema),
    defaultValues: {
      service_id: "",
      quantity: 0,
      calculation_method: "",
      unit_price: 0,
    },
  });
  const { data: servicesExtra } = useGetServices("extra");
  const createBillServiceDetail = useAddServiceToBill();
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
  const onSubmit = async (data: AddBillServiceDetaiFormType) => {
    try {
      const result = await createBillServiceDetail.mutateAsync({
        bill_id: billId,
        service_id: data.service_id,
        quantity: data.quantity,
        unit_price: data.unit_price,
      });
      if (result.success) {
        addServiceForm.reset();
      }
    } catch (error) {
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
                servicesExtra?.map((item) => ({
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
      {/* <div className="flex items-start gap-2 mt-10">
        <InfoIcon className="text-gray-500 dark:text-gray-400 size-5" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sau khi điền thông tin dịch vụ, nhấp vào &apos;Thêm dịch vụ&apos; để
          thêm nó vào danh sách.
        </p>
      </div> */}
    </div>
  );
}
