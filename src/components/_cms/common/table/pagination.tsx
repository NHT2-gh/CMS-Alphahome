import Button from "@/components/ui/button/Button";
import PaginationWithIcon from "@/components/ui/pagination/PaginationWitIcon";
import { Pagination as PaginationType } from "@/types/common";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import React from "react";
import SimplePagination from "./simple-pagination";

interface DefaultPaginationProps {
  type: "default";
  pagination: PaginationType;
  handlePageChange: (page: number) => void;
}

interface SimplePaginationProps {
  type: "simple";
  pagination: PaginationType;
  isFirstPage: boolean;
  isLastPage: boolean;
  handleNextPage: () => void;
  handlePrevPage: () => void;
}

export default function Pagination(
  props: DefaultPaginationProps | SimplePaginationProps,
) {
  const renderPagination = () => {
    switch (props.type) {
      case "default":
        return (
          props.pagination.total && (
            <PaginationWithIcon
              totalPages={Math.ceil(
                props.pagination.total / props.pagination.limit,
              )}
              initialPage={props.pagination.page}
              onPageChange={props.handlePageChange}
            />
          )
        );
      case "simple":
        return (
          <SimplePagination
            handlePrevPage={props.handlePrevPage}
            handleNextPage={props.handleNextPage}
            isFirstPage={props.isFirstPage}
            isLastPage={props.isLastPage}
          />
        );
    }
  };
  return (
    <div className="px-4 py-4 w-full flex items-center justify-between bg-white rounded-b-xl border-t border-gray-200 dark:bg-white/3 dark:border-white/5">
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
          {`Hiển thị ${(props.pagination.page - 1) * props.pagination.limit + 1} đến ${Math.min(props.pagination.page * props.pagination.limit, props.pagination.total || 0)} ${props.pagination.total ? `/ ${props.pagination.total}` : ""}`}
        </p>
      </div>

      {renderPagination()}
    </div>
  );
}
