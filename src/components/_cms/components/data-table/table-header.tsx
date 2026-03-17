import Checkbox from "@/components/form/input/Checkbox";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React from "react";

export default function CMSTableHeader({
  tableHeader,
  selectAll = false,
  handleSelectAll,
  className,
}: {
  tableHeader: {
    key: string;
    title: string;
    className?: string;
    description?: string;
  }[];
  className?: string;
  selectAll?: boolean;
  handleSelectAll?: () => void;
}) {
  return (
    <TableHeader
      className={cn(
        "w-full border-b border-gray-100 dark:border-white/5",
        className,
      )}
    >
      <TableRow className="">
        {handleSelectAll ? (
          <TableCell
            isHeader
            className="font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start"
          >
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              label={tableHeader[0].title}
            />
          </TableCell>
        ) : (
          <TableCell
            isHeader
            className="font-medium text-gray-500 sm:px-6 text-theme-xs dark:text-gray-400 text-start"
          >
            {tableHeader[0].title}
          </TableCell>
        )}

        {tableHeader.slice(1).map((cell, index) => (
          <TableCell
            key={index}
            isHeader
            className={cn(
              "px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400",
              cell.className,
              { "text-center": cell.description },
            )}
          >
            {cell.title}
            {cell.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {"(" + cell.description + ")"}
              </p>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
}
