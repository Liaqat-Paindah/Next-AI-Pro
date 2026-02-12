"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import menuData from "./menuData";
import { ModeToggle } from "./theme-toggle";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen((prev) => !prev);
  };

  // Close navbar on route change - fixed effect
  const pathname = usePathname();

  // Sticky Navbar with proper cleanup
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = useCallback(() => {
    setSticky(window.scrollY >= 80);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, [handleStickyNavbar]);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".group")) {
        setOpenIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`
          header fixed top-0 left-0 z-[9999] w-full transition-all duration-300
          ${
            sticky
              ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:bg-gray-dark/95 dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] py-2"
              : "bg-transparent py-3 md:py-4 lg:py-5"
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div>
              <Link
                href="/"
                className="block transition-transform hover:scale-105"
              >
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={140}
                  height={40}
                  className="h-auto w-auto max-h-10 md:max-h-12 lg:max-h-14 dark:hidden"
                  priority
                />
                <Image
                  src="/logo-dark.png"
                  alt="logo"
                  width={140}
                  height={40}
                  className="hidden h-auto w-auto max-h-10 md:max-h-12 lg:max-h-14 dark:block"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8 xl:space-x-12">
              <ul className="flex space-x-6 xl:space-x-8">
                {menuData.map((menuItem, index) => (
                  <li key={index} className="relative group">
                    {menuItem.path ? (
                      <Link
                        href={menuItem.path as string}
                        className={`
                          inline-flex items-center py-2 text-sm xl:text-base font-medium transition-colors duration-200
                          ${
                            pathname === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                          }
                        `}
                      >
                        {menuItem.title}
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSubmenu(index)}
                          className={`
                            inline-flex items-center py-2 text-sm xl:text-base font-medium transition-colors duration-200
                            text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white
                            ${openIndex === index ? "text-primary dark:text-white" : ""}
                          `}
                        >
                          {menuItem.title}
                          <svg
                            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                              openIndex === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {menuItem.submenu && (
                          <div
                            className={`
                              absolute left-0 top-full mt-1 w-56 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 
                              transition-all duration-200 dark:bg-gray-800
                              ${
                                openIndex === index
                                  ? "visible opacity-100 translate-y-0"
                                  : "invisible opacity-0 translate-y-2 pointer-events-none"
                              }
                            `}
                          >
                            {menuItem.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.path as string}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
              <ModeToggle />

              <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-3">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-primary dark:text-gray-300 dark:hover:text-white lg:px-5 lg:py-2.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 lg:px-5 lg:py-2.5"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={navbarToggleHandler}
                aria-label="Toggle Mobile Menu"
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {navbarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
              fixed inset-x-0 top-20 z-50 h-[calc(100vh-65px)] bg-white transition-all duration-300 dark:bg-gray-900 lg:hidden
              ${
                navbarOpen
                  ? "visible opacity-100 translate-x-0"
                  : "invisible opacity-0 translate-x-full"
              }
            `}
          >
            <nav className="container mx-auto h-full overflow-y-auto px-4 py-6 sm:px-6">
              <ul className="space-y-3">
                {menuData.map((menuItem, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    {menuItem.path ? (
                      <Link
                        href={menuItem.path as string}
                        onClick={() => setNavbarOpen(false)}
                        className={`
                          block py-3 text-base font-medium transition-colors
                          ${
                            pathname === menuItem.path
                              ? "text-primary dark:text-white"
                              : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                          }
                        `}
                      >
                        {menuItem.title}
                      </Link>
                    ) : (
                      <div className="py-2">
                        <button
                          onClick={() => handleSubmenu(index)}
                          className="flex w-full items-center justify-between py-2 text-base font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                        >
                          {menuItem.title}
                          <svg
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openIndex === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Mobile Submenu */}
                        {menuItem.submenu && (
                          <div
                            className={`
                              mt-2 space-y-2 pl-4 transition-all duration-200
                              ${
                                openIndex === index
                                  ? "block opacity-100"
                                  : "hidden opacity-0"
                              }
                            `}
                          >
                            {menuItem.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.path as string}
                                onClick={() => setNavbarOpen(false)}
                                className="block py-2 text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-white"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}

                {/* Mobile Auth Buttons */}
                <li className="pt-4 space-y-3">
                  <Link
                    href="/signin"
                    onClick={() => setNavbarOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setNavbarOpen(false)}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-base font-medium text-white transition-colors hover:bg-primary/90"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {navbarOpen && (
        <div
          onClick={() => setNavbarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Spacer to prevent content from going under fixed header */}
      <div
        className={`${sticky ? "h-[73px]" : "h-[73px] md:h-[84px] lg:h-[93px]"}`}
      />
    </>
  );
};

export default Header;
