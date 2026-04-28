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
        "hidden h-11 min-w-fit items-center gap-0.5 p-0.5 rounded-lg bg-gray-100 lg:inline-flex dark:bg-gray-900",
        className,
      )}
    >
      <button
        onClick={() => {
          onChange(null);
          setCurrentValue(null);
        }}
        className={cn(
          "text-theme-sm h-10 shrink-0 rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white",
          {
            "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800":
              currentValue === null,
            "text-gray-500 dark:text-gray-400": currentValue !== null,
          },
        )}
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
          className={cn(
            "text-theme-sm h-10 shrink-0 w-fit rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white",
            {
              "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800":
                currentValue === item.value,
              "text-gray-500 dark:text-gray-400": currentValue !== item.value,
            },
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
