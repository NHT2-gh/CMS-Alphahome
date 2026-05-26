"use client";
import React, { useCallback, useEffect, useState } from "react";

import { FilterIcon, RefreshCcwIcon, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/format-data";
import { useBuilding } from "@/context/BuildingContext";
import { SearchBar } from "@/components/_cms/components/search-bar";
import {
  useAllTransactions,
  useDeleteTransaction,
} from "@/hooks/queries/use-transaction";
import { PaymentMethod, TransactionType } from "@/types/transcription";
import { CMSTableHeader } from "@/components/_cms/components/table";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import ModalAlert from "@/components/_cms/components/modal/alerts/modal-alert";
import { useModal } from "@/hooks/useModal";
import { showToast } from "@/lib/toast";
import { DataEmpty } from "@/components/_cms/common/table/state";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { FilterBoxRender } from "@/components/_cms/components/filter/box";
import { useFilter } from "@/hooks/use-filter";
import { TransactionFilterSchema } from "@/schemas/render-filter-schemas/transtion-filter.schema";
import { Pagination } from "@/components/_cms/components/pagination";
import { Button } from "@/components/_cms/ui/button";
import { Badge } from "@/components/_cms/ui/badge";
import { TableHeaderColumn } from "@/components/_cms/components/table/table-header";

const _tableHeader: TableHeaderColumn[] = [
  { key: "categories.name", title: "Tên hạng mục" },
  { key: "amount", title: "Số tiền" },
  { key: "transaction_date", title: "Ngày giao dịch" },
  { key: "payment_method", title: "Phương thức thanh toán" },
  { key: "type", title: "Loại" },
  { key: "description", title: "Mô tả" },
  { key: "profiles.full_name", title: "Người thực hiện" },
  { key: "actions", title: "" },
];

export default function RevenueExpenditureTable() {
  const { building } = useBuilding();
  const [limit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    filterValues,
    updateFilter,
    applyFilters,
    removeFilter,
    clearFilters,
  } = useFilter({
    filterConfigs: TransactionFilterSchema,
  });
  const {
    data: transcriptions,
    isLoading,
    refetch,
  } = useAllTransactions({
    buildingId: building ? building.id : "",
    pagination: {
      page: currentPage,
      limit: limit,
    },
    filters: filterValues,
  });
  const deleteTransaction = useDeleteTransaction();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    [],
  );

  const { isOpen, openModal, closeModal } = useModal();

  const handleDeleteTransaction = useCallback(async (ids: string[]) => {
    try {
      const result = await deleteTransaction.mutateAsync({
        id: ids,
        buildingId: building?.id as string,
      });
      if (result.success) {
        closeModal();
        setSelectedTransactions([]);
        showToast.success({ title: "Xoá thành công" });
      }
    } catch (error) {
      closeModal();
      showToast.success({
        title: "Xoá thất bại",
        description: mapErrorToMessage(error),
      });
    }
  }, []);
  const handleSearch = useCallback((value: string) => {
    if (value.trim()) {
      setCurrentPage(1);
      updateFilter("text_search", value);
    } else {
      removeFilter("text_search");
    }
    applyFilters();
  }, []);

  useEffect(() => {
    if (transcriptions?.data) {
      setSelectedTransactions([]);
    }
  }, [transcriptions]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center justify-between border-b border-gray-200 p-3 md:p-5 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách thu chi
          </h3>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-3.5 md:items-center">
          <SingleFilterButtonGroup
            items={Object.entries(TransactionType).map(([value, label]) => ({
              label,
              value,
            }))}
            onChange={(value) => {
              updateFilter("type", value as TransactionType);
            }}
          />

          <SearchBar
            placeholder="Tìm kiếm"
            className="grow-0"
            handleOnChange={handleSearch}
            debounceTime={500}
          />

          <div className="w-full flex items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={isLoading || !transcriptions}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FilterIcon className="size-4" /> Bộ lọc
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearFilters();
                refetch();
              }}
            >
              <RefreshCcwIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <FilterBoxRender
          className="m-4"
          filterConfigs={TransactionFilterSchema}
          handleFilterChange={updateFilter}
          handleClearAllFilters={clearFilters}
          filterValues={filterValues}
        />
      )}

      {/* <FilterValuesRender
        filterValues={filterValues}
        filterConfigs={TransactionFilterSchema}
        onDeleteItem={removeFilter}
      /> */}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <CMSTableHeader
            // selectAll={
            //   selectedTransactions.length === transcriptions?.data.length &&
            //   transcriptions?.data.length > 0
            // }
            columns={_tableHeader}
            // handleSelectAll={(isSelectAll) => {
            //   if (isSelectAll) {
            //     setSelectedTransactions(
            //       transcriptions?.data.map((item) => item.id) || [],
            //     );
            //   } else {
            //     setSelectedTransactions([]);
            //   }
            // }}
          />
          <TableBody>
            {(transcriptions && transcriptions?.data.length === 0) ||
              (isLoading && (
                <DataEmpty
                  colSpan={_tableHeader.length}
                  message={
                    isLoading
                      ? "Đang tải dữ liệu..."
                      : "Hiện tại không tìm thấy dữ liệu phù hợp"
                  }
                />
              ))}

            {selectedTransactions.length > 0 && (
              <TableRow>
                <TableCell colSpan={_tableHeader.length + 2}>
                  <div className="flex items-center justify-between">
                    <p>Đã chọn {selectedTransactions.length}</p>
                    <div>
                      <button
                        onClick={() => {
                          openModal();
                        }}
                        className="border rounded-xl py-2 px-4 bg-red-400 text-white"
                      >
                        Xoá {selectedTransactions.length} hoá đơn
                      </button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {transcriptions?.data?.map((item) => (
              <TableRow key={item.id} className="[&>td]:min-w-[6.25rem]">
                <TableCell>{item.categories.name}</TableCell>
                <TableCell>{formatCurrency(item.amount)}</TableCell>
                <TableCell>{item.transaction_date}</TableCell>
                <TableCell>
                  {
                    PaymentMethod[
                      item.payment_method as unknown as keyof typeof PaymentMethod
                    ]
                  }
                </TableCell>

                <TableCell>
                  <Badge
                    variant="solid"
                    className="min-w-[80px] !text-sm "
                    color={
                      item.type === ("income" as TransactionType)
                        ? "success"
                        : "error"
                    }
                  >
                    {
                      TransactionType[
                        item.type as unknown as keyof typeof TransactionType
                      ]
                    }
                  </Badge>
                </TableCell>
                <TableCell>{item.description || "----"}</TableCell>

                <TableCell className="text-nowrap">
                  {item.profiles.full_name}
                </TableCell>

                <TableCell className="!min-w-fit">
                  <Trash
                    className="size-4 cursor-pointer text-red-500"
                    onClick={() => {
                      setSelectedTransactions([item.id]);
                      openModal();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {transcriptions && transcriptions?.data.length > limit && (
        <Pagination
          type="default"
          pagination={{
            page: currentPage,
            limit: limit,
            total: transcriptions.pagination?.total,
          }}
          handlePageChange={(page) => {
            setCurrentPage(page);
          }}
        />
      )}
      <ModalAlert
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={() => {
          handleDeleteTransaction(selectedTransactions);
        }}
        onCancel={closeModal}
        title="Xóa giao dịch"
        description={`Bạn có chắc chắn muốn xóa ${selectedTransactions.length} giao dịch này?`}
        type="danger"
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
