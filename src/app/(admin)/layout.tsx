"use client";

import React from "react";
import Backdrop from "@/layout/Backdrop";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import { useSidebar } from "@/context/SidebarContext";
import { NavigationConfig } from "@/layout/navigation-config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "xl:ml-[290px]"
      : "xl:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar
        topSidebar={{
          basePath: "/",
          basePathLogo: "/images/logo/logo",
          typeImage: "svg",
        }}
        navContent={NavigationConfig}
      />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 md:px-5 mx-auto max-w-full">{children}</div>
      </div>
    </div>
  );
}
