"use client";
import React, { useCallback, useState } from "react";

import { Eye, FilterIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useFilter } from "@/hooks/use-filter";
import { Bill, BillStatus } from "@/types/bill";
import Badge from "@/components/ui/badge/Badge";
import { Checkbox } from "@/components/_cms/ui/input";
import { useAllBills } from "@/hooks/queries/use-bill";
import { useBuilding } from "@/context/BuildingContext";
import { Pagination } from "@/components/_cms/components/pagination";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { _filterConfigs, _filterValues } from "@/_mocks/_filter/_fiter_box";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import { BillFilterSchema } from "@/schemas/render-filter-schemas/bill-filter.schema";
import TableNotFound from "@/components/_cms/common/table/state/not_found";
import { FilterBoxRender } from "@/components/_cms/components/filter/box";
import Button from "@/components/ui/button/Button";
import { ModalViewBill } from ".";

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
  const [limit] = useState<number>(10);
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const {
    filterValues,
    updateFilter,
    applyFilters,
    removeFilter,
    clearFilters,
  } = useFilter({
    filterConfigs: BillFilterSchema,
  });
  const {
    data: bills,
    isLoading,
    refetch,
  } = useAllBills({
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
      setCurrentPage(1);
      updateFilter("tracking_code", value);
    } else {
      removeFilter("tracking_code");
    }
    applyFilters();
  }, []);

  return (
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
              setCurrentPage(1);
              updateFilter("bill_status", value as BillStatus);
              applyFilters();
            }}
          />

          <SearchBar
            placeholder="Tìm kiếm"
            className="ml-auto w-[12rem]"
            handleOnChange={(textSearch) => handleSearch(textSearch)}
            debounceTime={500}
          />

          <Button
            variant="outline"
            className="py-1"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon className="size-4" /> Bộ lọc
          </Button>

          <Button variant="outline" className="py-1" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>
      {isFilterOpen && (
        <FilterBoxRender
          className="m-4"
          filterConfigs={BillFilterSchema}
          handleFilterChange={updateFilter}
          handleClearAllFilters={clearFilters}
          filterValues={filterValues}
        />
      )}

      <Table>
        <CMSTableHeader
          selectAll={
            selectedBills.length === bills?.data.length &&
            bills?.data.length > 0
          }
          columns={_tableHeader}
          handleSelectAll={(isSelectAll) => {
            if (isSelectAll) {
              setSelectedBills(bills?.data.map((bill) => bill.id) || []);
            } else {
              setSelectedBills([]);
            }
          }}
        />
        <TableBody>
          {(bills?.data.length === 0 || isLoading) && (
            <TableRow className="h-[300px]">
              <TableCell
                className="w-full h-fit text-base"
                colSpan={_tableHeader.length}
              >
                <TableNotFound
                  message={
                    isLoading
                      ? "Đang tải dữ liệu..."
                      : "Hiện tại không tìm thấy hoá đơn nào"
                  }
                />
              </TableCell>
            </TableRow>
          )}
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
              <TableCell className="text-center">
                {new Date(bill.month_date).getMonth() + 1}
              </TableCell>
              <TableCell>{formatCurrency(bill.grand_total)}</TableCell>
              <TableCell className="w-[10rem]">
                <Badge
                  variant="light"
                  color={
                    bill?.bill_status === ("paid" as keyof typeof BillStatus)
                      ? "success"
                      : bill?.bill_status ===
                          ("draft" as keyof typeof BillStatus)
                        ? "light"
                        : bill?.bill_status ===
                            ("overdue" as keyof typeof BillStatus)
                          ? "error"
                          : bill?.bill_status ===
                              ("unpaid" as keyof typeof BillStatus)
                            ? "dark"
                            : bill?.bill_status ===
                                ("confirmed" as keyof typeof BillStatus)
                              ? "warning"
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
                >
                  <Eye />
                </button>
              </TableCell>
            </TableRow>
          ))}

          {selectedBills.length > 0 && (
            <TableRow>
              <TableCell colSpan={_tableHeader.length + 1}>
                <div className="flex items-center justify-between">
                  <p>Đã chọn {selectedBills.length}</p>
                  <div>
                    <button className="border rounded-xl py-2 px-4 bg-red-400 text-white">
                      Xoá {selectedBills.length} hoá đơn
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {currentBill && isOpen && (
        <ModalViewBill currentBill={currentBill} closeModal={closeModal} />
      )}

      {bills && bills?.data.length > 0 && (
        <Pagination
          type="default"
          pagination={{
            page: currentPage,
            limit: limit,
            total: bills.pagination.total,
          }}
          handlePageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
}
