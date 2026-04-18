import { IconKey } from "@/utils/iconMap";
import { SystemRole } from "./profile";

// Navigation
export interface NavItem {
  name: string;
  icon: IconKey;
  path?: string;
  subItems?: SubMenu[];
  new?: boolean;
  role?: (keyof typeof SystemRole)[];
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
