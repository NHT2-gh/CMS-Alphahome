"use client";
import React, { useCallback, useState } from "react";

import { Bill, BillStatus } from "@/types/bill";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { Eye } from "lucide-react";
import { useAllBills } from "@/hooks/queries/use-bill";
import { useBuilding } from "@/context/BuildingContext";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import Badge from "@/components/ui/badge/Badge";
import ModalViewBill from "./modal-view-bill";
import { Checkbox } from "@/components/_cms/ui/input";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import { Pagination } from "@/components/_cms/common/table";
import { _filterConfigs, _filterValues } from "@/_mocks/_filter/_fiter_box";
import { useFilter } from "@/hooks/use-filter";
import { BillFilterSchema } from "@/schemas/render-filter-schemas/bill-filter.schema";
import { useModal } from "@/hooks/useModal";

const _tableHeader: { key: keyof Bill | string; title: string }[] = [
  {
    key: "tracking_code",
    title: "Mã hoá đơn",
  },
  {
    key: "room_id",
    title: "Phòng",
  },
  {
    key: "month_date",
    title: "Kì thanh toán",
  },
  {
    key: "grand_total",
    title: "Tổng tiền",
  },
  {
    key: "bill_status",
    title: "Trạng thái",
  },

  {
    key: "updated_at",
    title: "Cập nhật",
  },
  {
    key: "created_at",
    title: "Thời gian tạo",
  },
  {
    key: "created_by",
    title: "Người tạo",
  },
];

export default function PaymentsListTable() {
  const { building } = useBuilding();
  const { isOpen, openModal, closeModal } = useModal();
  const [limit, setLimit] = useState<number>(5);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const {
    filterValues,
    updateFilter,
    clearFilters,
    applyFilters,
    removeFilter,
  } = useFilter({
    filterConfigs: BillFilterSchema,
  });
  const { data: bills } = useAllBills({
    buildingId: building ? building.id : "",
    pagination: {
      page: currentPage,
      limit: limit,
    },
    filters: filterValues,
  });
  const [selectedBills, setSelectedBills] = useState<string[]>([]);

  const handleSearch = useCallback((value: string) => {
    if (value.trim()) {
      updateFilter("tracking_code", value);
    } else {
      removeFilter("tracking_code");
    }
    applyFilters();
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Hoá đơn
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Danh sách hoá đơn
            </p>
          </div>

          <div className="flex gap-3.5 relative">
            <SingleFilterButtonGroup
              items={Object.entries(BillStatus).map(([value, label]) => ({
                label,
                value,
              }))}
              onChange={(value) => {
                updateFilter("bill_status", value as BillStatus);
                applyFilters();
              }}
            />
            <div className="flex-col gap-3 sm:flex sm:flex-row sm:items-center">
              <SearchBar
                placeholder="Tìm kiếm"
                className="ml-auto"
                handleOnChange={(textSearch) => handleSearch(textSearch)}
                debounceTime={500}
              />

              {/* <button className="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <Upload className="size-4" />
                Export
              </button> */}

              {/* {isOpenFilter && (
                <FilterBoxRender
                  className="p-2 absolute top-12 left-2"
                  filterConfigs={BillFilterSchema}
                  filterValues={filterValues}
                  handleFilterChange={updateFilter}
                  handleClearAllFilters={clearFilters}
                />
              )} */}
            </div>
          </div>
        </div>

        <Table>
          <CMSTableHeader
            selectAll={selectedBills.length === bills?.data.length}
            tableHeader={_tableHeader}
            handleSelectAll={(isSelectAll) => {
              if (isSelectAll) {
                setSelectedBills(bills?.data.map((bill) => bill.id) || []);
              } else {
                setSelectedBills([]);
              }
            }}
          />
          <TableBody>
            {bills?.data.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>
                  <Checkbox
                    id={bill.id}
                    checked={selectedBills.includes(bill.id)}
                    onChange={() => {
                      setSelectedBills((prev) =>
                        prev.includes(bill.id)
                          ? prev.filter((id) => id !== bill.id)
                          : [...prev, bill.id],
                      );
                    }}
                    label={bill.tracking_code}
                  />
                </TableCell>
                <TableCell>{bill.rooms.code}</TableCell>
                <TableCell>
                  {new Date(bill.month_date).getMonth() + 1}
                </TableCell>
                <TableCell>{formatCurrency(bill.grand_total)}</TableCell>
                <TableCell className="capitalize">
                  <Badge
                    variant="light"
                    color={
                      bill?.bill_status === ("paid" as BillStatus)
                        ? "success"
                        : bill?.bill_status === ("draft" as BillStatus)
                          ? "warning"
                          : bill?.bill_status === ("overdue" as BillStatus)
                            ? "error"
                            : "info"
                    }
                  >
                    {
                      BillStatus[
                        bill.bill_status as unknown as keyof typeof BillStatus
                      ]
                    }
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDateTime(bill.updated_at, { withTime: true })}
                </TableCell>
                <TableCell>
                  {formatDateTime(bill.created_at, { withTime: true })}
                </TableCell>
                <TableCell>{bill.profiles.full_name}</TableCell>
                <TableCell>
                  <button
                    onClick={() => {
                      setCurrentBill(bill);
                      openModal();
                    }}
                    className=""
                  >
                    <Eye />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {currentBill && isOpen && (
          <ModalViewBill currentBill={currentBill} closeModal={closeModal} />
        )}

        {bills && (
          <Pagination
            type="default"
            pagination={{ page: currentPage, limit: limit, total: bills.count }}
            handlePageChange={(page) => {
              setCurrentPage(page);
            }}
          />
        )}
      </div>
    </>
  );
}
