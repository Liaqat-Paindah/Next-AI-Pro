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
  SlidersHorizontal,
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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Scholarship Badge
const ScholarshipBadge = ({
  type,
  featured,
}: {
  type: string;
  featured?: boolean;
}) => {
  const isFull = type === "fully funded";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 flex-wrap"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded
          ${
            isFull
              ? "bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              : "bg-linear-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
          }
        `}
      >
        {isFull ? <Trophy className="w-3 h-3" /> : <Star className="w-3 h-3" />}
        {isFull ? "Fully Funded" : "Partial"}
      </motion.div>
      {featured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded text-[#03396C] dark:text-[#03396C] border border-[#03396C] dark:border-[#03396C]"
        >
          <Sparkles className="w-3 h-3" />
          FEATURED
        </motion.div>
      )}
    </motion.div>
  );
};

// Value Indicator
const ValueIndicator = ({ value }: { value: string }) => (
  <motion.div
    whileHover={{ scale: 1.01, x: 2 }}
    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-[#03396C] dark:text-[#9bcaf6] border border-[#03396C] dark:border-[#03396C]"
  >
    <Award className="w-3.5 h-3.5" />
    <span>{value}</span>
  </motion.div>
);

// Main Component
export default function NexusScholarships() {
  const { data: scholarshipsData, isPending, error } = usescholarshipsLimit();

  // Ensure scholarships is always an array
  const scholarships = useMemo(() => {
    // If data is null/undefined, return empty array
    if (!scholarshipsData) return [];

    // If data is already an array, return it
    if (Array.isArray(scholarshipsData)) return scholarshipsData;

    // If data has a data property that is an array (common pattern)
    if (scholarshipsData.data && Array.isArray(scholarshipsData.data)) {
      return scholarshipsData.data;
    }

    // If data has a scholarships property that is an array
    if (
      scholarshipsData.scholarships &&
      Array.isArray(scholarshipsData.scholarships)
    ) {
      return scholarshipsData.scholarships;
    }
    return [];
  }, [scholarshipsData]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [sortBy] = useState<"deadline" | "value" | "applications">("deadline");

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

  // Advanced filter and search scholarships
  const filteredScholarships = useMemo(() => {
    // Ensure we're working with an array
    const scholarshipsArray = Array.isArray(scholarships) ? scholarships : [];

    if (scholarshipsArray.length === 0) return [];

    return scholarshipsArray
      .filter((scholarship: Scholarship) => {
        // Filter by category
        if (activeFilter !== "all") {
          if (activeFilter === "full" && scholarship.type !== "full")
            return false;
          if (activeFilter === "partial" && scholarship.type !== "partial")
            return false;
          if (scholarship.region === activeFilter) return true;
          if (scholarship.level === activeFilter) return true;
        }

        // Filter by saved only
        if (showSavedOnly) {
          return savedScholarships.includes(scholarship._id);
        }

        // Search query with advanced syntax
        if (searchQuery) {
          const query = searchQuery.toLowerCase();

          // Check for field-specific search
          if (query.startsWith("university:")) {
            const uniQuery = query.replace("university:", "").trim();
            return scholarship.university?.toLowerCase().includes(uniQuery);
          }
          if (query.startsWith("field:")) {
            const fieldQuery = query.replace("field:", "").trim();
            return scholarship.field?.some((f) =>
              f.toLowerCase().includes(fieldQuery),
            );
          }
          if (query.startsWith("country:")) {
            const locQuery = query.replace("country:", "").trim();
            return scholarship.country.toLowerCase().includes(locQuery);
          }

          // Regular search across all fields
          return (
            scholarship.title.toLowerCase().includes(query) ||
            scholarship.description.toLowerCase().includes(query) ||
            scholarship.university?.toLowerCase().includes(query) ||
            scholarship.field?.some((f) => f.toLowerCase().includes(query)) ||
            scholarship.country.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .sort((a: Scholarship, b: Scholarship) => {
        if (sortBy === "deadline") {
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        }
        return 0;
      });
  }, [
    scholarships,
    activeFilter,
    searchQuery,
    showSavedOnly,
    savedScholarships,
    sortBy,
  ]);

  // Loading state
  if (isPending) {
    return <Loading></Loading>;
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-6 px-4 sm:px-6 font-sans antialiased"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
              Failed to Load Scholarships
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
        className="min-h-screen py-6 px-4 sm:px-6 font-sans antialiased"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700">
            <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No Scholarships Available
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Check back later for new opportunities.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-6 px-4 sm:px-6 font-sans antialiased"
    >
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-2xl sm:text-3xl  text-center font-bold bg-linear-to-r from-[#005B96] via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Recent Global Scholarships
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access fully funded opportunities at world-renowned universities
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className=" overflow-hidden"
        >
          {/* Header with filters and search */}
          <div className="p-4 border-b border-slate-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
              <div className="flex items-center justify-between w-full lg:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Scholarship Grid - More Compact */}
          <div className="p-4">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {filteredScholarships.map((scholarship: Scholarship) => (
                <motion.div
                  key={scholarship._id}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="group relative border border-slate-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Top accent bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-0.5 ${
                      scholarship.type === "full"
                        ? "bg-linear-to-r from-emerald-600 to-emerald-500"
                        : "bg-linear-to-r from-amber-600 to-amber-500"
                    }`}
                  />

                  {/* Content - Compact padding */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <ScholarshipBadge type={scholarship.type} />
                      <button
                        onClick={() => toggleSave(scholarship._id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            savedScholarships.includes(scholarship._id)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Title - Compact */}
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-2">
                      {scholarship.title}
                    </h3>

                    {/* University */}
                    {scholarship.university && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {scholarship.university}
                      </p>
                    )}

                    {/* Description - Short */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {scholarship.description}
                    </p>

                    {/* Level */}
                    {scholarship.level && (
                      <div className="mb-2">
                        <ValueIndicator value={scholarship.level} />
                      </div>
                    )}

                    {/* Meta info - Compact grid */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      <div className="flex items-center gap-1 text-xs p-1.5 bg-slate-50 dark:bg-gray-800/50 rounded text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{scholarship.country}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs p-1.5 bg-slate-50 dark:bg-gray-800/50 rounded text-slate-600 dark:text-slate-400">
                        <CalendarDays className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span className="truncate px-2">
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs p-1.5 bg-slate-50 dark:bg-gray-800/50 rounded col-span-2 text-slate-600 dark:text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>
                          {daysRemaining(scholarship.deadline)} days left
                        </span>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Action buttons - Compact */}
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-100 dark:border-gray-700">
                      <button className="flex-1 flex items-center justify-center gap-1 text-white text-xs font-medium py-2 px-2.5 rounded bg-linear-to-r from-[#005B96] to-[#005B96] hover:from-[#03396C] hover:to-[#005B96] transition-all">
                        Apply
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button className="p-2 border border-slate-200 dark:border-gray-700 rounded hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors">
                        <Share2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* No results message */}
            {filteredScholarships.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No scholarships found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchQuery("");
                    setShowSavedOnly(false);
                  }}
                  className="mt-2 text-xs px-3 py-1.5 bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
