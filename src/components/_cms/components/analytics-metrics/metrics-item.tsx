import Badge from "@/components/ui/badge/Badge";
import React from "react";

interface MetricsItemProps {
  id: string;
  title: string;
  value: number | string;
  change?: number;
  comparisonText?: string;
}

export default function MetricsItem({
  id,
  title,
  value,
  change,
  comparisonText,
}: MetricsItemProps) {
  return (
    <div
      key={id}
      className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
    >
      <p className="text-gray-500 text-theme-sm dark:text-gray-400">{title}</p>
      <div className="flex items-end justify-between mt-3">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {value}
          </h4>
        </div>
        {change !== null && change !== undefined && (
          <div className="flex items-center gap-1">
            <Badge
              color={
                change === 0 ? "warning" : change < 0 ? "error" : "success"
              }
            >
              <span className="text-xs">
                {change === 0 ? "→" : change < 0 ? "↓" : "↑"}
                {Math.abs(change)}%
              </span>
            </Badge>
            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              {comparisonText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
