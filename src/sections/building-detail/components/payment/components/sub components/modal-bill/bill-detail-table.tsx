"use client";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/icons";
import { BillServiceDetail, CalculationMethod } from "@/types/bill";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { useBillServicesDetail } from "@/hooks/queries/use-bill";
import { formatPrice } from "@/utils/format-data";
import { FormField } from "@/components/_cms/components/form";
import { useForm } from "react-hook-form";
import {
  addBillServiceDetaiFormSchema,
  AddBillServiceDetaiFormType,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";

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

export default function BillDetailTable({ billId }: { billId: string }) {
  const { data: servicesDetail } = useBillServicesDetail(billId);
  const [services, setSevices] = useState<BillServiceDetail[] | undefined>(
    undefined,
  );

  console.log(services);

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
      unit_price: "",
    },
  });

  const handleDelete = (index: number): void => {
    setSevices((prev) => prev?.filter((_, i) => i !== index));
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

  const handleSubmit = (e: React.FormEvent): void => {
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
    setSevices(servicesDetail);
  }, [servicesDetail]);

  const total: number = services
    ? services.reduce((sum, service) => sum + Number(service.total_amount), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
        <div className="custom-scrollbar overflow-x-auto">
          {services && services.length === 0 ? (
            <div className="px-5 py-4 text-center text-gray-400">
              Không có dịch vụ nào được thêm
            </div>
          ) : (
            <table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
              <CMSTableHeader tableHeader={_tableHeader} />
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/3">
                {services?.map((service, idx) => (
                  <TableRow>
                    <TableCell>{idx + 1}</TableCell>
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
                    <TableCell>{formatPrice(service.unit_price)}</TableCell>
                    <TableCell>{formatPrice(service.total_amount)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Product Form */}
      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 items-end sm:grid-cols-3 lg:grid-cols-12">
            <FormField
              className="w-full lg:col-span-3"
              form={addServiceForm}
              field={{
                name: "service_id",
                type: "text",
                label: "Chọn dịch vụ",
              }}
            />

            <FormField
              className="w-full lg:col-span-2"
              form={addServiceForm}
              field={{
                name: "unit_price",
                type: "text",
                placeholder: "Chọn đơn vị tính",
                label: "Đơn vị tính",
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
                type: "text",
                defaultValue: 0,
                label: "Tổng tiền",
                className: "w-full lg:col-span-2",
                readOnly: true,
              }}
            />

            <Button type="submit" className="h-fit">
              Thêm
            </Button>
          </div>
        </form>
        <div className="mt-5 flex max-w-2xl items-center gap-2">
          <svg
            className="text-gray-500 dark:text-gray-400"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 7.22485H10.0007"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.0004 9.34575V12.8661M17.7087 10.0001C17.7087 14.2573 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2573 2.29199 10.0001C2.29199 5.74289 5.74313 2.29175 10.0003 2.29175C14.2575 2.29175 17.7087 5.74289 17.7087 10.0001Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            After filling in the product details, press Enter/Return or click
            &apos;Save Product&apos; to add it to the list.
          </p>
        </div>
      </div>

      {/* Total Summary */}
      <div className="flex flex-wrap justify-between sm:justify-end">
        <div className=" w-full space-y-1 text-right sm:w-[220px]">
          <ul className="space-y-2">
            <li className="flex items-center justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-400">
                Thành tiền
              </span>
              <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {formatPrice(total)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
