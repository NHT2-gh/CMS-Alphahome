import React, { useMemo, useState } from "react";
import { Input } from "../../ui/input";
import { debounce } from "@/lib/utils";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  handleOnChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceTime?: number;
  handleKeyDown?: (value: string) => void;
}

export default function SearchBar({
  placeholder,
  handleOnChange,
  className,
  debounceTime = 0,
  handleKeyDown,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const debouncedSendRequest = useMemo(
    () => debounce((value: string) => handleOnChange?.(value), debounceTime),
    [handleOnChange, debounceTime],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceTime > 0) {
      debouncedSendRequest(value);
    } else {
      handleOnChange?.(value);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleKeyDown?.(inputValue);
    }
  };

  return (
    <div className={`relative`}>
      <Input
        type="text"
        placeholder={placeholder || "Tìm kiếm"}
        className={`relative max-w-[400px] ${className}`}
        value={inputValue}
        onChange={onChange}
        name="search"
        id="search"
        onKeyDown={onKeyDown}
      >
        <SearchIcon className="size-5 text-gray-400 dark:text-gray-500 pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" />
      </Input>
    </div>
  );
}
