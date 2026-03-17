import { IconKey } from "@/utils/iconMap";

// Navigation
export interface NavItem {
  name: string;
  icon: IconKey;
  path?: string;
  subItems?: SubMenu[];
  new?: boolean;
}

export interface SubMenu {
  pro?: boolean;
  new?: boolean;
  name: string;
  path: string;
}

export interface Menu {
  [key: string]: {
    title: string;
    items: NavItem[];
  };
}
