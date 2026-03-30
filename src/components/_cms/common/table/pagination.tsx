import PaginationWithIcon from "@/components/ui/pagination/PaginationWitIcon";
import { Pagination as PaginationType } from "@/types/common";
import React from "react";

interface PaginationProps {
  pagination: PaginationType;
  handlePageChange: (page: number) => void;
}

export default function Pagination({
  pagination,
  handlePageChange,
}: PaginationProps) {
  return (
    <div className="px-4 py-4 w-full flex items-center justify-between bg-white rounded-b-xl border-t border-gray-200 dark:bg-white/3 dark:border-white/5">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
          {pagination.total > 0
            ? `Showing ${
                (pagination.page - 1) * pagination.limit + 1
              } to ${Math.min(
                pagination.page * pagination.limit,
                pagination.total,
              )} of ${pagination.total} entries`
            : `Showing ${pagination.limit} entries`}
        </p>
      </div>

      {Math.ceil(pagination.total / pagination.limit) > 1 && (
        <PaginationWithIcon
          totalPages={Math.ceil(pagination.total / pagination.limit)}
          initialPage={pagination.page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
