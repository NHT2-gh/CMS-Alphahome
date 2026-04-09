"use client";
import React, { useCallback, useState } from "react";

import { Upload } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatCurrency } from "@/utils/format-data";
import { useBuilding } from "@/context/BuildingContext";
import { SearchBar } from "@/components/_cms/components/search-bar";
import { useAllTransactions } from "@/hooks/queries/use-transaction";
import { PaymentMethod, TransactionType } from "@/types/transcription";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { SingleFilterButtonGroup } from "@/components/_cms/components/filter/single";

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
  const { data: transcriptions } = useAllTransactions(building?.id as string);
  const [filter, setFilterStatus] = useState<TransactionType | "all">("all");
  const [search, setSearch] = useState<string | null>(null);
  const handleSearch = useCallback((value: string) => {
    if (value.trim() === "") {
      setSearch(null);
      return;
    }

    setSearch(value);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách thu chi
          </h3>
        </div>
        <div className="flex gap-3.5">
          <SingleFilterButtonGroup
            items={Object.entries(TransactionType).map(([value, label]) => ({
              label,
              value,
            }))}
            onChange={(value) => {
              setFilterStatus(value as TransactionType);
            }}
          />
          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
            <SearchBar
              placeholder="Tìm kiếm"
              className="ml-auto"
              handleOnChange={handleSearch}
              debounceTime={500}
            />
            {/* <FilterDropdown
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                  /> */}
            <button className="shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-[11px] text-sm font-medium text-gray-700 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <Upload className="size-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      <Table className="w-full">
        <CMSTableHeader tableHeader={_tableHeader} />
        <TableBody>
          {transcriptions?.map((item) => (
            <TableRow key={item.id}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
