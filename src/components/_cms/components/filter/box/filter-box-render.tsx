import React from "react";
import { FilterItemRender } from "./filter-items";
import { FilterItemConfig, FilterValue } from "./type";

interface FilterBoxRenderProps {
  filterConfigs: FilterItemConfig[];
  handleFilterChange: (key: string, value: FilterValue) => void;
  handleClearAllFilters: () => void;
  filterValues: Record<string, FilterValue>;
  className?: string;
}

export default function FilterBoxRender({
  filterConfigs,
  handleFilterChange,
  filterValues,
  className,
}: FilterBoxRenderProps) {
  return (
    <div className={`w-full flex flex-col ${className}`}>
      {filterConfigs.map((config) => (
        <FilterItemRender
          className="border-t border-line-secondary py-4"
          key={config.key}
          config={config}
          value={filterValues[config.key]}
          onChange={(value) => handleFilterChange(config.key, value)}
        />
      ))}
    </div>
  );
}
