import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface SingleFilterButtonGroupProp {
  items: {
    value: string;
    label: string;
  }[];
  onChange: (value: string | null) => void;
  value?: string;
  className?: string;
}

export default function SingleFilterButtonGroup({
  items,
  value,
  onChange,
  className,
}: SingleFilterButtonGroupProp) {
  const [currentValue, setCurrentValue] = useState<string | null>(
    value ? value : null,
  );
  return (
    <div
      className={cn(
        "hidden h-11 items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 lg:inline-flex dark:bg-gray-900",
        className,
      )}
    >
      <button
        onClick={() => {
          onChange(null);
          setCurrentValue(null);
        }}
        className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
          currentValue === null
            ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        Tất cả
      </button>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => {
            onChange(item.value);
            setCurrentValue(item.value);
          }}
          className={`text-theme-sm h-10 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${
            currentValue === item.value
              ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
