"use client";
import React, { useEffect, useState } from "react";
import { ButtonsToggle, Checkboxs, FilterItemProp } from "../type";
import { Checkbox } from "@/components/_cms/ui/input";

export default function CheckboxsFilterItem({
  config,
  onChange,
  className,
  value,
}: FilterItemProp<Checkboxs, string[]>) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckedOption = (option: string | "all") => {
    let newSelection: string[];

    if (option === "all") {
      // Toggle all options
      if (selectedOptions.length === config.options.length) {
        newSelection = [];
      } else {
        newSelection = config.options.map((opt) => opt.value);
      }
    } else {
      // Toggle individual option
      newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];
    }

    setSelectedOptions(newSelection);
    onChange?.(newSelection);
  };

  useEffect(() => {
    if (value) {
      setSelectedOptions(value);
    } else {
      setSelectedOptions([]);
    }
  }, [value]);

  return (
    <ul className={`${className}, space-y-2`}>
      <li>
        <Checkbox
          onChange={() => handleCheckedOption("all")}
          label="Tất cả"
          checked={selectedOptions.length === config.options.length}
          id={"all"}
        />
      </li>
      {config.options.map((option) => (
        <li key={option.value}>
          <Checkbox
            onChange={() => handleCheckedOption(option.value)}
            checked={selectedOptions.includes(option.value)}
            label={String(option.label)}
            id={option.value}
          />
        </li>
      ))}
    </ul>
  );
}
