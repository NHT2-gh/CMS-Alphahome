import React from "react";
import { DateRange, FilterItemProp, FilterValue } from "../type";
import DatePicker from "../../../date-picker/DatePicker";
import { formatDateTime } from "@/utils/format-data";
import { DateOption } from "flatpickr/dist/types/options";

export default function DateRangeFilter({
  config,
  onChange,
  value,
}: FilterItemProp<DateRange, DateOption>) {
  return (
    <DatePicker
      id={config.key}
      mode="range"
      placeholder="Chọn khoảng thời gian"
      defaultDate={value}
      handleOnChange={(value) => {
        if (value.length === 2) {
          onChange?.(value.map((item) => formatDateTime(item.toISOString())));
        }
      }}
    />
  );
}
