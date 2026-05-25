"use client";
import React, { useCallback, useState } from "react";

import { Eye, FilterIcon, RefreshCcwIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useFilter } from "@/hooks/use-filter";
import { Bill, BillStatus } from "@/types/bill";
import { Checkbox } from "@/components/_cms/ui/input";
import { useAllBills, useUpdateStatusBill } from "@/hooks/queries/use-bill";
import { useBuilding } from "@/context/BuildingContext";
import { Pagination } from "@/components/_cms/components/pagination";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import { CMSTableHeader } from "@/components/_cms/components/table";
import { _filterConfigs, _filterValues } from "@/_mocks/_filter/_fiter_box";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import { BillFilterSchema } from "@/schemas/render-filter-schemas/bill-filter.schema";
import { DataEmpty } from "@/components/_cms/common/table/state";
import { FilterBoxRender } from "@/components/_cms/components/filter/box";
import { ModalViewBill } from ".";
import { TableHeaderColumn } from "@/components/_cms/components/table/table-header";
import { showToast } from "@/lib/toast";
import ModalAlert from "@/components/_cms/components/modal/alerts/modal-alert";
import { mapErrorToMessage } from "@/lib/error/app-error";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import { Badge } from "@/components/_cms/ui/badge";
import { Button } from "@/components/_cms/ui/button";

const columns: TableHeaderColumn[] = [
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
    isHiddenOnMobile: true,
  },
  {
    key: "created_by",
    title: "Người tạo",
    isHiddenOnMobile: true,
  },
  { key: "actions", title: "", isHiddenOnMobile: true },
];

export default function PaymentsListTable() {
  const { building } = useBuilding();
  const [limit] = useState<number>(10);
  const modalViewBill = useModal();
  const modalConfirmAction = useModal();
  const modalDeleteBill = useModal();
  const updateStatusBill = useUpdateStatusBill();
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
    data: billsData,
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
  const [selectedBills, setSelectedBills] = useState<Map<string, Bill>>(
    new Map(),
  );

  const { data: bills } = billsData || {};

  const handleChangeStatusPayment = useCallback(
    async (status: keyof typeof BillStatus) => {
      if (selectedBills.size > 0) {
        try {
          const result = await updateStatusBill.mutateAsync({
            tracking_code: Array.from(selectedBills.keys()),
            status,
          });
          if (result.success) {
            showToast.success({
              title: `Đã xác nhận thanh toán thành công ${selectedBills.size} hoá đơn`,
            });
            setSelectedBills(new Map());
          } else {
            showToast.error({
              title: result.message ?? "Lỗi hệ thống",
            });
          }
        } catch (error) {
          showToast.error({
            title: mapErrorToMessage(error),
          });
        } finally {
          modalConfirmAction.closeModal();
        }
      }
    },
    [selectedBills],
  );

  const handleSearch = useCallback((value: string) => {
    if (value.trim()) {
      setCurrentPage(1);
      updateFilter("room_code", value);
    } else {
      removeFilter("room_code");
    }
    applyFilters();
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="hidden md:block xl:shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Hoá đơn
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Danh sách hoá đơn
          </p>
        </div>

        <div className="w-full flex items-center justify-end gap-3.5 relative">
          <SingleFilterButtonGroup
            items={Object.entries(BillStatus).map(([value, label]) => ({
              label,
              value,
            }))}
            onChange={(value) => {
              setCurrentPage(1);
              updateFilter("bill_status", value !== null ? [value] : null);
              applyFilters();
            }}
            className="hidden lg:inline-flex"
          />

          <SearchBar
            placeholder="Tìm kiếm"
            className="grow md:grow-[unset] md:max-w-[20rem]"
            handleOnChange={(textSearch) => handleSearch(textSearch)}
            debounceTime={500}
          />

          <Button
            variant="outline"
            className="text-sm"
            disabled={isLoading || !bills}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon className="size-4" /> Bộ lọc
          </Button>

          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcwIcon className="size-4" />
          </Button>
        </div>
      </div>
      {selectedBills.size > 0 && (
        <div className="rows-actions">
          <Button
            size="sm"
            variant="neutral"
            onClick={() => modalDeleteBill.openModal()}
          >
            Xoá {selectedBills.size} hoá đơn
          </Button>

          {Array.from(selectedBills.values()).every(
            (bill) =>
              bill.bill_status === "draft" || bill.bill_status === "confirmed",
          ) && (
            <Button
              variant="neutral"
              size="sm"
              onClick={() => modalConfirmAction.openModal()}
            >
              Xác nhận thanh toán {selectedBills.size} hoá đơn
            </Button>
          )}
        </div>
      )}

      {/* <FilterValuesRender
        filterConfigs={BillFilterSchema}
        filterValues={filterValues}
        onDeleteItem={removeFilter}
      /> */}

      {isFilterOpen && (
        <FilterBoxRender
          className="m-4"
          filterConfigs={BillFilterSchema}
          handleFilterChange={updateFilter}
          handleClearAllFilters={clearFilters}
          filterValues={filterValues}
        />
      )}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <CMSTableHeader
            selectAll={
              selectedBills.size === bills?.length && bills?.length > 0
            }
            columns={columns}
            handleSelectAll={(isSelectAll) => {
              if (isSelectAll) {
                setSelectedBills(
                  new Map(
                    bills?.map((bill) => [
                      String(bill.tracking_code).trim(),
                      bill,
                    ]),
                  ),
                );
              } else {
                setSelectedBills(new Map());
              }
            }}
          />
          <TableBody>
            {(bills?.length === 0 || isLoading) && (
              <DataEmpty
                colSpan={columns.length}
                message={
                  isLoading
                    ? "Đang tải dữ liệu..."
                    : "Hiện tại không tìm thấy hoá đơn nào"
                }
              />
            )}

            {bills?.map((bill) => (
              <TableRow
                key={bill.id}
                onDoubleClick={() => {
                  setCurrentBill(bill);
                  modalViewBill.openModal();
                }}
              >
                <TableCell>
                  <Checkbox
                    id={String(bill.tracking_code).trim()}
                    checked={selectedBills.has(
                      String(bill.tracking_code).trim(),
                    )}
                    onChange={() => {
                      setSelectedBills((prev) => {
                        const newSelectedBills = new Map(prev);
                        if (
                          newSelectedBills.has(
                            String(bill.tracking_code).trim(),
                          )
                        ) {
                          newSelectedBills.delete(
                            String(bill.tracking_code).trim(),
                          );
                        } else {
                          newSelectedBills.set(
                            String(bill.tracking_code).trim(),
                            bill,
                          );
                        }
                        return newSelectedBills;
                      });
                    }}
                    label={bill.tracking_code}
                  />
                </TableCell>
                <TableCell>{bill.rooms.code}</TableCell>
                <TableCell className="text-center">
                  {new Date(bill.month_date).getMonth() + 1}
                </TableCell>
                <TableCell>{formatCurrency(bill.grand_total)}</TableCell>
                <TableCell className="min-w-[10rem]">
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
                <TableCell className="min-w-[7.5rem]">
                  {formatDateTime(bill.updated_at, { withTime: true })}
                </TableCell>
                <TableCell className="hidden md:table-cell min-w-[7.5rem]">
                  {formatDateTime(bill.created_at, { withTime: true })}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {bill.profiles.full_name.split(" ")[0]}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <button
                    onClick={() => {
                      setCurrentBill(bill);
                      modalViewBill.openModal();
                    }}
                  >
                    <Eye />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {modalConfirmAction.isOpen && (
        <ModalAlert
          isOpen={modalConfirmAction.isOpen}
          onClose={modalConfirmAction.closeModal}
          onCancel={modalConfirmAction.closeModal}
          onConfirm={async () => {
            await handleChangeStatusPayment("paid");
            modalConfirmAction.closeModal();
          }}
          description={`Bạn có chắc chắn muốn xác nhận thanh toán ${selectedBills.size} hoá đơn?`}
          title="Xác nhận thanh toán"
          cancelText="Huỷ"
          confirmText="Xác nhận"
          type="warning"
        />
      )}

      {modalDeleteBill.isOpen && (
        <ModalAlert
          isOpen={modalDeleteBill.isOpen}
          onClose={modalDeleteBill.closeModal}
          onCancel={modalDeleteBill.closeModal}
          onConfirm={async () => {
            await handleChangeStatusPayment("deleted");
            modalDeleteBill.closeModal();
          }}
          description={`Bạn có chắc chắn muốn xoá ${selectedBills.size} hoá đơn?`}
          title="Xoá hoá đơn"
          cancelText="Huỷ"
          confirmText="Xoá"
          type="danger"
        />
      )}

      {currentBill && modalViewBill.isOpen && (
        <ModalViewBill
          currentBill={currentBill}
          closeModal={modalViewBill.closeModal}
        />
      )}

      {bills && bills?.length > 0 && (
        <Pagination
          type="default"
          pagination={{
            page: currentPage,
            limit: limit,
            total: billsData?.pagination?.total,
          }}
          handlePageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
}
