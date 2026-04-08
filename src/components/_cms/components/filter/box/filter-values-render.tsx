import React from "react";
import { FilterItemConfig, FilterValue } from "./type";
import { formatCurrency } from "@/utils/format-data";
import { X } from "lucide-react";

interface FilterValuesRenderProps {
  filterConfigs: FilterItemConfig[];
  filterValues: Record<string, FilterValue>;
  onDeleteItem: (keyFilter: string, keyValue?: string) => void;
}

export default function FilterValuesRender({
  filterConfigs,
  filterValues,
  onDeleteItem,
}: FilterValuesRenderProps) {
  const renderActiveFilterItem = (key: string, value: FilterValue) => {
    const config = filterConfigs.find((config) => config.key === key);
    if (!config) {
      return null;
    }
    if (
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "string" && value === "")
    ) {
      return null;
    }

    return (
      <div
        key={key}
        className="inline-flex shrink-0 gap-2 items-center px-2 py-1 text-xs border border-stroke-primary max-w-full overflow-x-scroll scrollbar-hidden"
      >
        <span className="text-[0.8125rem]/[120%] font-medium text-txt-primary capitalize">
          {config.label}:
        </span>

        {Array.isArray(value) &&
        value.every((item) => typeof item === "number") ? (
          <span className="bg-red-subtle5 px-1.5 py-[2px] inline-flex gap-1 items-center text-txt-primary">
            <span>
              {formatCurrency(value[0])} - {formatCurrency(value[1])}
            </span>

            <X
              className="w-3 h-3 text-icon-secondary"
              onClick={() => onDeleteItem(String(key), undefined)}
            />
          </span>
        ) : Array.isArray(value) ? (
          value.slice(0, 2).map((item) => {
            const label = config.options.find(
              (options) => options.value === item,
            )?.label;
            if (!label) {
              return null;
            }
            return (
              <span
                className="bg-red-subtle5 px-1.5 py-[2px] inline-flex gap-1 items-center text-txt-primary"
                key={item}
              >
                {label}
                <X
                  className="w-3 h-3 text-icon-secondary"
                  onClick={() => onDeleteItem(String(key), String(item))}
                />
              </span>
            );
          })
        ) : null}

        {Array.isArray(value) && value.length > 2 && (
          <span className="text-txt-status-red text-[0.6875rem] font-semibold px-1.5 py-[2px] inline-flex items-center">
            +{value.length - 2}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex place-items-baseline gap-3">
      {Object.entries(filterValues).length > 0 && (
        <span className="text-sm font-medium text-txt-secondary shrink-0">
          Đang lọc theo:
        </span>
      )}

      <div className="flex gap-2 w-fit max-w-full overflow-x-scroll scrollbar-hidden md:flex-wrap  md:items-center md:overflow-visible">
        {Object.entries(filterValues).map(([key, value]) => {
          return renderActiveFilterItem(key, value);
        })}
      </div>
    </div>
  );
}
