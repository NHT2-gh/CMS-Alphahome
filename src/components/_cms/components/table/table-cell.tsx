import AvatarText from "@/components/ui/avatar/AvatarText";
import Badge from "@/components/ui/badge/Badge";
import { TableCell } from "@/components/ui/table";
import React from "react";

interface CMSTableCellProps {
  data: dataType;
  variant?: "default" | "avatar";
}

const colorStatusMap = {
  success: ["success", "Active"],
  error: ["error", "Inactive"],
  warning: ["warning", "Pending"],
};

interface dataType {
  title?: string;
  subtitle?: string;
  text?: string;
}

export default function CMSTableCell({
  data,
  variant = "default",
}: CMSTableCellProps) {
  const cellHasAvatar = ({
    title,
    subtitle,
  }: Pick<dataType, "title" | "subtitle">) => {
    return (
      <TableCell className="px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          {title && (
            <AvatarText name={title} className="w-10 h-10 flex-shrink-0" />
          )}
          <div className="max-w-full">
            <span className="mb-0.5 block text-theme-sm font-medium text-gray-700 dark:text-gray-400">
              {title}
            </span>
            <span className="text-gray-500 text-theme-sm dark:text-gray-400">
              {subtitle}
            </span>
          </div>
        </div>
      </TableCell>
    );
  };

  const cellHasDefault = ({ text }: Pick<dataType, "text">) => {
    return (
      <TableCell className="px-4 py-3.5 capitalize text-gray-700 dark:text-gray-400">
        {text}
      </TableCell>
    );
  };

  return {
    default: cellHasDefault(data),
    avatar: cellHasAvatar(data),
  }[variant];
}
