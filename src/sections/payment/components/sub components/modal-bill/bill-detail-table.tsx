"use client";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/icons";
import {
  Bill,
  BillServiceDetail,
  CalculationMethod,
  RoomServiceExtra,
} from "@/types/bill";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  useAddServiceToBill,
  useBillServicesDetail,
} from "@/hooks/queries/use-bill";
import { formatCurrency } from "@/utils/format-data";
import { FormField } from "@/components/_cms/components/form";
import { useForm, useWatch } from "react-hook-form";
import {
  addBillServiceDetaiFormSchema,
  AddBillServiceDetaiFormType,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";
import { InfoIcon, Loader2, Trash } from "lucide-react";
import {
  useGetServices,
  useGetRoomServiceExtra,
} from "@/hooks/queries/use-service";

interface Product {
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: string;
}

interface FormData {
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

const _tableHeader: { key: keyof BillServiceDetail | string; title: string }[] =
  [
    {
      key: "id",
      title: "S. No.",
    },
    { key: "service_name", title: "Tên dịch vụ" },
    { key: "calculation_method", title: "Đơn vị tính" },
    { key: "quanlity", title: "Số lượng" },
    { key: "unit_price", title: "Đơn giá" },
    { key: "total", title: "Tổng" },
  ];

export default function BillDetailTable({
  bill,
  baseRent,
  isPreview = true,
}: {
  bill: Bill;
  baseRent: number;
  isPreview?: boolean;
}) {
  const { data: billServicesDetail, isLoading: isLoadingBillServicesDetail } =
    useBillServicesDetail(bill.id);
  const { data: roomServiceExtra } = useGetRoomServiceExtra(bill.room_id);
  const { data: servicesExtra } = useGetServices("extra");
  const createBillServiceDetail = useAddServiceToBill();
  const addServiceForm = useForm<AddBillServiceDetaiFormType>({
    resolver: zodResolver(addBillServiceDetaiFormSchema),
    defaultValues: {
      service_id: "",
      quantity: 0,
      calculation_method: "",
      unit_price: 0,
    },
  });
  const [billServices, setBillServices] = useState<
    BillServiceDetail[] | undefined
  >(undefined);
  const [roomServiceExtras, setRoomServiceExtras] = useState<
    RoomServiceExtra[] | undefined
  >(undefined);
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
          service.unit ||
            CalculationMethod[
              service.calculation_method as unknown as keyof typeof CalculationMethod
            ],
        );
      }
    }
  }, [service_id]);

  const {
    handleSubmit,
    formState: { isLoading, isSubmitted },
  } = addServiceForm;

  const handleDelete = (index: number): void => {
    setRoomServiceExtras((prev) => prev?.filter((_, i) => i !== index));
  };

  const onSubmit = (data: AddBillServiceDetaiFormType): void => {
    try {
      const result = createBillServiceDetail.mutateAsync({
        bill_id: bill.id,
        service_id: data.service_id,
        quantity: data.quantity,
        unit_price: data.unit_price,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(billServicesDetail);
    setBillServices(billServicesDetail);
  }, [billServicesDetail]);

  useEffect(() => {
    setRoomServiceExtras(roomServiceExtra);
  }, [roomServiceExtra]);

  const total: number = billServices
    ? billServices.reduce(
        (sum, service) => sum + Number(service.total_amount),
        baseRent,
      )
    : baseRent;

  return (
    <div className="space-y-6">
      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="custom-scrollbar overflow-x-auto">
          {billServices && billServices.length === 0 ? (
            <div className="px-5 py-4 text-center text-gray-400">
              Không có dịch vụ nào được thêm
            </div>
          ) : (
            <table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
              <CMSTableHeader columns={_tableHeader} />
              <TableBody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/3">
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Tiền phòng</TableCell>
                  <TableCell>{CalculationMethod.per_room}</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{formatCurrency(baseRent)}</TableCell>
                  <TableCell>{formatCurrency(baseRent)}</TableCell>
                </TableRow>
                {isLoadingBillServicesDetail ? (
                  <TableRow>
                    <TableCell className="w-full">
                      <Loader2 className="animate-spin" /> Đang tải...
                    </TableCell>
                  </TableRow>
                ) : (
                  billServices?.map((service, idx) => (
                    <TableRow key={service.id}>
                      <TableCell>{idx + 2}</TableCell>
                      <TableCell>{service.services.service_name}</TableCell>
                      <TableCell>
                        {service.services.unit ||
                          CalculationMethod[
                            service.services
                              .calculation_method as unknown as keyof typeof CalculationMethod
                          ]}
                      </TableCell>
                      <TableCell>{service.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(service.unit_price)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(service.total_amount)}
                      </TableCell>

                      {!isPreview &&
                        service.services.service_type === "extra" && (
                          <TableCell className="max-w-[20px] !pl-2">
                            <button onClick={() => handleDelete(idx)}>
                              <Trash className="size-4 text-red-400" />
                            </button>
                          </TableCell>
                        )}
                    </TableRow>
                  ))
                )}

                {roomServiceExtras?.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {idx + (billServices?.length || 0) + 2}
                    </TableCell>
                    <TableCell>{item.services.service_name}</TableCell>
                    <TableCell>
                      {item.services.unit ||
                        CalculationMethod[
                          item.services
                            .calculation_method as unknown as keyof typeof CalculationMethod
                        ]}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell>
                      {formatCurrency(item.unit_price * item.quantity)}
                    </TableCell>
                    {/* 
                    {!isPreview && (
                      <TableCell className="max-w-[20px] !pl-2">
                        <button onClick={() => handleDelete(idx)}>
                          <Trash className="size-4 text-red-400" />
                        </button>
                      </TableCell>
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </table>
          )}
        </div>
      </div>
      {/* Add Service Form */}
      {!isPreview && (
        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 items-end sm:grid-cols-3 lg:grid-cols-13">
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
                disabled={
                  isLoading || isLoadingBillServicesDetail || !service_id
                }
                type="submit"
                className="h-fit lg:col-span-2"
              >
                {isLoading || isLoadingBillServicesDetail ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Thêm dịch vụ"
                )}
              </Button>
            </div>
          </form>
          <div className="flex items-start gap-2 mt-10">
            <InfoIcon className="text-gray-500 dark:text-gray-400 size-5" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sau khi điền thông tin dịch vụ, nhấp vào &apos;Thêm dịch vụ&apos;
              để thêm nó vào danh sách.
            </p>
          </div>
        </div>
      )}
      {/* Total Summary */}
      <div className="flex flex-wrap justify-between sm:justify-end">
        <div className=" w-full space-y-1 text-right sm:w-[220px]">
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-400">
                Thành tiền
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {formatCurrency(total)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
