"use client";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/icons";
import { BillServiceDetail, CalculationMethod } from "@/types/bill";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBillServicesDetail } from "@/hooks/queries/use-bill";
import { formatCurrency } from "@/utils/format-data";
import { FormField } from "@/components/_cms/components/form";
import { useForm, useWatch } from "react-hook-form";
import {
  addBillServiceDetaiFormSchema,
  AddBillServiceDetaiFormType,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";
import { InfoIcon } from "lucide-react";
import { useBuildingServices } from "@/hooks/queries/use-building";

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
  billId,
  baseRent,
  buildingId,
  isPreview = true,
}: {
  billId: string;
  baseRent: number;
  buildingId?: string;
  isPreview?: boolean;
}) {
  const { data: billServicesDetail } = useBillServicesDetail(billId);
  const [billServices, setBillServices] = useState<
    BillServiceDetail[] | undefined
  >(undefined);
  const { data: buildingServices } = useBuildingServices(buildingId);

  const [form, setForm] = useState<FormData>({
    name: "",
    price: 0,
    quantity: 1,
    discount: 0,
  });

  const addServiceForm = useForm<AddBillServiceDetaiFormType>({
    resolver: zodResolver(addBillServiceDetaiFormSchema),
    defaultValues: {
      service_id: "",
      quantity: 0,
      calculation_method: "",
      unit_price: "",
    },
  });
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
      const service = buildingServices?.find(
        (item) => String(item.services.id) === String(service_id),
      );

      if (service) {
        addServiceForm.setValue(
          "calculation_method",
          service.services.calculation_method,
        );
        addServiceForm.setValue("unit_price", String(service.unit_price));
      }
    }
  }, [service_id]);

  const {
    handleSubmit,
    formState: { isLoading, isSubmitted },
  } = addServiceForm;

  const handleDelete = (index: number): void => {
    setBillServices((prev) => prev?.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "discount"
          ? Number(value)
          : value,
    }));
  };

  const handleQuantityChange = (delta: number): void => {
    setForm((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + delta),
    }));
  };

  const onSubmit = (data: AddBillServiceDetaiFormType): void => {
    console.log(data);
    // e.preventDefault();
    // if (form.name && form.price > 0) {
    //   const total = (
    //     form.price *
    //     form.quantity *
    //     (1 - form.discount / 100)
    //   ).toFixed(2);
    //   setSevices((prev) => [...prev, { ...form, total }]);
    //   setForm({
    //     name: "",
    //     price: 0,
    //     quantity: 1,
    //     discount: 0,
    //   });
    // }
  };

  useEffect(() => {
    setBillServices(billServicesDetail);
  }, [billServicesDetail]);

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
              <CMSTableHeader tableHeader={_tableHeader} />
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/3">
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Tiền phòng</TableCell>
                  <TableCell>{CalculationMethod.fixed}</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{formatCurrency(baseRent)}</TableCell>
                  <TableCell>{formatCurrency(baseRent)}</TableCell>
                </TableRow>
                {billServices?.map((service, idx) => (
                  <TableRow key={service.id}>
                    <TableCell>{idx + 2}</TableCell>
                    <TableCell>{service.services.service_name}</TableCell>
                    <TableCell>
                      {
                        CalculationMethod[
                          service.services
                            .calculation_method as unknown as keyof typeof CalculationMethod
                        ]
                      }
                    </TableCell>
                    <TableCell>{service.quantity}</TableCell>
                    <TableCell>{formatCurrency(service.unit_price)}</TableCell>
                    <TableCell>
                      {formatCurrency(service.total_amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
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
                    buildingServices?.map((item) => ({
                      label: item.services.service_name,
                      value: item.services.id,
                    })) ?? [],
                }}
              />

              <FormField
                className="w-full lg:col-span-2"
                form={addServiceForm}
                field={{
                  name: "calculation_method",
                  type: "select",
                  placeholder: "Chọn đơn vị tính",
                  label: "Đơn vị tính",
                  options: Object.entries(CalculationMethod).map(
                    ([key, value]) => ({
                      label: value,
                      value: key,
                    }),
                  ),
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
                }}
              />

              <Button type="submit" className="h-fit lg:col-span-2">
                Thêm dịch vụ
              </Button>
            </div>
          </form>
          <div className="flex items-start gap-2 mt-5">
            <InfoIcon className="text-gray-500 dark:text-gray-400 size-5" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sau khi điền thông tin dịch vụ, nhấn Enter/Return hoặc nhấp vào
              &apos;Thêm dịch vụ&apos; để thêm nó vào danh sách.
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
