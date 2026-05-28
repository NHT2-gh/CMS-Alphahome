import React from "react";
import { Controller } from "react-hook-form";
import { NumberInput } from "@/components/_cms/ui/input";
import { FieldItemProps, NumberFieldConfig } from "@/types/form";

export default function InputNumberField({
  control,
  fieldConfig,
  error,
}: FieldItemProps<NumberFieldConfig>) {
  return (
    <Controller
      name={fieldConfig.name!}
      control={control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => (
        <NumberInput
          {...fieldConfig}
          ref={ref}
          type="number"
          name={name}
          onBlur={onBlur}
          value={value}
          handleOnChange={(value) => {
            onChange(value);
          }}
        />
      )}
    />
  );
}
