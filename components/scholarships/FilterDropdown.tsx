import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, ChevronRight } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  displayCount?: number;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  icon,
  displayCount = 12 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayedOptions = showAll ? options : options.slice(0, displayCount);
  const hasMore = options.length > displayCount;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle option selection
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setShowAll(false);
  };

  // Get display value
  const getDisplayValue = () => {
    if (!value) return `All ${label}`;
    
    // Format special cases
    if (label === 'Type' && value === 'fully funded') return 'Fully Funded';
    if (label === 'Type' && value === 'partial') return 'Partial';
    return value;
  };

  return (
    <div className="relative min-w-40" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm
          flex items-center justify-between gap-2 transition-all
          ${value 
            ? 'border-[#005B96] text-[#005B96] dark:text-[#9bcaf6]' 
            : 'border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-gray-600'
          }
          ${isOpen ? 'ring-2 ring-[#005B96]/20 border-[#005B96]' : ''}
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {icon}
          <span className="truncate">{getDisplayValue()}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform  ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-100 overflow-y-auto min-w-max max-w-[90vw]"
          >
            {/* All option */}
            <button
              onClick={() => handleSelect('')}
              className={`
                w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-gray-700
                border-b border-slate-200 dark:border-gray-700
                ${!value ? 'bg-slate-100 dark:bg-gray-700 text-[#005B96] font-medium' : 'text-slate-600 dark:text-slate-400'}
              `}
            >
              <span className="flex items-center justify-between">
                All {label}
                {!value && <Check className="w-4 h-4" />}
              </span>
            </button>

            {/* Options */}
            <div className="py-1">
              {displayedOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100 dark:hover:bg-gray-700
                    flex items-center justify-between gap-4
                    ${value === option ? 'bg-slate-100 dark:bg-gray-700 text-[#005B96] font-medium' : 'text-slate-700 dark:text-slate-300'}
                  `}
                >
                  <span className="whitespace-normal">
                    {label === 'Type' && option === 'fully funded' ? 'Fully Funded' : 
                     label === 'Type' && option === 'partial' ? 'Partial' : option}
                  </span>
                  {value === option && <Check className="w-4 h-4 " />}
                </button>
              ))}
            </div>

            {/* Show more/less buttons */}
            {hasMore && (
              <div className="border-t border-slate-200 dark:border-gray-700">
                {!showAll ? (
                  <button
                    onClick={() => setShowAll(true)}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#005B96] hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Show {options.length - displayCount} more
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAll(false)}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#005B96] hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                    Show less
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};