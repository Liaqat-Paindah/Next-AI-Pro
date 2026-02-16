"use client";
import UserDropdown from "@/components/dashboard/layout/UserDropdown";
import { useSidebar } from "@/components/providers/SidebarContext";
import ThemeToggler from "@/components/shared/navigation/theme-toggle";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:px-6">
        {/* Top row - Always visible */}
        <div className="flex items-center justify-between w-full px-4 py-3 lg:px-0 lg:py-4 lg:w-auto">
          {/* Left section - Menu and Logo */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:w-11 lg:h-11 lg:border lg:border-gray-200 dark:lg:border-gray-800"
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
            >
              {isMobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="14"
                  viewBox="0 0 20 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H18.6666C19.0808 0.25 19.4166 0.585786 19.4166 1C19.4166 1.41421 19.0808 1.75 18.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 7C0.583252 6.58579 0.919038 6.25 1.33325 6.25H18.6666C19.0808 6.25 19.4166 6.58579 19.4166 7C19.4166 7.41421 19.0808 7.75 18.6666 7.75L1.33325 7.75C0.919038 7.75 0.583252 7.41422 0.583252 7ZM1.33325 12.25C0.919038 12.25 0.583252 12.5858 0.583252 13C0.583252 13.4142 0.919038 13.75 1.33325 13.75H12.6666C13.0808 13.75 13.4166 13.4142 13.4166 13C13.4166 12.5858 13.0808 12.25 12.6666 12.25H1.33325Z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>

            <Link href="/" className="lg:hidden">
              <Image
                width={120}
                height={32}
                className="dark:hidden"
                src="/logo.png"
                alt="Logo"
                priority
              />
              <Image
                width={120}
                height={32}
                className="hidden dark:block"
                src="/logo-dark.png"
                alt="Logo"
                priority
              />
            </Link>
          </div>

          {/* Right section - Mobile menu button */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg lg:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
            aria-expanded={isApplicationMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden lg:block lg:flex-1 lg:max-w-md lg:mx-4">
          <form className="w-full">
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or type command... (⌘K)"
                className="w-full h-11 pl-12 pr-4 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </form>
        </div>

        {/* Bottom row - Mobile menu dropdown */}
        <div
          className={`
            ${isApplicationMenuOpen ? "flex" : "hidden"}
            flex-col gap-4 px-4 py-4 bg-white border-t border-gray-200
            lg:flex lg:flex-row lg:items-center lg:justify-end lg:px-0 lg:py-0 lg:border-0 lg:bg-transparent
            dark:bg-gray-900 dark:border-gray-800
          `}
        >
          {/* Mobile Search - Only visible in mobile menu */}
          <div className="w-full lg:hidden">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-11 pl-12 pr-4 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between w-full lg:w-auto lg:justify-end lg:space-x-4">
            <div className="flex items-center gap-2">
              <ThemeToggler />
            </div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;