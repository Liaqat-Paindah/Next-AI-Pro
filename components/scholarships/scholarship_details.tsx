"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Loading from "@/app/loading";
import { UseScholarshipById } from "@/hooks/useSchalorships";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Scholarship {
  id: string;
  title: string;
  description: string;
  requirements: string;
  type: string;
  level: string;
  views: number;
  isActive: boolean;
  image: string;
  value?: number;
  currency: string;
  durationMonths?: number;
  universities: string[];
  country: string[];
  region?: string;
  eligibleCountries?: string[];
  fieldOfStudy: string[];
  documentsRequired?: string[];
  minGPA?: string;
  ageLimit?: string;
  deadline: string;
  startDate?: string;
  applicationFee: number;
  brochureFile?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Icons System
// ============================================================================

const Icons = {
  Globe: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Users: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Award: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="7" />
      <polygon points="12 2 14 7 19 7 15 11 17 16 12 13 7 16 9 11 5 7 10 7 12 2" />
    </svg>
  ),
  Lightning: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
    </svg>
  ),
  Sparkles: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5" />
    </svg>
  ),
  Check: ({ className = "w-3 h-3" }) => (
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
  Target: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Compass: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v4M22 12h-4M12 20v2M4 12H2M20 12h2M12 4v2M18 12h2M12 18v2M6 12H4" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Location: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  University: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3L2 8l10 5 10-5-10-5z" />
      <path d="M2 14l10 5 10-5" />
      <path d="M2 20l10 5 10-5" />
    </svg>
  ),
  Document: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Money: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <path d="M8 10h8M8 14h6" />
    </svg>
  ),
  External: ({ className = "w-3 h-3" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Eye: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Share: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Bookmark: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

// ============================================================================
// Custom Cursor Effect - Hidden on mobile
// ============================================================================

const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 border-[#6ABAE1] dark:border-[#6ABAE1] hidden lg:block mix-blend-difference"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
};

// ============================================================================
// Toast Notification System
// ============================================================================

const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 50, x: 20 }}
      className={`fixed bottom-4 right-4 left-4 sm:left-auto z-50 px-4 py-3 rounded-sm text-sm sm:text-base ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white shadow-lg max-w-[90%] sm:max-w-md mx-auto sm:mx-0`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Feature Chip Component
// ============================================================================

interface FeatureChipProps {
  text: string;
  icon?: React.ReactNode;
  color?: "default" | "success" | "warning" | "info" | "purple";
  size?: "sm" | "md";
}

const FeatureChip = ({
  text,
  icon,
  color = "default",
  size = "sm",
}: FeatureChipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    default:
      "bg-[#6ABAE1]/10 text-[#6ABAE1] border-[#6ABAE1]/20 hover:border-[#6ABAE1]/50",
    success:
      "bg-green-500/10 text-green-600 border-green-500/20 hover:border-green-500/50",
    warning:
      "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:border-yellow-500/50",
    info: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:border-purple-500/50",
    purple:
      "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:border-purple-500/50",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`inline-flex items-center gap-1.5 rounded-sm backdrop-blur-sm border transition-all ${colorClasses[color]} ${sizeClasses[size]}`}
    >
      {icon && (
        <motion.span
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className="shrink-0"
        >
          {icon}
        </motion.span>
      )}
      <span className="font-medium truncate">{text}</span>
    </motion.div>
  );
};

// ============================================================================
// Info Card Component
// ============================================================================

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  index?: number;
  accent?: boolean;
}

const InfoCard = ({
  icon,
  title,
  children,
  index = 0,
  accent = false,
}: InfoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {accent && (
        <div className="absolute -inset-0.5 bg-linear-to-r from-[#6ABAE1] to-purple-600 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur" />
      )}

      <div
        className={`relative bg-white dark:bg-gray-800 backdrop-blur-sm border ${
          accent
            ? "border-[#6ABAE1]/30 dark:border-[#6ABAE1]/30"
            : "border-gray-200 dark:border-gray-700"
        } rounded-sm p-4 sm:p-5 h-full transition-all duration-300`}
      >
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-[#6ABAE1]/10 flex items-center justify-center border border-[#6ABAE1]/30 shrink-0"
          >
            <div className="text-[#6ABAE1] text-sm sm:text-base">{icon}</div>
          </motion.div>
          <h3 className="text-sm sm:text-base w-full font-semibold text-gray-900 dark:text-white line-clamp-1">
            {title}
          </h3>
        </div>

        <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
          {children}
        </div>

        <motion.div
          className="absolute -bottom-10 right-0 w-20 h-20 bg-[#6ABAE1]/10 rounded-sm blur-2xl pointer-events-none"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};

// ============================================================================
// Stat Card Component - Without shadow
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-[#6ABAE1]/10 flex items-center justify-center shrink-0">
          <div className="text-[#6ABAE1] text-sm sm:text-base">{icon}</div>
        </div>
      </div>
      <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white ">
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ">{label}</p>
    </motion.div>
  );
};




const ScholarshipDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatCurrency = useCallback((value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const formatRelativeTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Passed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks left`;
    return `${Math.floor(diffDays / 30)} months left`;
  }, []);

  const { data, isPending, error } = UseScholarshipById(id as string);
  const scholarship = data?.response as Scholarship | undefined;

  // Memoized Calculations - Always call hooks
  const daysUntilDeadline = useMemo(() => {
    if (!scholarship?.deadline) return null;
    const today = new Date();
    const deadline = new Date(scholarship.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [scholarship?.deadline]);

  const isDeadlineNear = useMemo(() => {
    return (
      daysUntilDeadline !== null &&
      daysUntilDeadline <= 30 &&
      daysUntilDeadline > 0
    );
  }, [daysUntilDeadline]);

  const isDeadlinePassed = useMemo(() => {
    return daysUntilDeadline !== null && daysUntilDeadline < 0;
  }, [daysUntilDeadline]);

  const handleShare = useCallback(async () => {
    if (!scholarship) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: scholarship.title,
          text: scholarship.description,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowToast({
        message: "Link copied to clipboard",
        type: "success",
      });
    }
  }, [scholarship]);

  // Loading and error states
  if (isPending) return <Loading />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Scholarship
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ">
            {error.message}
          </p>
        </div>
      </div>
    );

  if (!scholarship)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            Scholarship Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            The scholarship you are looking for does not exist.
          </p>
        </div>
      </div>
    );

  // Safe defaults for optional fields
  const eligibleCountries = scholarship.eligibleCountries || [];
  const documentsRequired = scholarship.documentsRequired || [];

  return (
    <>
      <DigitalCursor />

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={showToast.message}
            type={showToast.type}
            onClose={() => setShowToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}

      <div className="relative min-h-screen w-full pb-20 lg:pb-0">
        {/* Full viewport background pattern and linears */}
        <div className="fixed inset-0 w-full h-full bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-0">
          <div
            className="absolute inset-0 opacity-30 dark:opacity-20"
            style={{
              backgroundImage: `
                linear-linear(rgba(106, 186, 225, 0.1) 1px, transparent 1px),
                linear-linear(90deg, rgba(106, 186, 225, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "min(4vw, 40px) min(4vw, 40px)",
              backgroundPosition: "center center",
            }}
          />
          <motion.div
            className="absolute top-[5%] left-[5%] w-[30%] h-[30%] min-w-[37.5] min-h-37.5 max-w-75 max-h-75 bg-[#6ABAE1]/10 rounded-sm blur-3xl"
            animate={{
              x: ["0%", "5%", "0%"],
              y: ["0%", "3%", "0%"],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] min-w-50 min-h-50 max-w-100 max-h-100 bg-purple-600/10 rounded-sm blur-3xl"
            animate={{
              x: ["0%", "-5%", "0%"],
              y: ["0%", "-3%", "0%"],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-[#6ABAE1]/5 to-transparent" />
        </div>
        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8 z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
            id="overview"
          >
            {/* Title Row with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center  gap-3 sm:gap-4 mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white pr-0 whitespace-normal">
                {scholarship.title}
              </h1>
              <div className="flex justify-end items-center gap-2 w-full">
 
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={'/login'}
                    className="flex items-center justify-center gap-2 bg-linear-to-r from-[#6ABAE1] to-purple-600 text-white px-4 py-2 rounded-sm text-sm  hover:shadow-sm transition-all group"
                  >
                    Apply Now
                    <Icons.External className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="p-2 rounded-sm border border-gray-200 dark:border-gray-700 hover:border-[#6ABAE1] transition-colors relative group"
                  aria-label="Share scholarship"
                >
                  <Icons.Share className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Share
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Status Chips */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <FeatureChip
                text={
                  scholarship.type.charAt(0).toUpperCase() +
                  scholarship.type.slice(1).toLowerCase()
                }
                icon={<Icons.Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                color="info"
                size="sm"
              />
              <FeatureChip
                text={
                  scholarship.level.charAt(0).toUpperCase() +
                  scholarship.level.slice(1).toLowerCase()
                }
                icon={<Icons.Award className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                color="success"
                size="sm"
              />
              {!scholarship.isActive && (
                <FeatureChip
                  text="Inactive"
                  icon={
                    <Icons.Lightning className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  }
                  color="warning"
                  size="sm"
                />
              )}
              {isDeadlineNear && !isDeadlinePassed && (
                <FeatureChip
                  text="Deadline Approaching"
                  icon={<Icons.Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  color="warning"
                  size="sm"
                />
              )}
              {isDeadlinePassed && (
                <FeatureChip
                  text="Deadline Passed"
                  icon={<Icons.Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  color="warning"
                  size="sm"
                />
              )}
            </div>

            {/* Deadline Alert */}
            {isDeadlineNear && !isDeadlinePassed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 sm:mb-4 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-sm"
              >
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <Icons.Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="text-xs sm:text-sm font-medium ">
                    Deadline approaching! {daysUntilDeadline} days remaining (
                    {formatRelativeTime(scholarship.deadline)})
                  </span>
                </div>
              </motion.div>
            )}

            {/* Action Buttons - Hidden on mobile (shown in bottom nav) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scholarship.brochureFile && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={scholarship.brochureFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gray-600 text-white px-6 py-3 rounded-sm text-sm hover:bg-gray-700 transition-all"
                  >
                    Download Brochure
                    <Icons.Document className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
            <StatCard
              icon={<Icons.Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              label="Deadline"
              value={formatDate(scholarship.deadline)}
            />
            <StatCard
              icon={<Icons.University className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              label="Universities"
              value={scholarship.universities.length}
            />
            <StatCard
              icon={<Icons.Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              label="Eligible Countries"
              value={eligibleCountries.length || scholarship.country.length}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Description */}
              <div id="requirements">
                <InfoCard
                  icon={<Icons.Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  title="Description"
                  index={0}
                  accent
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed ">
                    {scholarship.description}
                  </p>
                </InfoCard>
              </div>

              {/* Requirements */}
              <InfoCard
                icon={<Icons.Document className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                title="Requirements"
                index={1}
                accent
              >
                <div className="space-y-3 sm:space-y-4">
                  <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed ">
                    {scholarship.requirements}
                  </p>

                  {(scholarship.minGPA || scholarship.ageLimit) && (
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {scholarship.minGPA && (
                        <div className="bg-[#6ABAE1]/5 rounded-sm p-2 sm:p-3 border border-[#6ABAE1]/20">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Minimum GPA
                          </span>
                          <p className="text-base sm:text-lg font-semibold text-[#6ABAE1] ">
                            {scholarship.minGPA}
                          </p>
                        </div>
                      )}
                      {scholarship.ageLimit && (
                        <div className="bg-[#6ABAE1]/5 rounded-sm p-2 sm:p-3 border border-[#6ABAE1]/20">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Age Limit
                          </span>
                          <p className="text-base sm:text-lg font-semibold text-[#6ABAE1] ">
                            {scholarship.ageLimit}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Field of Study */}
              <InfoCard
                icon={<Icons.Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                title="Fields of Study"
                index={2}
              >
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {scholarship.fieldOfStudy.map((field, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="bg-[#6ABAE1]/10 text-[#6ABAE1] px-2 sm:px-3 py-1 rounded-sm text-xs sm:text-sm border border-[#6ABAE1]/30 "
                    >
                      {field}
                    </motion.span>
                  ))}
                </div>
              </InfoCard>

              {/* Documents Required */}
              {documentsRequired.length > 0 && (
                <div id="documents">
                  <InfoCard
                    icon={
                      <Icons.Document className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    }
                    title="Required Documents"
                    index={3}
                  >
                    <ul className="space-y-1.5 sm:space-y-2">
                      {documentsRequired.map((doc, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm"
                        >
                          <Icons.Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6ABAE1] shrink-0 mt-0.5" />
                          <span className="">{doc}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </InfoCard>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4 sm:space-y-6" id="details">
              {/* Universities */}
              <InfoCard
                icon={
                  <Icons.University className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                }
                title="Universities"
                index={4}
              >
                <ul className="space-y-1.5 sm:space-y-2">
                  {scholarship.universities.map((uni, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-xs sm:text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-sm bg-[#6ABAE1] shrink-0 mt-1.5" />
                      <span className="">{uni}</span>
                    </motion.li>
                  ))}
                </ul>
              </InfoCard>

              {/* Location */}
              <InfoCard
                icon={<Icons.Location className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                title="Location"
                index={5}
              >
                <div className="space-y-1.5 sm:space-y-2">
                  <p className="text-xs sm:text-sm ">
                    <span className="font-medium">Countries:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-300">
                      {scholarship.country.join(", ")}
                    </span>
                  </p>
                  {scholarship.region && (
                    <p className="text-xs sm:text-sm ">
                      <span className="font-medium">Region:</span>{" "}
                      <span className="text-gray-600 dark:text-gray-300">
                        {scholarship.region}
                      </span>
                    </p>
                  )}
                </div>
              </InfoCard>

              {/* Eligible Countries */}
              {eligibleCountries.length > 0 && (
                <InfoCard
                  icon={<Icons.Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  title="Eligible Countries"
                  index={6}
                >
                  <div className="flex flex-wrap gap-1 text-xs sm:text-sm">
                    {eligibleCountries.map((country, index) => (
                      <span
                        key={index}
                        className="text-gray-600 dark:text-gray-300 "
                      >
                        {country}
                        {index < eligibleCountries.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Important Dates */}
              <InfoCard
                icon={<Icons.Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                title="Important Dates"
                index={7}
              >
                <div className="space-y-2 sm:space-y-3">
                  <div
                    className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-sm border ${
                      isDeadlinePassed
                        ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        : isDeadlineNear
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                          : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">
                      Deadline
                    </span>
                    <div className="text-left sm:text-right">
                      <span
                        className={`text-xs sm:text-sm font-semibold block  ${
                          isDeadlinePassed
                            ? "text-gray-600 dark:text-gray-400"
                            : isDeadlineNear
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {formatDate(scholarship.deadline)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(scholarship.deadline)}
                      </span>
                    </div>
                  </div>

                  {scholarship.startDate && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-sm border border-blue-200 dark:border-blue-800">
                      <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                        Start Date
                      </span>
                      <div className="text-left sm:text-right">
                        <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold block ">
                          {formatDate(scholarship.startDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Application Fee */}
              {scholarship.applicationFee > 0 && (
                <InfoCard
                  icon={
                    <Icons.Lightning className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  }
                  title="Application Fee"
                  index={8}
                >
                  <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white ">
                    {formatCurrency(
                      scholarship.applicationFee,
                      scholarship.currency,
                    )}
                  </p>
                </InfoCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipDetails;
