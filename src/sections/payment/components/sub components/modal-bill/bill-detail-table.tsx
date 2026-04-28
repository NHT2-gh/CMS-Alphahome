"use client";
import { useEffect, useState } from "react";
import {
  Bill,
  BillServiceDetail,
  CalculationMethod,
  RoomServiceExtra,
} from "@/types/bill";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useBillServicesDetail } from "@/hooks/queries/use-bill";
import { formatCurrency } from "@/utils/format-data";
import { Loader2, Trash } from "lucide-react";
import { useGetRoomServiceExtra } from "@/hooks/queries/use-service";
import AddServiceForm from "./add-service-form";
import { TableHeaderColumn } from "@/components/_cms/components/data-table/table-header";

const _tableHeader: TableHeaderColumn[] = [
  {
    key: "id",
    title: "S. No.",
    isHiddenOnMobile: true,
  },
  { key: "service_name", title: "Tên dịch vụ" },
  { key: "calculation_method", title: "Đơn vị tính", isHiddenOnMobile: true },
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
  const [billServices, setBillServices] = useState<
    BillServiceDetail[] | undefined
  >(undefined);
  const [openAddServiceForm, setOpenServiceForm] = useState<boolean>(false);

  const handleDeleteServiceExtra = (id: string): void => {
    console.log("id", id);
  };

  useEffect(() => {
    setBillServices([
      {
        id: "0",
        unit_price: baseRent,
        service_id: "0",
        quantity: 1,
        total_amount: baseRent,
        services: {
          id: "0",
          calculation_method: "per_room",
          service_name: "Tiền phòng",
          service_type: "fixed",
        },
      } as BillServiceDetail,
      ...(billServicesDetail || []),
      ...(roomServiceExtra || []),
    ]);
  }, [billServicesDetail, roomServiceExtra]);

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
            <Table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
              <CMSTableHeader columns={_tableHeader} />
              <TableBody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/3">
                {/* <TableRow>
                  <TableCell className="hidden md:table-cell w-[50px] text-center">
                    1
                  </TableCell>
                  <TableCell className="min-w-[6rem]">Tiền phòng</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {CalculationMethod.per_room}
                  </TableCell>
                  <TableCell className="max-w-[3.125rem]">1</TableCell>
                  <TableCell>{formatCurrency(baseRent)}</TableCell>
                  <TableCell>{formatCurrency(baseRent)}</TableCell>
                </TableRow> */}
                {isLoadingBillServicesDetail ? (
                  <TableRow>
                    <TableCell className="w-full">
                      <Loader2 className="animate-spin" /> Đang tải...
                    </TableCell>
                  </TableRow>
                ) : (
                  billServices?.map((service, idx) => (
                    <TableRow key={service.id} className="">
                      <TableCell className="hidden md:table-cell w-[50px] text-center">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="min-w-[6rem]">
                        {service.services.service_name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {service.services.unit_name ||
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
                        {formatCurrency(
                          service.total_amount ??
                            service.unit_price * service.quantity,
                        )}
                      </TableCell>

                      {!isPreview &&
                        service.services.service_type === "extra" && (
                          <TableCell className="!w-[50px] !pl-2">
                            <button
                              onClick={() =>
                                handleDeleteServiceExtra(service.service_id)
                              }
                            >
                              <Trash className="size-4 text-red-400" />
                            </button>
                          </TableCell>
                        )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {/* Add Service Form */}
      {!isPreview && (
        <>
          <button
            onClick={() => {
              setOpenServiceForm(!openAddServiceForm);
            }}
            className="italic text-brand-500 text-sm"
          >
            {openAddServiceForm ? "Ẩn thêm dịch vụ" : "Thêm dịch vụ"}
          </button>

          {openAddServiceForm && <AddServiceForm billId={bill.id} />}
        </>
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
