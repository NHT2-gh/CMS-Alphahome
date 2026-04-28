"use client";
import React, { useCallback, useState } from "react";

import { FilterIcon, Trash, Upload } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatCurrency } from "@/utils/format-data";
import { useBuilding } from "@/context/BuildingContext";
import { SearchBar } from "@/components/_cms/components/search-bar";
import {
  useAllTransactions,
  useDeleteTransaction,
} from "@/hooks/queries/use-transaction";
import { PaymentMethod, TransactionType } from "@/types/transcription";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";
import ModalAlert from "@/components/_cms/components/modal/alerts/modal-alert";
import { useModal } from "@/hooks/useModal";
import { showToast } from "@/lib/toast";
import TableNotFound from "@/components/_cms/common/table/state/not_found";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { FilterBoxRender } from "@/components/_cms/components/filter/box";
import { useFilter } from "@/hooks/use-filter";
import { TransactionFilterSchema } from "@/schemas/render-filter-schemas/transtion-filter.schema";
import { Pagination } from "@/components/_cms/components/pagination";
import Button from "@/components/ui/button/Button";

const _tableHeader: { key: string; title: string }[] = [
  { key: "id", title: "Mã giao dịch" },
  { key: "categories.name", title: "Tên hạng mục" },
  { key: "description", title: "Mô tả" },
  { key: "amount", title: "Số tiền" },
  { key: "transaction_date", title: "Ngày giao dịch" },
  { key: "payment_method", title: "Phương thức thanh toán" },
  { key: "type", title: "Loại" },
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
  const { data: transcriptions, isLoading } = useAllTransactions({
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
  const [transactionSelected, setTransactionSelected] = useState<string | null>(
    null,
  );

  const handleDeleteTransaction = useCallback(async (id: string) => {
    try {
      const result = await deleteTransaction.mutateAsync({
        id,
        buildingId: building?.id as string,
      });
      if (result.success) {
        closeModal();
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
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center justify-between border-b border-gray-200 p-3 md:p-5 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách thu chi
          </h3>
        </div>
        <div className="flex gap-3.5 items-center">
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

          <Button
            variant="outline"
            disabled={
              isLoading ||
              !transcriptions ||
              transcriptions?.data.length < limit
            }
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon className="size-4" /> Bộ lọc
          </Button>
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
            {(!transcriptions ||
              transcriptions.data.length === 0 ||
              isLoading) && (
              <TableRow>
                <TableCell className="w-full" colSpan={_tableHeader.length}>
                  <TableNotFound
                    message={
                      isLoading
                        ? "Đang tải dữ liệu..."
                        : "Hiện tại không tìm thấy dữ liệu"
                    }
                  />
                </TableCell>
              </TableRow>
            )}
            {transcriptions?.data?.map((item) => (
              <TableRow key={item.id} className="[&>td]:min-w-[6.25rem]">
                <TableCell className="uppercase">
                  {item.id.split("-")[0] + "-" + item.id.split("-")[3]}
                </TableCell>
                <TableCell>{item.categories.name}</TableCell>
                <TableCell>{item.description}</TableCell>
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

                <TableCell className="!min-w-fit">
                  <Trash
                    className="size-4 cursor-pointer text-red-500"
                    onClick={() => {
                      setTransactionSelected(item.id);
                      openModal();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {selectedTransactions.length > 0 && (
              <TableRow>
                <TableCell colSpan={_tableHeader.length + 1}>
                  <div className="flex items-center justify-between">
                    <p>Đã chọn {selectedTransactions.length}</p>
                    <div>
                      <button className="border rounded-xl py-2 px-4 bg-red-400 text-white">
                        Xoá {selectedTransactions.length} hoá đơn
                      </button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {transcriptions && transcriptions?.data.length > limit && (
        <Pagination
          type="default"
          pagination={{
            page: currentPage,
            limit: limit,
            total: transcriptions.pagination.total,
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
          handleDeleteTransaction(transactionSelected as string);
        }}
        onCancel={() => {
          closeModal();
        }}
        title="Xóa giao dịch"
        description="Bạn có chắc chắn muốn xóa giao dịch này?"
        type="danger"
        confirmText="Xác nhận xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
