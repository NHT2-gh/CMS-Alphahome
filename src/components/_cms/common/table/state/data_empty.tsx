import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export default function DataEmpty({
  message,
  colSpan,
}: {
  message: string;
  colSpan: number;
}) {
  return (
    <TableRow className="h-fit min-h-[300px]">
      <TableCell
        colSpan={colSpan}
        className="text-center text-sm font-normal text-gray-600 dark:text-gray-400 italic"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
