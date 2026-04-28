import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React from "react";
import { Checkbox } from "../../ui/input";

export interface TableHeaderColumn {
  key: string;
  title: string;
  className?: string;
  description?: string;
  isHiddenOnMobile?: boolean;
}

export default function CMSTableHeader({
  columns,
  selectAll = false,
  handleSelectAll,
  className,
}: {
  columns: TableHeaderColumn[];
  className?: string;
  selectAll?: boolean;
  handleSelectAll?: (isSelectAll: boolean) => void;
}) {
  if (!columns) return;
  return (
    <TableHeader
      className={cn(
        "w-full border-b border-gray-100 dark:border-white/5",
        className,
      )}
    >
      <TableRow>
        {handleSelectAll ? (
          <TableCell
            isHeader
            className={cn(
              "font-medium text-gray-500 px-2 sm:px-6 text-theme-xs dark:text-gray-400 text-start",
              { "hidden md:table-cell": columns[0].isHiddenOnMobile },
            )}
          >
            <Checkbox
              id={columns[0].key}
              checked={selectAll}
              onChange={() => handleSelectAll?.(!selectAll)}
              label={columns[0].title}
            />
          </TableCell>
        ) : (
          <TableCell
            isHeader
            className={cn(
              "font-medium text-gray-500 px-2 sm:px-6 text-theme-xs dark:text-gray-400 text-start",
              { "hidden md:table-cell": columns[0].isHiddenOnMobile },
            )}
          >
            {columns[0].title}
          </TableCell>
        )}

        {columns.slice(1).map((cell, index) => (
          <TableCell
            key={index}
            isHeader
            className={cn(
              cell.className,
              { "text-center": cell.description },
              { "hidden md:table-cell": cell.isHiddenOnMobile },
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
