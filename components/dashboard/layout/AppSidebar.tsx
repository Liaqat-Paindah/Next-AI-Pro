"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarContext";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FileText,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; icon?: React.ReactNode }[];
};

const mainNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Applications",
    path: "/dashboard/applicants",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    name: "Settings",
    path: "/dashboard/settings",
  },
];

const bottomNavItems: NavItem[] = [
  {
    icon: <LogOut className="w-5 h-5" />,
    name: "Logout",
    path: "/logout",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);
  const isActiveParent = useCallback(
    (item: NavItem) => {
      if (item.path && isActive(item.path)) return true;
      if (item.subItems) {
        return item.subItems.some((subItem) => isActive(subItem.path));
      }
      return false;
    },
    [isActive],
  );

  // Auto-expand submenu if a child route is active
  useEffect(() => {
    mainNavItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some((subItem) =>
          isActive(subItem.path),
        );
        if (hasActiveSubItem) {
          setOpenSubmenu(item.name);
        }
      }
    });
  }, [pathname, isActive]);

  const handleSubmenuToggle = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  const renderNavItems = (items: NavItem[]) => (
    <nav className="space-y-1.5" aria-label="Sidebar navigation">
      {items.map((item) => {
        const active = isActiveParent(item);
        const isSubmenuOpen = openSubmenu === item.name;

        return (
          <div key={item.name}>
            {item.subItems ? (
              <div className="space-y-1">
                <button
                  onClick={() => handleSubmenuToggle(item.name)}
                  className={`
                    relative flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-sm
                    transition-all duration-200 group
                    ${
                      active
                        ? "text-[#00A3FF] bg-linear-to-r from-[#00A3FF]/10 to-[#7000FF]/5 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/10 dark:text-[#00A3FF]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
                    }
                    ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center" : "justify-between"}
                  `}
                  aria-expanded={isSubmenuOpen}
                  aria-controls={`submenu-${item.name}`}
                >
                  {active && (
                    <span className="absolute left-0 w-1 h-6 bg-linear-to-b from-[#00A3FF] to-[#7000FF] rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        transition-colors duration-200
                        ${
                          active
                            ? "text-[#00A3FF] dark:text-[#00A3FF]"
                            : "text-gray-500 group-hover:text-[#00A3FF] dark:text-gray-500 dark:group-hover:text-[#00A3FF]"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="flex-1 text-left">{item.name}</span>
                    )}
                  </div>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronRight
                      className={`
                        w-4 h-4 transition-transform duration-200
                        ${isSubmenuOpen ? "rotate-90" : ""}
                        ${
                          active
                            ? "text-[#00A3FF] dark:text-[#00A3FF]"
                            : "text-gray-400 dark:text-gray-600"
                        }
                      `}
                    />
                  )}
                </button>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[item.name] = el;
                    }}
                    id={`submenu-${item.name}`}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height: isSubmenuOpen
                        ? `${subMenuHeight[item.name]}px`
                        : "0px",
                    }}
                  >
                    <div className="ml-4 pl-4 border-l-2 border-[#00A3FF]/20 dark:border-[#7000FF]/30">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.path}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm
                            transition-all duration-200 relative
                            ${
                              isActive(subItem.path)
                                ? "text-[#00A3FF] bg-linear-to-r from-[#00A3FF]/10 to-[#7000FF]/5 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/10 dark:text-[#00A3FF] font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-linear-to-b before:from-[#00A3FF] before:to-[#7000FF] before:rounded-r-full"
                                : "text-gray-600 hover:text-[#00A3FF] hover:bg-[#00A3FF]/5 dark:text-gray-400 dark:hover:text-[#00A3FF] dark:hover:bg-[#00A3FF]/10"
                            }
                          `}
                        >
                          <span
                            className={
                              isActive(subItem.path)
                                ? "text-[#00A3FF]"
                                : "text-gray-400 group-hover:text-[#00A3FF]"
                            }
                          >
                            {subItem.icon || (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </span>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.path!}
                className={`
                  relative flex items-center px-3 py-2.5 text-sm font-medium rounded-sm
                  transition-all duration-200 group
                  ${
                    active
                      ? "text-[#00A3FF] bg-linear-to-r from-[#00A3FF]/10 to-[#7000FF]/5 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/10 dark:text-[#00A3FF]"
                      : "text-gray-600 hover:text-[#00A3FF] hover:bg-[#00A3FF]/5 dark:text-gray-400 dark:hover:text-[#00A3FF] dark:hover:bg-[#00A3FF]/10"
                  }
                  ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center" : "gap-3"}
                `}
              >
                {active && (
                  <span className="absolute left-0 w-1 h-6 bg-linear-to-b from-[#00A3FF] to-[#7000FF] rounded-r-full" />
                )}

                <span
                  className={`
                    transition-colors duration-200
                    ${
                      active
                        ? "text-[#00A3FF] dark:text-[#00A3FF]"
                        : "text-gray-500 group-hover:text-[#00A3FF] dark:text-gray-500 dark:group-hover:text-[#00A3FF]"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span>{item.name}</span>
                )}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Overlay with blur effect */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
          onClick={() => setIsHovered(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl
          border-r border-gray-200/80 dark:border-white/5
          transition-all duration-300 ease-in-out z-50
          ${isExpanded || isMobileOpen ? "w-64" : isHovered ? "w-64" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-xl lg:shadow-sm
        `}
        onMouseEnter={() => !isExpanded && !isMobileOpen && setIsHovered(true)}
        onMouseLeave={() => !isExpanded && !isMobileOpen && setIsHovered(false)}
        aria-label="Main sidebar"
      >
        {/* Logo Section with linear border */}
        <div className="h-16 flex items-center border-b border-gray-200/80 dark:border-white/5 bg-linear-to-b from-transparent to-[#00A3FF]/5 dark:to-[#7000FF]/10">
          <Link
            href="/"
            className={`
              flex items-center w-full transition-all duration-200 hover:opacity-80
              ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center px-2" : "px-4"}
            `}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image
                  src="/logo.png"
                  alt="Nexus Digital"
                  width={120}
                  height={30}
                  className="block dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.png"
                  alt="Nexus Digital"
                  width={120}
                  height={30}
                  className="hidden dark:block"
                  priority
                />
              </>
            ) : (
              <div className="p-2 rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
                <Image
                  src="/fav.png"
                  alt="Nexus Digital"
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                  priority
                />
              </div>
            )}
          </Link>
        </div>

        {/* Decorative linear orbs */}
        <div className="absolute -left-1/4 top-20 h-64 w-64 rounded-full bg-[#00A3FF]/5 blur-[80px] dark:bg-[#00A3FF]/10" />
        <div className="absolute -right-1/4 bottom-20 h-64 w-64 rounded-full bg-[#7000FF]/5 blur-[80px] dark:bg-[#7000FF]/10" />

        {/* Navigation Section with custom scrollbar */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00A3FF]/20 dark:scrollbar-thumb-[#7000FF]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#00A3FF]/30 dark:hover:scrollbar-thumb-[#7000FF]/40">
          <div className="flex-1 py-6 px-3 space-y-6 relative z-10">
            {renderNavItems(mainNavItems)}
          </div>

          <div className="py-4 px-3 border-t border-gray-200/80 dark:border-white/5 bg-linear-to-t from-[#00A3FF]/5 to-transparent dark:from-[#7000FF]/10">
            {renderNavItems(bottomNavItems)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
