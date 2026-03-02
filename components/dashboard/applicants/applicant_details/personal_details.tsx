"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, User, AlertCircle } from "lucide-react";

// Types and Constants
const STATUS_TYPES = {
  COMPLETE: "complete",
  PENDING: "pending",
} as const;

type StatusType = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];

interface Personal {
  firstName: string;
  lastName: string;
  fatherName: string;
  age: number;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  nationalId: string;
  passportId: string;
  dateofIssue: string;
  dataofExpire: string;
}

interface Props {
  personal: Personal;
  isLoading?: boolean;
  onError?: (error: Error) => void;
}

// Icons from the provided component
const Icons = {
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// Capitalize text helper
const capitalizeText = (text: string | number): string => {
  if (typeof text === "number") return text.toString();
  if (!text) return "—";

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatDate = (date?: string | null): string => {
  if (!date) return "N/A";

  // Replace timezone offset with Z to ensure proper parsing
  const cleanedDate = date.replace(/\+00:00$/, "Z");
  const dateObj = new Date(cleanedDate);

  if (isNaN(dateObj.getTime()) || dateObj.getFullYear() <= 1) return "N/A";

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


const PersonalInfoSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="rounded-sm border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800"
  >
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div>
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
    <div className="p-4 space-y-6">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-3">
          <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-2">
                <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    onError?: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-sm border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              Something went wrong loading personal information
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const InfoItem = ({
  label,
  value,
  status,
  id,
}: {
  label: string;
  value: string | number;
  status?: StatusType;
  id?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative group"
    id={id}
  >
    <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    <div className="relative border-b border-gray-200 dark:border-gray-700 pb-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400  mb-1">
          {label}
        </p>
        {status && (
          <div
            className={`flex items-center space-x-1 ${
              status === STATUS_TYPES.COMPLETE
                ? "text-[#00A3FF]"
                : "text-yellow-500"
            }`}
            aria-label={`Status: ${status}`}
          >
            {status === STATUS_TYPES.COMPLETE ? (
              <Icons.Check className="w-3 h-3" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            )}
          </div>
        )}
      </div>
      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium capitalize">
        {capitalizeText(value)}
      </p>
    </div>
  </motion.div>
);

const PersonalInfo = ({ personal, isLoading = false, onError }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return <PersonalInfoSkeleton />;
  }

  return (
    <ErrorBoundary onError={onError}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-sm border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800 w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          onClick={handleToggleExpand}
          onKeyDown={(e) => e.key === "Enter" && handleToggleExpand()}
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 cursor-pointer bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative group"
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls="personal-info-content"
          aria-label="Toggle personal information section"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 flex items-center justify-center border border-[#00A3FF]/30 dark:border-[#00A3FF]/20">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A3FF]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg  text-gray-900 dark:text-white tracking-wide">
                Personal Information
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
                {capitalizeText(personal.firstName)}{" "}
                {capitalizeText(personal.lastName)}
              </p>
            </div>
          </div>

          <motion.button
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isExpanded ? "Collapse section" : "Expand section"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>
        </motion.div>

        {/* Collapsible Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="personal-info-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Content Sections */}
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-white dark:bg-gray-800">
                {/* Basic Information Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <InfoItem
                      label="Full Name"
                      value={`${capitalizeText(personal.firstName)} ${capitalizeText(personal.lastName)}`}
                      status={STATUS_TYPES.COMPLETE}
                      id="full-name"
                    />
                    <InfoItem
                      label="Father's Name"
                      value={capitalizeText(personal.fatherName)}
                      id="father-name"
                    />
                    <InfoItem
                      label="Gender"
                      value={capitalizeText(personal.gender)}
                      id="gender"
                    />
                    <InfoItem
                      label="Marital Status"
                      value={capitalizeText(personal.maritalStatus)}
                      id="marital-status"
                    />
                    <InfoItem
                      label="Nationality"
                      value={capitalizeText(personal.nationality)}
                      id="nationality"
                    />
                    <InfoItem label="Age" value={personal.age} id="age" />
                  </div>
                </motion.div>

                {/* Documents Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <InfoItem
                      label="National ID"
                      value={personal.nationalId}
                      status={
                        personal.nationalId
                          ? STATUS_TYPES.COMPLETE
                          : STATUS_TYPES.PENDING
                      }
                      id="national-id"
                    />
                    <InfoItem
                      label="Passport ID"
                      value={personal.passportId}
                      status={
                        personal.passportId
                          ? STATUS_TYPES.COMPLETE
                          : STATUS_TYPES.PENDING
                      }
                      id="passport-id"
                    />
                  </div>
                </motion.div>

                {/* Dates Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <InfoItem
                      label="Birth Date"
                      value={formatDate(personal.birthDate)}
                      id="birth-date"
                    />
                    <InfoItem
                      label="Passport Issue Date"
                      value={formatDate(personal.dateofIssue)}
                      id="issue-date"
                    />
                    <InfoItem
                      label="Passport Expiry Date"
                      value={formatDate(personal.dataofExpire)}
                      id="expiry-date"
                    />
                    
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
};

export default PersonalInfo;
