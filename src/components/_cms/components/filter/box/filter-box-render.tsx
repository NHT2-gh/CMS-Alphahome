"use client";
import React, { useState } from "react";
import { FilterItemRender } from "./filter-items";
import { FilterItemConfig, FilterValue } from "./type";
import Button from "@/components/ui/button/Button";
import { cn } from "@/lib/utils";

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
    <div
      slot="filter-box"
      className={cn(
        "p-3 border rounded-lg bg-neutral-50 grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]",
        className,
      )}
    >
      {filterConfigs.map((config) => (
        <FilterItemRender
          key={config.key}
          config={config}
          value={filterValues[config.key]}
          onChange={(value) => handleFilterChange(config.key, value)}
        />
      ))}
    </div>
  );
}
