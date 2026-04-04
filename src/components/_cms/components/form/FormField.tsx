import React from "react";
import Label from "./Label";
import { Controller } from "react-hook-form";
import DatePicker from "../date-picker/DatePicker";
import { FieldRendererProps, FieldType } from "@/types/form";
import { MultiSelect, Select } from "../../ui/select";
import {
  Checkbox,
  FileInput,
  Input,
  PasswordInput,
  PhoneInput,
  Radio,
  Textarea,
  UrlPrefixInput,
} from "../../ui/input";
import { Switch } from "../../ui/switch";

const fieldComponents: Record<FieldType, React.ComponentType<any>> = {
  text: Input,
  email: Input,
  password: PasswordInput,
  url: UrlPrefixInput,
  tel: PhoneInput,
  number: Input,
  textarea: Textarea,
  select: Select,
  multiselect: MultiSelect,
  radio: Radio,
  date: DatePicker,
  switch: Switch,
  checkbox: Checkbox,
  file: FileInput,
  custom: ({ field }) => {
    if (field.type === "custom" && field.component) {
      const CustomComponent = field.component;
      return <CustomComponent {...field.props} />;
    }
    return <div>Custom field component not found</div>;
  },
};

const customField = ["select", "multiselect", "date"];

export default function FormField({
  field,
  form,
  disabled,
  className,
}: FieldRendererProps) {
  const FieldComponent = fieldComponents[field.type];

  const error = field.name
    ? form?.formState.errors[field.name]?.message
    : undefined;

  if (!FieldComponent) {
    console.warn(`No component found for field type: ${field.type}`);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">
          Unknown field type: <code>{field.type}</code>
        </p>
      </div>
    );
  }
  return (
    <div className={className}>
      <Label className={`${!field.label && "h-0"} }`} htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-error-500">*</span>}
      </Label>

      {field.name && form ? (
        !customField.includes(field.type) ? (
          <Controller
            control={form.control}
            name={field.name}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <FieldComponent
                {...field}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
              />
            )}
          />
        ) : (
          <Controller
            control={form.control}
            name={field.name}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <FieldComponent
                {...field}
                disabled={disabled}
                handleOnChange={(
                  value: string | Date,
                  currentDateString?: string,
                ) => {
                  onChange(value);
                  if (currentDateString) {
                    onChange(currentDateString);
                  }
                }}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                ref={ref}
              />
            )}
          />
        )
      ) : (
        <FieldComponent {...field} disabled={disabled} value={field.value} />
      )}

      {error && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-error-500" : "text-gray-500"
          }`}
        >
          {error as string}
        </p>
      )}
    </div>
  );
}
