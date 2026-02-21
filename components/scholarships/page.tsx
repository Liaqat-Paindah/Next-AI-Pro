"use client";
import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  MapPin,
  Sparkles,
  Trophy,
  Star,
  GraduationCap,
  Award,
  Clock,
  Share2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Loading from "@/app/loading";
import { usescholarshipsLimit } from "@/hooks/useSchalorships";

// Define TypeScript interface for scholarship data
interface Scholarship {
  _id: string;
  type: string;
  title: string;
  description: string;
  country: string;
  deadline: string;
  region: string;
  level: string;
  value?: string;
  university?: string;
  field?: string[];
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6 }
  })
};

// Scholarship Badge
const ScholarshipBadge = ({ type }: { type: string }) => {
  const isFull = type === "fully funded";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium
          ${
            isFull
              ? "bg-linear-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              : "bg-linear-to-r from-amber-500/10 to-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
          }
        `}
      >
        {isFull ? <Trophy className="w-3 h-3" /> : <Star className="w-3 h-3" />}
        {isFull ? "Fully Funded" : "Partial"}
      </motion.div>
    </motion.div>
  );
};

// Value Indicator with capitalized level
const ValueIndicator = ({ value }: { value: string }) => {
  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 2 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-[#00A3FF] border border-[#00A3FF]/30"
    >
      <Award className="w-3.5 h-3.5" />
      <span>{capitalizedValue}</span>
    </motion.div>
  );
};

// Main Component
export default function NexusScholarships() {
  const { data: scholarshipsData, isPending, error } = usescholarshipsLimit();

  // Ensure scholarships is always an array
  const scholarships = useMemo(() => {
    if (!scholarshipsData) return [];
    if (Array.isArray(scholarshipsData)) return scholarshipsData;
    if (scholarshipsData.data && Array.isArray(scholarshipsData.data)) {
      return scholarshipsData.data;
    }
    if (
      scholarshipsData.scholarships &&
      Array.isArray(scholarshipsData.scholarships)
    ) {
      return scholarshipsData.scholarships;
    }
    return [];
  }, [scholarshipsData]);

  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedScholarships((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const daysRemaining = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return days > 0 ? days : 0;
  };

  // Loading state
  if (isPending) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 lg:px-6 font-sans antialiased"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-red-500 to-red-600 rounded-sm opacity-30 blur" />
            <div className="relative bg-white dark:bg-[#011b2b] border border-red-200 dark:border-red-900/30 rounded-sm p-4 sm:p-6 text-center">
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-red-700 dark:text-red-400 mb-1 sm:mb-2">
                Failed to Load Scholarships
              </h3>
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-300 mb-3 sm:mb-4">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-sm text-xs sm:text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // No data state
  if (!scholarships || scholarships.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 lg:px-6 font-sans antialiased"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-30" />
            <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-gray-700 rounded-sm p-8 sm:p-12 text-center">
              <GraduationCap className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                No Scholarships Available
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Check back later for new opportunities.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <section className="w-full py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 lg:px-6 xl:px-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10"
        >
          <motion.h1
            custom={1}
            variants={textVariants}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 md:mb-3"
          >
            Recent Global{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00A3FF] to-[#7000FF]">
              Scholarships
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light px-2 sm:px-4"
          >
            Access fully funded opportunities at world-renowned universities
            and transform your educational future with our digital platform.
          </motion.p>
        </motion.div>

        {/* Scholarship Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {scholarships.map((scholarship: Scholarship, index: number) => (
            <motion.div
              key={scholarship._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="relative group h-full"
            >
              {/* Digital border effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur" />

              <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-gray-700 rounded-sm p-3 sm:p-4 h-full flex flex-col">
                {/* Top accent with corner markers */}
                <div className="relative mb-2 sm:mb-3">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 border-t-2 border-l-2 border-[#00A3FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 border-t-2 border-r-2 border-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Header with badges */}
                  <div className="flex items-start justify-between gap-2">
                    <ScholarshipBadge type={scholarship.type} />
                    <button
                      onClick={() => toggleSave(scholarship._id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors"
                      aria-label="Save scholarship"
                    >
                      <Star
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                          savedScholarships.includes(scholarship._id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {scholarship.title}
                </h3>

                {/* University */}
                {scholarship.university && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 line-clamp-1">
                    {scholarship.university}
                  </p>
                )}

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                  {scholarship.description}
                </p>

                {/* Level - Capitalized */}
                {scholarship.level && (
                  <div className="mb-2">
                    <ValueIndicator value={scholarship.level} />
                  </div>
                )}

                {/* Meta Info Grid - Responsive */}
                <div className="grid grid-cols-2 gap-1 sm:gap-1.5 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1 text-xs p-1 sm:p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 shrink-0" />
                    <span className="truncate text-xs">{scholarship.country}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs p-1 sm:p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-sm text-gray-600 dark:text-gray-400">
                    <CalendarDays className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 shrink-0" />
                    <span className="truncate text-xs">
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs p-1 sm:p-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-sm col-span-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 shrink-0" />
                    <span className="text-xs">{daysRemaining(scholarship.deadline)} days remaining</span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action Buttons - Responsive */}
                <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2 pt-1.5 sm:pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button className="flex-1 flex items-center justify-center gap-1 text-white text-xs font-medium py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] hover:from-[#0096f0] hover:to-[#6600e6] transition-all">
                    Apply Now
                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </button>
                  <button 
                    className="p-1.5 sm:p-2 border border-gray-200 dark:border-gray-700 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Share scholarship"
                  >
                    <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Digital scan line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}