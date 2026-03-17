// TEMPLATE REFERENCE - Original TailAdmin Navigation Configuration
// This file contains the complete original navigation structure for reference
// Use this as a template when adding new menu items or restoring original navigation

import { Menu, NavItem } from "@/types/nav";

// Original Dashboard and Main Navigation Items
const templateNavItems: NavItem[] = [
  {
    icon: "grid",
    name: "Dashboard",
    subItems: [
      { name: "Ecommerce", path: "/template" },
      { name: "Analytics", path: "/template/analytics" },
      { name: "Marketing", path: "/template/marketing" },
      { name: "CRM", path: "/template/crm" },
      { name: "Stocks", path: "/template/stocks" },
      { name: "SaaS", path: "/template/saas", new: true },
      { name: "Logistics", path: "/template/logistics", new: true },
    ],
  },
  {
    name: "AI Assistant",
    icon: "ai",
    new: true,
    subItems: [
      {
        name: "Text Generator",
        path: "/template/text-generator",
      },
      {
        name: "Image Generator",
        path: "/template/image-generator",
      },
      {
        name: "Code Generator",
        path: "/template/code-generator",
      },
      {
        name: "Video Generator",
        path: "/template/video-generator",
      },
    ],
  },
  {
    name: "E-commerce",
    icon: "cart",
    new: true,
    subItems: [
      { name: "Products", path: "/template/products" },
      { name: "Add Product", path: "/template/add-product" },
      { name: "Billing", path: "/template/billing" },
      { name: "Invoices", path: "/template/invoices" },
      { name: "Single Invoice", path: "/template/single-invoice" },
      { name: "Create Invoice", path: "/template/create-invoice" },
      { name: "Transactions", path: "/template/transactions" },
      { name: "Single Transaction", path: "/template/single-transaction" },
    ],
  },
  {
    icon: "calendar",
    name: "Calendar",
    path: "/template/calendar",
  },
  {
    icon: "userCircle",
    name: "User Profile",
    path: "/template/profile",
  },
  {
    name: "Task",
    icon: "task",
    subItems: [
      { name: "List", path: "/template/task-list", pro: true },
      { name: "Kanban", path: "/template/task-kanban", pro: true },
    ],
  },
  {
    name: "Forms",
    icon: "list",
    subItems: [
      { name: "Form Elements", path: "/template/form-elements", pro: false },
      { name: "Form Layout", path: "/template/form-layout", pro: true },
    ],
  },
  {
    name: "Tables",
    icon: "table",
    subItems: [
      { name: "Basic Tables", path: "/template/basic-tables", pro: false },
      { name: "Data Tables", path: "/template/data-tables", pro: true },
    ],
  },
  {
    name: "Pages",
    icon: "page",
    subItems: [
      { name: "File Manager", path: "/template/file-manager" },
      { name: "Pricing Tables", path: "/template/pricing-tables" },
      { name: "FAQ", path: "/template/faq" },
      { name: "API Keys", path: "/template/api-keys", new: true },
      { name: "Integrations", path: "/template/integrations", new: true },
      { name: "Blank Page", path: "/template/blank" },
      { name: "404 Error", path: "/template/error-404" },
      { name: "500 Error", path: "/template/error-500" },
      { name: "503 Error", path: "/template/error-503" },
      { name: "Coming Soon", path: "/template/coming-soon" },
      { name: "Maintenance", path: "/template/maintenance" },
      { name: "Success", path: "/template/success" },
    ],
  },
];

// Original "Others" Section Navigation Items
const templateOthersItems: NavItem[] = [
  {
    icon: "pieChart",
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/template/line-chart", pro: true },
      { name: "Bar Chart", path: "/template/bar-chart", pro: true },
      { name: "Pie Chart", path: "/template/pie-chart", pro: true },
    ],
  },
  {
    icon: "boxCube",
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/template/alerts" },
      { name: "Avatar", path: "/template/avatars" },
      { name: "Badge", path: "/template/badge" },
      { name: "Breadcrumb", path: "/template/breadcrumb" },
      { name: "Buttons", path: "/template/buttons" },
      { name: "Buttons Group", path: "/template/buttons-group" },
      { name: "Cards", path: "/template/cards" },
      { name: "Carousel", path: "/template/carousel" },
      { name: "Dropdowns", path: "/template/dropdowns" },
      { name: "Images", path: "/template/images" },
      { name: "Links", path: "/template/links" },
      { name: "List", path: "/template/list" },
      { name: "Modals", path: "/template/modals" },
      { name: "Notification", path: "/template/notifications" },
      { name: "Pagination", path: "/template/pagination" },
      { name: "Popovers", path: "/template/popovers" },
      { name: "Progressbar", path: "/template/progress-bar" },
      { name: "Ribbons", path: "/template/ribbons" },
      { name: "Spinners", path: "/template/spinners" },
      { name: "Tabs", path: "/template/tabs" },
      { name: "Tooltips", path: "/template/tooltips" },
      { name: "Videos", path: "/template/videos" },
    ],
  },
  {
    icon: "plugin",
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/template/signin", pro: false },
      { name: "Sign Up", path: "/template/signup", pro: false },
      { name: "Reset Password", path: "/template/reset-password" },
      {
        name: "Two Step Verification",
        path: "/template/two-step-verification",
      },
    ],
  },
];

// Original "Support" Section Navigation Items
const templateSupportItems: NavItem[] = [
  {
    icon: "chat",
    name: "Chat",
    path: "/template/chat",
  },
  {
    icon: "call",
    name: "Support",
    new: true,
    subItems: [
      { name: "Support List", path: "/template/support-list" },
      { name: "Support Reply", path: "/template/support-reply" },
    ],
  },
  {
    icon: "mail",
    name: "Email",
    subItems: [
      { name: "Inbox", path: "/template/inbox" },
      { name: "Details", path: "/template/inbox-details" },
    ],
  },
];

// Original TailAdmin Sidebar Configuration (Complete)
export const _templateTailAdminSidebar: Menu = {
  main: {
    title: "Dashboard",
    items: templateNavItems,
  },
  support: {
    title: "Support",
    items: templateSupportItems,
  },
  others: {
    title: "Others",
    items: templateOthersItems,
  },
};

// Export individual sections for reference
export {
  templateNavItems,
  templateOthersItems,
  templateSupportItems,
};
