"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  X, 
  Filter, 
  Star, 
  Trophy, 
  GraduationCap, 
  MapPin, 
  Award,
  AlertCircle 
} from "lucide-react";
import { useSearchScholarship } from "@/hooks/useSchalorships";
import { useDebounce } from "@/hooks/useDebounce";
import { useScholarshipFilters } from "@/hooks/useScholarshipFilters";
import { FilterDropdown } from "@/components/scholarships/FilterDropdown";
import { ActiveFilterTag } from "@/components/scholarships/ActiveFilterTag";
import { ScholarshipCard } from "@/components/scholarships/ScholarshipCard";
import { MobileFilterModal } from "@/components/scholarships/MobileFilterModal";
import Loading from "@/app/loading";

export default function NexusScholarships() {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch scholarships
  const {
    data: scholarshipsData,
    isPending,
    error,
    refetch,
  } = useSearchScholarship(debouncedSearch);

  // Filter state and logic
  const {
    filters,
    filterOptions,
    savedScholarships,
    filteredScholarships,
    activeFilterCount,
    activeFilters,
    toggleSave,
    handleFilterChange,
    removeFilter,
    clearFilters,
  } = useScholarshipFilters(scholarshipsData);

  // Calculate days remaining
  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
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
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
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
        {/* Header */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#005B96] to-purple-600  bg-clip-text text-transparent">
            Global Scholarships
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Access fully funded opportunities at world-renowned universities
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search scholarships by title, university, field, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005B96] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className={`
                lg:hidden px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2
                ${
                  activeFilterCount > 0
                    ? "bg-[#005B96] text-white border-[#005B96]"
                    : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300"
                }
              `}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white text-[#005B96] text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Filter Row - Desktop */}
        <div className="hidden lg:flex lg:flex-wrap items-center gap-3 mb-4">
          <FilterDropdown
            label="Type"
            value={filters.type}
            options={filterOptions.types}
            onChange={(value) => handleFilterChange("type", value)}
            icon={<Trophy className="w-4 h-4" />}
            displayCount={2}
          />

          <FilterDropdown
            label="Level"
            value={filters.level}
            options={filterOptions.levels}
            onChange={(value) => handleFilterChange("level", value)}
            icon={<GraduationCap className="w-4 h-4" />}
            displayCount={12}
          />


<FilterDropdown
  label="Country"
  value={filters.country}
  options={filterOptions.countries || []}
  onChange={(value) => handleFilterChange("country", value)}
  icon={<MapPin className="w-4 h-4" />}
  displayCount={12}
/>

<FilterDropdown
  label="Field"
  value={filters.fieldOfStudy}
  options={filterOptions.fields || []}
  onChange={(value) => handleFilterChange("fieldOfStudy", value)}
  icon={<Award className="w-4 h-4" />}
  displayCount={12}
/>


        </div>

        {/* Mobile horizontal filter row removed to rely on modal button */}

        {/* Active Filters Row */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 py-3 mb-2"
          >
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Active filters:
            </span>
            {activeFilters.map((filter:any) => (
              <ActiveFilterTag
                key={filter.key}
                label={filter.label}
                onRemove={() => removeFilter(filter.key)}
              />
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-[#005B96] hover:text-[#03396C] dark:text-[#9bcaf6] dark:hover:text-[#005B96] underline ml-2"
            >
              Clear all
            </button>
          </motion.div>
        )}

  
        {/* Mobile Filter Modal */}
        <MobileFilterModal
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Scholarship Grid */}
        <div className="mt-6">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredScholarships.map((scholarship: any) => (
              <ScholarshipCard
                key={scholarship._id}
                scholarship={scholarship}
                isSaved={savedScholarships.includes(scholarship._id)}
                onToggleSave={toggleSave}
                daysRemaining={getDaysRemaining(scholarship.deadline)}
              />
            ))}
          </motion.div>

          {/* No results message */}
          {filteredScholarships.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-slate-200 dark:border-gray-700"
            >
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                No scholarships found matching your criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#005B96] text-white text-sm rounded hover:bg-[#03396C] transition-colors"
              >
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}