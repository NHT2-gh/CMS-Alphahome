type FilterType = "checkbox" | "button-toggle" | "input-range" | "date-range";

export interface BaseFilterItemConfig {
  key: string;
  type: FilterType;
  label?: string;
  subLabel?: string;
  isMultiple?: boolean;
  disable?: boolean;
}
export interface Checkboxs extends BaseFilterItemConfig {
  type: "checkbox";
  options: { label: string | React.ReactNode; value: string; count?: number }[];
}

export interface ButtonsToggle extends BaseFilterItemConfig {
  type: "button-toggle";
  options: {
    label: string | React.ReactNode;
    value: string;
    count?: number;
    disable?: boolean;
  }[];
}

export interface DateRange extends BaseFilterItemConfig {
  type: "date-range";
  range: [string, string];
}

export interface InputRange extends BaseFilterItemConfig {
  type: "input-range";
  range: [number, number];
  options?: { label: string; value: string }[];
}

export type FilterItemConfig =
  | Checkboxs
  | ButtonsToggle
  | InputRange
  | DateRange;

export type FilterValue = [number, number] | number | string[] | string | null;
