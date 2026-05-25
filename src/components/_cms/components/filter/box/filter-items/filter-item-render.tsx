"use client";
import React from "react";
import FilterItemLayout from "./filter-item-layout";
import {
  InputRangeFilter,
  ButtonsToggleFilter,
  CheckboxsFilter,
  DateRangeFilter,
  SwitchFilter,
} from ".";
import { FilterItemConfig, FilterItemProp, FilterValue } from "../type";
import { DateOption } from "flatpickr/dist/types/options";
// ----------------------------------------------------------------------

// Main Dynamic Filter Item Component
export default function FilterItemRender({
  config,
  onChange,
  className,
  value,
}: FilterItemProp<FilterItemConfig, FilterValue>) {
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
            value={value as number[]}
          />
        );
      case "date-range":
        return (
          <DateRangeFilter
            config={config}
            onChange={onChange}
            value={value as DateOption}
          />
        );
      case "switch-filter":
        return (
          <SwitchFilter
            config={config}
            onChange={onChange}
            value={value as boolean}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FilterItemLayout
      label={config.label}
      subLabel={config.subLabel}
      className={className}
    >
      {renderFilterItem()}
    </FilterItemLayout>
  );
}
