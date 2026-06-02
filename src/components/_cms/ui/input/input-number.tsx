"use client";
import React, { useMemo, useState } from "react";
import { cn, debounce } from "@/lib/utils";
import { formatCurrency as formatCurrencyUtil } from "@/utils/format-data";
import { NumberFieldConfig } from "@/types/form";

const baseClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`;
const variantClasses = {
  disabled: ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`,
  error: ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`,
  success: ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`,
  default: ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`,
};

export default function NumberInput({
  type = "number",
  variant = "default",
  disabled = false,
  id,
  name,
  placeholder,
  debounceTime,
  defaultValue,
  value,
  className,
  min,
  max,
  step,
  hint,
  handleOnChange,
  formatCurrency,
  children,
  ...props
}: NumberFieldConfig) {
  const [inputValue, setInputValue] = useState<number>(0);

  const debouncedSendRequest = useMemo(() => {
    return debounce(
      (value: string) => handleOnChange?.(Number(value)),
      debounceTime!,
    );
  }, [handleOnChange, debounceTime]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(isNaN(Number(value)) ? 0 : Number(value));
    debounceTime
      ? debouncedSendRequest(value)
      : handleOnChange?.(Number(value));
  };

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(baseClasses, variantClasses[variant], {
          [variantClasses.disabled]: disabled,
        })}
        {...props}
      />

      <div className="absolute right-2 bottom-[-2]">{children}</div>

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            variant === "error"
              ? "text-error-500"
              : variant === "success"
                ? "text-success-500"
                : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}

      {formatCurrency && type === "number" && (
        <p
          className={`mt-1.5 ml-2 text-xs absolute -top-6 right-1 ${
            variant === "error"
              ? "text-error-500"
              : variant === "success"
                ? "text-success-500"
                : "text-gray-500"
          }`}
        >
          {"[ "}
          {isNaN(value as number) ? 0 : formatCurrencyUtil(value as number)}
          {" ]"}
        </p>
      )}
    </div>
  );
}
