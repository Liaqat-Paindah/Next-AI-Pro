"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/SidebarContext";
import {
  LayoutDashboard,
  User,
  Settings,
  ChevronDown,
  LogOut,
  HelpCircle,
  FileText,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const mainNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-4 h-4" />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    name: "Application",
    path: "/application",
  },
  {
    icon: <User className="w-4 h-4" />,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: <Settings className="w-4 h-4" />,
    name: "Settings",
    path: "/settings",
  },
];

const bottomNavItems: NavItem[] = [
  {
    icon: <HelpCircle className="w-4 h-4" />,
    name: "Help",
    path: "/help",
  },
  {
    icon: <LogOut className="w-4 h-4" />,
    name: "Logout",
    path: "/logout",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Auto-expand submenu if a child route is active
  useEffect(() => {
    const allItems = [...mainNavItems];
    allItems.forEach((item) => {
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

  // Update submenu height when opened
  useEffect(() => {
    if (openSubmenu && subMenuRefs.current[openSubmenu]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSubMenuHeight({
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
      });
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (itemName: string) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  const renderNavItems = (items: NavItem[]) => (
    <nav className="space-y-1" aria-label="Sidebar navigation">
      {items.map((item) => (
        <div key={item.name}>
          {item.subItems ? (
            <div className="space-y-1">
              <button
                onClick={() => handleSubmenuToggle(item.name)}
                className={`
                  flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg
                  transition-all duration-200 group
                  ${
                    openSubmenu === item.name
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }
                  ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center" : "justify-between"}
                `}
                aria-expanded={openSubmenu === item.name}
                aria-controls={`submenu-${item.name}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`
                    transition-colors duration-200
                    ${
                      openSubmenu === item.name
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                  >
                    {item.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{item.name}</span>
                  )}
                </div>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    className={`
                      w-4 h-4 transition-transform duration-200
                      ${openSubmenu === item.name ? "rotate-180" : ""}
                      ${
                        openSubmenu === item.name
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-400 dark:text-gray-500"
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
                    height:
                      openSubmenu === item.name
                        ? `${subMenuHeight[item.name]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-1 ml-9 space-y-1">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`
                            block px-3 py-2 text-sm rounded-lg transition-all duration-200
                            ${
                              isActive(subItem.path)
                                ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 font-medium"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            }
                          `}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.path!}
              className={`
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg
                transition-all duration-200
                ${
                  isActive(item.path!)
                    ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }
                ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center" : "gap-3"}
              `}
            >
              <span
                className={`
                transition-colors duration-200
                ${
                  isActive(item.path!)
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
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
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 ease-in-out z-50
          ${isExpanded || isMobileOpen ? "w-64" : isHovered ? "w-64" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-xl lg:shadow-none
        `}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Main sidebar"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            className={`
              flex items-center w-full
              ${!isExpanded && !isHovered && !isMobileOpen ? "justify-center px-2" : "px-4"}
            `}
          >
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                {/* Light mode logo */}
                <Image
                  src="/logo.png"
                  alt="Nexus Digital"
                  width={120}
                  height={30}
                  className="block dark:hidden"
                  priority
                />
                {/* Dark mode logo */}
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
              <Image
                src="/fav.png"
                alt="Nexus Digital"
                width={28}
                height={28}
                className="dark:brightness-200"
                priority
              />
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide">
          <div className="flex-1 py-6 px-3">{renderNavItems(mainNavItems)}</div>

          <div className="py-6 px-3 border-t border-gray-200 dark:border-gray-800">
            {renderNavItems(bottomNavItems)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
