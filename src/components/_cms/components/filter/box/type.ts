export interface BaseFilterItemConfig {
  key: string;
  label?: string;
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

export interface InputRange extends BaseFilterItemConfig {
  type: "input-range";
  range: [number, number];
  options: { label: string; value: string }[];
}

export type FilterItemConfig = Checkboxs | ButtonsToggle | InputRange;

export type FilterValue = [number, number] | number | string[] | null;
