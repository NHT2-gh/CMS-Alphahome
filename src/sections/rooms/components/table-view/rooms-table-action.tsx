import { SearchBar } from "@/components/_cms/components/search-bar";
import { Upload } from "lucide-react";
import React, { useCallback, useState } from "react";

interface TableActionProps {
  handleSearch: (value: string) => void;
  // handleFilterStatus: (value: string) => void;
}
export default function TableAction({
  handleSearch,
  // handleFilterStatus,
}: TableActionProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <div className="flex gap-3.5">
      <div className="hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900">
        <button
          onClick={() => {
            setFilterStatus("All");
            setCurrentPage(1);
          }}
          className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
            filterStatus === "All"
              ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => {
            setFilterStatus("available");
            setCurrentPage(1);
          }}
          className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
            filterStatus === "available"
              ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Đang trống
        </button>
      </div>
      <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
        <SearchBar
          placeholder="Tìm kiếm"
          className="ml-auto"
          handleKeyDown={handleSearch}
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
  );
}
