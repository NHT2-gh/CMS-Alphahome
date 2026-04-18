"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import { NavItem } from "@/types/nav";
import { getIcon } from "@/utils/iconMap";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { SystemRole } from "@/types/profile";

interface AppSidebarProps<
  T extends Record<string, { title: string; items: NavItem[] }>,
> {
  topSidebar: {
    brandName?: string;
    basePathLogo: string;
    basePath: string;
    typeImage: "svg" | "png" | "jpg" | "jpeg" | "webp";
  };
  navContent: T;
}

export default function AppSidebar<
  T extends Record<string, { title: string; items: NavItem[] }>,
>({ navContent, topSidebar }: AppSidebarProps<T>) {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { profile } = useAuth();

  const renderMenuItems = (navItems: NavItem[], menuType: keyof T) => (
    <ul className="flex flex-col gap-1">
      {navItems
        .filter((nav) => !nav.role || nav.role.includes(profile?.role!))
        .map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {React.createElement(getIcon(nav.icon))}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {nav.new && (isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`ml-auto absolute right-10 ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    } menu-dropdown-badge`}
                  >
                    new
                  </span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {React.createElement(getIcon(nav.icon))}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${String(menuType)}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${String(menuType)}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-pro-active"
                                  : "menu-dropdown-badge-pro-inactive"
                              } menu-dropdown-badge-pro `}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
    </ul>
  );

  const renderSubMenu = (
    menuType: keyof T,
    subMenu: NavItem[],
    title: string,
  ) => {
    return (
      <div>
        <h2
          className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
            !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
          }`}
        >
          {isExpanded || isHovered || isMobileOpen ? (
            <span>{title}</span>
          ) : (
            <HorizontaLDots />
          )}
        </h2>
        {renderMenuItems(subMenu, menuType)}
      </div>
    );
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: keyof T;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    Object.keys(navContent).forEach((menuType) => {
      const items = navContent[menuType].items;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (subItem.path && isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as keyof T,
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${String(openSubmenu.type)}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: keyof T) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={cn(`fixed flex flex-col xl:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0`)}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "xl:justify-center" : "justify-start"
        }`}
      >
        <Link href={topSidebar.basePath}>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-brand-500 rounded-lg text-white font-bold text-lg">
                A
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                AlphaHome CMS
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-brand-500 rounded-lg text-white font-bold text-xl">
              A
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {Object.keys(navContent).map((key) => {
              return (
                <div key={key}>
                  {renderSubMenu(
                    key,
                    navContent[key].items,
                    navContent[key].title,
                  )}
                </div>
              );
            })}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
}
