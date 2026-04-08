"use client";
import React from "react";
import FilterItemLayout from "./filter-item-layout";
import { InputRangeFilter, ButtonsToggleFilter, CheckboxsFilter } from ".";
import { FilterItemConfig, FilterValue } from "../type";
// ----------------------------------------------------------------------

interface FilterItemProps {
  config: FilterItemConfig;
  onChange?: (value: FilterValue) => void;
  className?: string;
  value?: FilterValue;
}

// Main Dynamic Filter Item Component
export default function FilterItemRender({
  config,
  onChange,
  className,
  value,
}: FilterItemProps) {
  const renderFilterItem = () => {
    switch (config.type) {
      case "button-toggle":
        return (
          <ButtonsToggleFilter
            config={config}
            onChange={onChange}
            value={value as string[]}
          />
        );

      case "checkbox":
        return (
          <CheckboxsFilter
            config={config}
            onChange={onChange}
            value={value as string[]}
          />
        );
      case "input-range":
        return (
          <InputRangeFilter
            config={config}
            onChange={onChange}
            value={value as string[]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FilterItemLayout label={config.label} className={className}>
      {renderFilterItem()}
    </FilterItemLayout>
  );
}
