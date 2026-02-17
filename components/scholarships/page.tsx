'use client';
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  CalendarDays,
  MapPin,
  Sparkles,
  Trophy,
  Star,
  GraduationCap,
  Award,
  Clock,
  X,
  Share2,
  ExternalLink,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define TypeScript interface for scholarship data
interface Scholarship {
  id: string;
  type: "full" | "partial";
  title: string;
  description: string;
  locations: string[];
  deadline: string;
  region: "europe" | "asia" | "us" | "uk" | "canada" | "australia";
  level: "masters" | "phd" | "undergraduate" | "graduate" | "postdoc";
  value?: string;
  university?: string;
  field?: string[];
}

// Enhanced scholarship data with more variety
const scholarships: Scholarship[] = [
  {
    id: "europe-scholarships",
    type: "full",
    title: "European University Scholarships 2026",
    description: "Fully funded master's and PhD programs at top European universities including living stipend and research grants.",
    locations: ["Germany", "France", "Netherlands"],
    deadline: "March 15, 2026",
    region: "europe",
    level: "masters",
    value: "€45,000/year",
    university: "Multiple Universities",
  },
  {
    id: "us-fellowship",
    type: "partial",
    title: "US Graduate Fellowship Program",
    description: "Graduate fellowships covering tuition and living expenses at leading US institutions with mentorship opportunities.",
    locations: ["United States"],
    deadline: "April 30, 2026",
    region: "us",
    level: "graduate",
    value: "$35,000/year",
    university: "Various US Universities",
  },
  {
    id: "asia-excellence",
    type: "full",
    title: "Asian Excellence Awards",
    description: "Merit-based scholarships for undergraduate and graduate studies in Asia's premier universities.",
    locations: ["Japan", "South Korea", "Singapore"],
    deadline: "May 20, 2026",
    region: "asia",
    level: "undergraduate",
    value: "₩50,000,000/year",
    university: "Top Asian Universities",
  },
  {
    id: "uk-chevening",
    type: "full",
    title: "Chevening Scholarships 2026",
    description: "UK government's global scholarship program for future leaders and influencers.",
    locations: ["United Kingdom"],
    deadline: "November 5, 2025",
    region: "uk",
    level: "masters",
    value: "£40,000/year",
    university: "UK Universities",
  },
  {
    id: "canada-vanier",
    type: "full",
    title: "Vanier Canada Graduate Scholarships",
    description: "Attract and retain world-class doctoral students who demonstrate leadership skills.",
    locations: ["Canada"],
    deadline: "December 1, 2025",
    region: "canada",
    level: "phd",
    value: "CAD 50,000/year",
    university: "Canadian Universities",
  },
  {
    id: "australia-endeavour",
    type: "partial",
    title: "Australia Awards Scholarships",
    description: "Develop the skills and knowledge of individuals to drive change and influence development.",
    locations: ["Australia"],
    deadline: "January 31, 2026",
    region: "australia",
    level: "graduate",
    value: "AUD 30,000/year",
    university: "Australian Universities",
  }
];

// Filter categories with icons
const filterCategories = [
  { id: "all", label: "All Scholarships", icon: Sparkles },
  { id: "full", label: "Fully Funded", icon: Trophy },
  { id: "partial", label: "Partial Funding", icon: Star },
  { id: "masters", label: "Master's", icon: GraduationCap },
  { id: "phd", label: "PhD", icon: GraduationCap }
];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

// Filter Chip Component
const FilterChip = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  index = 0
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  index?: number;
}) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.03 }}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium
      transition-all duration-200 cursor-pointer rounded-sm
      ${active 
        ? "bg-linear-to-r from-[#005B96] to-[#005B96] text-white shadow-sm shadow-[#005B96]/30 border-0" 
        : "  border border-slate-200 dark:border-gray-700 hover: dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-600 text-slate-700 dark:text-slate-300"
      }
    `}
  >
    <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
    {label}
  </motion.button>
);

// Scholarship Badge
const ScholarshipBadge = ({ 
  type, 
  featured 
}: { 
  type: "full" | "partial", 
  featured?: boolean 
}) => {
  const isFull = type === "full";
  
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
          ${isFull
            ? "bg-linear-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            : "bg-linear-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
          }
        `}
      >
        {isFull ? <Trophy className="w-3 h-3" /> : <Star className="w-3 h-3" />}
        {isFull ? "FULLY FUNDED" : "PARTIAL"}
      </motion.div>
      {featured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded   text-[#03396C] dark:text-[#03396C] border border-[#03396C] dark:border-[#03396C]"
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
    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs   text-[#03396C] dark:text-[#9bcaf6] border border-[#03396C] dark:border-[#03396C]"
  >
    <Award className="w-3.5 h-3.5" />
    <span>{value}</span>
  </motion.div>
);

// Advanced Search Component
const AdvancedSearch = ({ 
  onSearch,
}: { 
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  totalResults: number;
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1 max-w-2xl" ref={searchRef}>
      {/* Search suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (searchInput || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1   rounded-lg border border-slate-200 dark:border-gray-700 shadow-lg overflow-hidden z-50"
          >
            {/* Recent searches */}
            {!searchInput && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium px-2 py-1 text-slate-500 dark:text-slate-400">Recent Searches</div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSearch(search);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm hover: dark:hover:bg-gray-700 rounded flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search suggestions based on input */}
            {searchInput && (
              <div className="p-2">
                <div className="text-xs font-medium px-2 py-1 text-slate-500 dark:text-slate-400">Suggestions</div>
                <button
                  onClick={() => {
                    handleSearch(`university:${searchInput}`);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover: dark:hover:bg-gray-700 rounded text-slate-700 dark:text-slate-300"
                >
                  Search in universities: <span className="font-medium">{searchInput}</span>
                </button>
                <button
                  onClick={() => {
                    handleSearch(`field:${searchInput}`);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover: dark:hover:bg-gray-700 rounded text-slate-700 dark:text-slate-300"
                >
                  Search in fields: <span className="font-medium">{searchInput}</span>
                </button>
                <button
                  onClick={() => {
                    handleSearch(`location:${searchInput}`);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover: dark:hover:bg-gray-700 rounded text-slate-700 dark:text-slate-300"
                >
                  Search in locations: <span className="font-medium">{searchInput}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
export default function NexusScholarships() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [sortBy] = useState<"deadline" | "value" | "applications">("deadline");

  const toggleSave = (id: string) => {
    setSavedScholarships(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const daysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Advanced filter and search scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter(scholarship => {
      // Filter by category
      if (activeFilter !== "all") {
        if (activeFilter === "full" && scholarship.type !== "full") return false;
        if (activeFilter === "partial" && scholarship.type !== "partial") return false;
        if (scholarship.region === activeFilter) return true;
        if (scholarship.level === activeFilter) return true;
      }
      
      // Search query with advanced syntax
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        
        // Check for field-specific search
        if (query.startsWith('university:')) {
          const uniQuery = query.replace('university:', '').trim();
          return scholarship.university?.toLowerCase().includes(uniQuery);
        }
        if (query.startsWith('field:')) {
          const fieldQuery = query.replace('field:', '').trim();
          return scholarship.field?.some(f => f.toLowerCase().includes(fieldQuery));
        }
        if (query.startsWith('location:')) {
          const locQuery = query.replace('location:', '').trim();
          return scholarship.locations.some(l => l.toLowerCase().includes(locQuery));
        }
        
        // Regular search across all fields
        return (
          scholarship.title.toLowerCase().includes(query) ||
          scholarship.description.toLowerCase().includes(query) ||
          scholarship.university?.toLowerCase().includes(query) ||
          scholarship.field?.some(f => f.toLowerCase().includes(query)) ||
          scholarship.locations.some(l => l.toLowerCase().includes(query))
        );
      }
      
      // Filter by saved only
      if (showSavedOnly) {
        return savedScholarships.includes(scholarship.id);
      }
      
      return true;
    }).sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });
  }, [activeFilter, searchQuery, showSavedOnly, savedScholarships, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen   py-6 px-4 sm:px-6 font-sans antialiased"
    >
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#005B96] via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Global Scholarships
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
          className=" dark:border-gray-700 overflow-hidden"
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

              {/* Advanced Search */}
              <AdvancedSearch 
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilter}
                activeFilter={activeFilter}
                totalResults={filteredScholarships.length}
              />
            </div>

            {/* Filter chips - desktop */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="hidden lg:flex flex-wrap gap-1.5 mt-3"
            >
              {filterCategories.map((filter, index) => (
                <FilterChip
                  key={filter.id}
                  icon={filter.icon}
                  label={filter.label}
                  active={activeFilter === filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Mobile filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-3 overflow-hidden"
                >
                  <div className="p-3   rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Filters</span>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {filterCategories.map((filter, index) => (
                        <FilterChip
                          key={filter.id}
                          icon={filter.icon}
                          label={filter.label}
                          active={activeFilter === filter.id}
                          onClick={() => {
                            setActiveFilter(filter.id);
                            setShowFilters(false);
                          }}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scholarship Grid - More Compact */}
          <div className="p-4">
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:p-8 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {filteredScholarships.map((scholarship) => (
                <motion.div
                  key={scholarship.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="group relative   border border-slate-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                    scholarship.type === "full"
                      ? "bg-linear-to-r from-emerald-600 to-emerald-500"
                      : "bg-linear-to-r from-amber-600 to-amber-500"
                  }`} />

                  {/* Content - Compact padding */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <ScholarshipBadge type={scholarship.type} />
                      <button
                        onClick={() => toggleSave(scholarship.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >

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

                    {/* Value */}
                    {scholarship.value && (
                      <div className="mb-2">
                        <ValueIndicator value={scholarship.value} />
                      </div>
                    )}

                    {/* Meta info - Compact grid */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      <div className="flex items-center gap-1 text-xs p-1.5   rounded text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{scholarship.locations[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs p-1.5   rounded text-slate-600 dark:text-slate-400">
                        <CalendarDays className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span className="truncate">{scholarship.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs p-1.5   rounded col-span-2 text-slate-600 dark:text-slate-400">
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
                      <button className="p-2 border border-slate-200 dark:border-gray-700 rounded hover: dark:hover:bg-gray-700 transition-colors">
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