// components/shared/multi-select.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const Icons = {
  ChevronDown: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Close: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  label,
  required = false,
  icon,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const selectedLabels = selected
    .map((value) => options.find((opt) => opt.value === value)?.label)
    .filter(Boolean);

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-[#00A3FF] ml-1">*</span>}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-10.5 px-3 py-2 bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm cursor-pointer flex items-center justify-between"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selected.length > 0 ? (
            selectedLabels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#00A3FF]/10 text-[#00A3FF] text-xs rounded-sm"
              >
                {label}
                <button
                  onClick={(e) => removeOption(selected[index], e)}
                  className="hover:text-[#7000FF] transition-colors"
                >
                  <Icons.Close className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon || <Icons.ChevronDown className="w-4 h-4 text-gray-400" />}
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm shadow-lg"
          >
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#064e78] cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                    {selected.includes(option.value) && (
                      <Icons.Check className="w-4 h-4 text-[#00A3FF]" />
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400 text-center">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}