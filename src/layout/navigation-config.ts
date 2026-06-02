// CMS Navigation Configuration
// For original TailAdmin navigation reference, see _nav.template.ts

import { APP_ROUTES } from "@/config/app-routes";
import { Menu, NavItem } from "@/types/nav";

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
    name: "Quản lý toà nhà",
    path: APP_ROUTES.ADMIN.BUILDINGS.BASE(),
    subItems: [
      { name: "Danh sách", path: APP_ROUTES.ADMIN.BUILDINGS.BASE() },
      { name: "Thêm toà nhà", path: APP_ROUTES.ADMIN.BUILDINGS.CREATE() },
    ],
    role: ["super_admin", "admin"],
  },
  {
    icon: "userCircle",
    name: "Quản lý Sale Phòng",
    path: APP_ROUTES.SALE.BASE,
    subItems: [
      {
        name: "Danh sách phòng",
        path: APP_ROUTES.SALE.AVAILABLE_ROOMS(),
      },
    ],
    role: ["super_admin", "admin", "user"],
  },
];

// CMS Sidebar Configuration
export const NavigationConfig: Menu = {
  main: {
    title: "Main Menu",
    items: NavItems,
  },
};
