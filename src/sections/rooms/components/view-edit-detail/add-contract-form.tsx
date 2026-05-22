"use client";
import { FormField } from "@/components/_cms/components/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/_cms/ui/button";
import {
  contractFormSchema,
  ContractFormType,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useAddContract } from "@/hooks/queries/use-contract";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";

interface AddContractForm {
  roomId: string;
}
export default function AddContractForm({ roomId }: AddContractForm) {
  const addContract = useAddContract();
  const contractForm = useForm<ContractFormType>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      tenant_name: "",
      tenant_phone: "",
      room_id: roomId,
      start_date: new Date().toISOString(),
      end_date: "",
      deposit_amount: 0,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = contractForm;

  const onSubmit = async (data: ContractFormType) => {
    try {
      const result = await addContract.mutateAsync(data);

      if (result.success) {
        showToast.success({
          title: "Thông báo",
          description: result.message,
        });
      } else {
        showToast.error({
          title: "Lỗi",
          description: "Không thể tạo hợp đồng \n Vui lòng thử lại",
        });
      }
    } catch (error) {
      showToast.error({ title: "Lỗi", description: mapErrorToMessage(error) });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-y-6 gap-x-10"
    >
      <FormField
        form={contractForm}
        field={{
          name: "tenant_name",
          type: "text",
          label: "Họ tên người thuê",
          placeholder: "Nhập họ tên người thuê",
        }}
      />
      <FormField
        form={contractForm}
        field={{
          name: "tenant_phone",
          type: "text",
          label: "Số điện thoại",
          placeholder: "Nhập số điện thoại",
        }}
      />
      <FormField
        form={contractForm}
        className="col-span-2"
        field={{
          name: "deposit_amount",
          type: "number",
          label: "Số tiền cọc",
          formatCurrency: true,
        }}
      />
      <FormField
        form={contractForm}
        field={{
          id: "start_date",
          name: "start_date",
          type: "date",
          label: "Ngày bắt đầu",
        }}
      />
      <FormField
        form={contractForm}
        field={{
          id: "end_date",
          name: "end_date",
          type: "date",
          label: "Ngày kết thúc",
        }}
      />

      <Button
        type="submit"
        className="col-span-2 w-fit ml-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang thêm..." : "Thêm hợp đồng"}
      </Button>
    </form>
  );
}
