import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Filters, FilterOptions } from "@/types/scholarship";

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  filterOptions: FilterOptions;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  filterOptions,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Filters
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Scholarship Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => onFilterChange("type", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005B96]"
                  >
                    <option value="">All Types</option>
                    {filterOptions.types.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Education Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => onFilterChange("level", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005B96]"
                  >
                    <option value="">All Levels</option>
                    {filterOptions.levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => onFilterChange("country", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005B96]"
                  >
                    <option value="">All Countries</option>
                    {filterOptions.countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field Filter */}
                <div>
                  <label className="w-full block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Field of Study
                  </label>
                  <select
                    value={filters.fieldOfStudy}
                    onChange={(e) => onFilterChange("fieldOfStudy", e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005B96]"
                  >
                    <option value="">All Fields</option>
                    {filterOptions.fields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apply Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#005B96] text-white rounded-lg font-medium hover:bg-[#03396C] transition-colors"
                >
                  Apply Filters
                </button>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      onClearFilters();
                      onClose();
                    }}
                    className="w-full py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};