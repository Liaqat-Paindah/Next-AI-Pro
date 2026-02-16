"use client";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface UserDetails {
  first_name?: string;
  last_name?: string;
  email?: string;
  image?: string | null;
}

export default function UserDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  if (!session?.user) {
    return null;
  }

  const user = session.user as UserDetails;
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  const displayName = fullName || user.email || "User";
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-1 border dark:border-gray-600 rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800  dark:focus:ring-blue-400"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 overflow-hidden rounded-full bg-linear-to-br from-[#387ea0] to-[#6ABAE1]">
          {user.image ? (
            <Image
              src={user.image}
              alt={displayName}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-sm font-medium text-white">
              {initials || "U"}
            </div>
          )}
        </div>

        {/* Name and Arrow - Hidden on mobile, visible on desktop */}
        <div className="items-center hidden md:flex ">
          <span className="mr-1 text-sm font-medium text-gray-700 truncate max-w-30 dark:text-gray-300">
            {displayName}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5.5 7.5L10 12L14.5 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Mobile indicator - only arrow on mobile */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 md:hidden dark:text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5.5 7.5L10 12L14.5 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 z-50 w-70 mt-2 overflow-hidden rounded-sm border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:w-[320px]"
      >
        {/* User Info Header */}
        <div className="p-4 bg-linear-to-br from-gray-50 to-gray-100  dark:from-gray-800/50 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative  w-12 h-12 overflow-hidden rounded-full bg-linear-to-br from-[#03396C] to-[#6ABAE1]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={displayName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-lg font-semibold text-white">
                  {initials || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                {fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="p-2">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-sm transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4C8.68629 4 6 6.68629 6 10C6 11.8393 6.79375 13.5064 8.07129 14.6562C9.25684 15.7257 10.5547 16.5 12 16.5C13.4453 16.5 14.7432 15.7257 15.9287 14.6562C17.2063 13.5064 18 11.8393 18 10C18 6.68629 15.3137 4 12 4ZM12 15C10.8885 15 9.825 14.3857 8.81445 13.4688C7.74219 12.4951 7 11.1328 7 10C7 7.23858 9.23858 5 12 5C14.7614 5 17 7.23858 17 10C17 11.1328 16.2578 12.4951 15.1855 13.4688C14.175 14.3857 13.1115 15 12 15ZM5 20C5 18.8954 5.89543 18 7 18H17C18.1046 18 19 18.8954 19 20V21H20V20C20 18.3431 18.6569 17 17 17H7C5.34315 17 4 18.3431 4 20V21H5V20Z"
                  fill="currentColor"
                />
              </svg>
              <span>Profile</span>
            </DropdownItem>
          </li>
          
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/settings"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-sm transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5ZM12 14C11.1716 14 10.5 13.3284 10.5 12.5C10.5 11.6716 11.1716 11 12 11C12.8284 11 13.5 11.6716 13.5 12.5C13.5 13.3284 12.8284 14 12 14Z"
                  fill="currentColor"
                />
                <path
                  d="M12 3C10.6868 3 9.38642 3.25866 8.17317 3.7612C6.95991 4.26375 5.85752 5.00035 4.92893 5.92893C3.05357 7.8043 2 10.3478 2 13C2 15.6522 3.05357 18.1957 4.92893 20.0711C5.85752 20.9997 6.95991 21.7362 8.17317 22.2388C9.38642 22.7413 10.6868 23 12 23C13.3132 23 14.6136 22.7413 15.8268 22.2388C17.0401 21.7362 18.1425 20.9997 19.0711 20.0711C20.9464 18.1957 22 15.6522 22 13C22 10.3478 20.9464 7.8043 19.0711 5.92893C18.1425 5.00035 17.0401 4.26375 15.8268 3.7612C14.6136 3.25866 13.3132 3 12 3ZM12 5C14.1217 5 16.1566 5.84285 17.6569 7.34315C19.1571 8.84344 20 10.8783 20 13C20 15.1217 19.1571 17.1566 17.6569 18.6569C16.1566 20.1571 14.1217 21 12 21C9.87827 21 7.84344 20.1571 6.34315 18.6569C4.84285 17.1566 4 15.1217 4 13C4 10.8783 4.84285 8.84344 6.34315 7.34315C7.84344 5.84285 9.87827 5 12 5Z"
                  fill="currentColor"
                />
              </svg>
              <span>Settings</span>
            </DropdownItem>
          </li>
          
        </ul>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Sign Out Button */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-sm transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
                fill="currentColor"
              />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </Dropdown>
    </div>
  );
}