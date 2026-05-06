"use client";
import React, { useState } from "react";
import { FilterItemRender } from "./filter-items";
import { FilterItemConfig, FilterValue } from "./type";
import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";
import FilterValuesRender from "./filter-values-render";

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
  // handleClearAllFilters,
  filterValues,

  className,
}: FilterBoxRenderProps) {
  return (
    <div
      slot="filter-box"
      className={cn("m-3 border rounded-lg bg-neutral-50 ", className)}
    >
      <div className="grid p-3 gap-5 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {filterConfigs.map((config) => (
          <FilterItemRender
            key={config.key}
            config={config}
            value={filterValues[config.key]}
            onChange={(value) => handleFilterChange(config.key, value)}
          />
        ))}
      </div>
      {/* <div className="flex items-center justify-end gap-2">
        <Button variant="primary" size="sm">
          Áp dụng
        </Button>
        <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
          Xoá tất cả
        </Button>
      </div> */}
    </div>
  );
}
