// CMS Navigation Configuration
// For original TailAdmin navigation reference, see _nav.template.ts

import { APP_ROUTES } from "@/config/app-routes";
import { Menu, NavItem } from "@/types/nav";

// Main navigation items for CMS
const navItems: NavItem[] = [
  {
    icon: "grid",
    name: "Dashboard",
    path: APP_ROUTES.ADMIN.DASHBOARD,
  },
  {
    icon: "boxCube",
    name: "Nhà trọ",
    path: APP_ROUTES.ADMIN.BUILDINGS.BASE,
    subItems: [
      { name: "Danh sách", path: APP_ROUTES.ADMIN.BUILDINGS.BASE },
      { name: "Thêm mới", path: APP_ROUTES.ADMIN.BUILDINGS.ADD() },
    ],
  },
  {
    icon: "userCircle",
    name: "Nhân viên",
    path: APP_ROUTES.ADMIN.USERS.BASE,
    subItems: [
      { name: "Danh sách", path: APP_ROUTES.ADMIN.USERS.BASE },
      { name: "Thêm mới", path: APP_ROUTES.ADMIN.USERS.ADD() },
    ],
  },
];

// CMS Sidebar Configuration
export const _cmsSidebar: Menu = {
  main: {
    title: "Main Menu",
    items: navItems,
  },
};
