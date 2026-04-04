/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { InputHTMLAttributes, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { DateOption, Hook } from "flatpickr/dist/types/options";

// Base field types
export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "date"
  | "switch"
  | "checkbox"
  | "radio"
  | "file"
  | "number"
  | "email"
  | "password"
  | "url"
  | "tel"
  | "custom";

// Layout types
export type LayoutType = "grid" | "tabs" | "stepper" | "accordion" | "inline";

// Field option for select/radio fields
export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// Base field configuration
export interface BaseFieldConfig extends Omit<
  InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  "type"
> {
  name?: string;
  type: FieldType;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  validation?: z.ZodType<any, any, any>;
  message?: string;
  label?: string;
  handleOnChange?: (value: string) => void;
}

// Specific field configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "url" | "tel";
  maxLength?: number;
  minLength?: number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select" | "multiselect" | "radio";
  options: FieldOption[];
  defaultValue?: string;
  multiple?: boolean;
}

export interface DateFieldConfig extends Omit<BaseFieldConfig, "onChange"> {
  type: "date";
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  minDate?: Date;
  maxDate?: Date;
}

export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch" | "checkbox";
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
}

// export interface ArrayFieldConfig extends BaseFieldConfig {
//   type: "array";
//   itemSchema: FieldConfig;
//   minItems?: number;
//   maxItems?: number;
//   addButtonText?: string;
//   removeButtonText?: string;
// }

export interface CustomFieldConfig extends BaseFieldConfig {
  type: "custom";
  component: React.ComponentType<CustomFieldProps>;
  props?: Record<string, any>;
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | DateFieldConfig
  | SwitchFieldConfig
  | FileFieldConfig
  // | ArrayFieldConfig
  | CustomFieldConfig;

// Grid layout configuration
export interface GridLayoutConfig {
  type: "grid";
  columns?: number;
  gap?: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// Tab layout configuration
export interface TabLayoutConfig {
  type: "tabs";
  tabs: {
    id: string;
    label: string;
    fields: string[];
    icon?: ReactNode;
  }[];
}

// Stepper layout configuration
export interface StepperLayoutConfig {
  type: "stepper";
  steps: {
    id: string;
    label: string;
    description?: string;
    fields: string[];
    validation?: z.ZodType<any, any, any>;
  }[];
  showStepNumbers?: boolean;
}

// Accordion layout configuration
export interface AccordionLayoutConfig {
  type: "accordion";
  sections: {
    id: string;
    title: string;
    description?: string;
    fields: string[];
    defaultOpen?: boolean;
    icon?: ReactNode;
  }[];
}

// Inline layout configuration
export interface InlineLayoutConfig {
  type: "inline";
  direction?: "row" | "column";
  wrap?: boolean;
  gap?: number;
}

// Union type for all layout configurations
export type LayoutConfig =
  | GridLayoutConfig
  | TabLayoutConfig
  | StepperLayoutConfig
  | AccordionLayoutConfig
  | InlineLayoutConfig;

// Form schema
export interface FormSchema {
  title?: string;
  description?: string;
  fields: FieldConfig[];
  layout?: LayoutConfig;
  validation?: z.ZodType<any, any, any>;
  defaultValues?: Record<string, any>;
}

// Form renderer props
export interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: any, form: UseFormReturn<any>) => void | Promise<void>;
  onError?: (errors: any, form: UseFormReturn<any>) => void;
  onCancel?: () => void;
  defaultValues?: Record<string, any>;
  className?: string;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  disabled?: boolean;
  mode?: "onChange" | "onBlur" | "onSubmit";
}

// Field renderer props
export interface FieldRendererProps {
  field: FieldConfig;
  form?: UseFormReturn<any>;
  disabled?: boolean;
  className?: string;
}

// Custom field props
export interface CustomFieldProps {
  field: CustomFieldConfig;
  form: UseFormReturn<any>;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

// Plugin system
export interface FieldPlugin {
  type: string;
  component: React.ComponentType<CustomFieldProps>;
  validation?: z.ZodType<any, any, any>;
}

export interface FormPlugin {
  name: string;
  fields?: FieldPlugin[];
  layouts?: {
    type: string;
    component: React.ComponentType<any>;
  }[];
}

// Form context
export interface FormContextValue {
  form: UseFormReturn<any>;
  schema: FormSchema;
  plugins: FormPlugin[];
  registerPlugin: (plugin: FormPlugin) => void;
  getFieldComponent: (
    type: string,
  ) => React.ComponentType<CustomFieldProps> | null;
}
