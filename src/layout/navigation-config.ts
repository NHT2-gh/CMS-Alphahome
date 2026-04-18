// CMS Navigation Configuration
// For original TailAdmin navigation reference, see _nav.template.ts

import { APP_ROUTES } from "@/config/app-routes";
import { Menu, NavItem } from "@/types/nav";
import { SystemRole } from "@/types/profile";

// Main navigation items for CMS
const NavItems: NavItem[] = [
  {
    icon: "grid",
    name: "Dashboard",
    path: APP_ROUTES.ADMIN.BASE,
    role: ["super_admin"],
  },
  {
    icon: "boxCube",
    name: "Quản lý nhà trọ",
    path: APP_ROUTES.ADMIN.BUILDINGS.BASE(),
    subItems: [
      { name: "Danh sách nhà trọ", path: APP_ROUTES.ADMIN.BUILDINGS.BASE() },
      { name: "Thêm mới", path: APP_ROUTES.ADMIN.BUILDINGS.ADD() },
    ],
    role: ["super_admin", "admin"],
  },
  {
    icon: "userCircle",
    name: "Quản lý người dùng",
    path: APP_ROUTES.ADMIN.USERS.BASE,
    subItems: [
      { name: "Danh sách", path: APP_ROUTES.ADMIN.USERS.BASE },
      { name: "Thêm mới", path: APP_ROUTES.ADMIN.USERS.ADD() },
    ],
    role: ["super_admin"],
  },
];

// CMS Sidebar Configuration
export const NavigationConfig: Menu = {
  main: {
    title: "Main Menu",
    items: NavItems,
  },
};
