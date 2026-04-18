import React from "react";
import { DateRange, FilterValue } from "../type";
import DatePicker from "../../../date-picker/DatePicker";
import { formatDateTime } from "@/utils/format-data";
import { DateOption } from "flatpickr/dist/types/options";

interface DateRangeFilterProps {
  config: DateRange;
  onChange?: (value: string[]) => void;
  value?: FilterValue;
}

export default function DateRangeFilter({
  config,
  onChange,
  value,
}: DateRangeFilterProps) {
  return (
    <DatePicker
      id={config.key}
      mode="range"
      placeholder="Chọn khoảng thời gian"
      defaultDate={value as DateOption}
      handleOnChange={(value) => {
        if (value.length === 2) {
          onChange?.(value.map((item) => formatDateTime(item.toISOString())));
        }
      }}
    />
  );
}
