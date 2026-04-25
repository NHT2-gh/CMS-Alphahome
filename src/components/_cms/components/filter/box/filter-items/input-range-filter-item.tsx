"use client";
import React, { useState, useEffect } from "react";
import FilterItemRender from "./filter-item-render";
import { FilterItemConfig, FilterValue } from "../type";
import { Input } from "@/components/_cms/ui/input";

interface InputRangeFilterItemProps {
  config: FilterItemConfig;
  onChange?: (value: FilterValue) => void;
  className?: string;
  value?: FilterValue;
}

export default function InputRangeFilterItem({
  config,
  onChange,
  className,
  value,
}: InputRangeFilterItemProps) {
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  // Sync inputs with external value (only if it's a number array)
  useEffect(() => {
    if (value && Array.isArray(value)) {
      // Check if it's a number array (from custom input)
      const hasOnlyNumbers = value.every((v) => typeof v === "number");

      if (hasOnlyNumbers && value.length === 2) {
        const [min, max] = value as [number, number];
        setMinValue(min);
        setMaxValue(max);
      } else {
        // If it's string array (from quick select), clear inputs
        setMinValue(0);
        setMaxValue(0);
      }
    } else if (!value) {
      // Clear inputs if external value is null
      setMinValue(0);
      setMaxValue(0);
    }
  }, [value]);

  const handleMinChange = (value: number) => {
    const parsedMin = value ? value : 0;
    const parsedMax = maxValue ? maxValue : 0;

    setMinValue(value);
    // Only update if both values are non-zero
    if (parsedMin > 0 && parsedMax > 0) {
      onChange?.([parsedMin, parsedMax]);
    } else if (!value && !maxValue) {
      onChange?.(null);
    }
  };

  const handleMaxChange = (value: number) => {
    const parsedMin = minValue ? minValue : 0;
    const parsedMax = value ? value : 0;

    setMaxValue(value);
    // Only update if both values are non-zero
    if (parsedMin > 0 && parsedMax > 0) {
      console.log([parsedMin, parsedMax]);
      onChange?.([parsedMin, parsedMax]);
    } else if (!minValue && !value) {
      onChange?.(null);
    }
  };

  const handleSelectChange = (newValue: FilterValue) => {
    setMinValue(0);
    setMaxValue(0);

    if (newValue && Array.isArray(newValue)) {
      const hasOnlyString = newValue.filter((v) => typeof v === "string");
      if (hasOnlyString.length > 0) {
        onChange?.(hasOnlyString);
      }
    }
  };

  return (
    <div className="space-y-3">
      {"options" in config && config.options && config.options.length > 0 && (
        <FilterItemRender
          config={{
            subLabel: "Chọn nhanh",
            type: "checkbox",
            options: config.options,
            key: config.key,
          }}
          onChange={handleSelectChange}
          value={value as string[]}
          className={className}
        />
      )}
      <p className="text-sm font-medium">Hoặc nhập khoảng giá phù hợp:</p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={minValue}
          onChange={(value) => handleMinChange(Number(value))}
          placeholder="Từ"
          className="h-[1.875rem] text-center"
        />
        <span className="text-sm font-normal">~</span>
        <Input
          type="number"
          value={maxValue}
          onChange={(value) => handleMaxChange(Number(value))}
          placeholder="Đến"
          className="h-[1.875rem] text-center"
        />
      </div>
    </div>
  );
}
