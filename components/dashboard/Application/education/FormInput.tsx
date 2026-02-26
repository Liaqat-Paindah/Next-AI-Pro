// app/education/FormInput.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FormInputProps } from "@/types/application";
import type { FieldValues, Path } from "react-hook-form";

export const FormInput = <T extends FieldValues>({
  label,
  type,
  id,
  placeholder,
  required,
  register,
  error,
  disabled,
  icon,
  options,
}: FormInputProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const fieldId = id as Path<T>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label
        htmlFor={id as string}
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        {type === "select" ? (
          <select
            id={id as string}
            {...register(fieldId)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
              error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
            } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light appearance-none ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id as string}
            {...register(fieldId, type === "number" ? { valueAsNumber: true } : {})}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
              error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
            } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        )}

        {/* Digital Underline Effect */}
        {!disabled && (
          <motion.div
            className="absolute -bottom-px left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message as string}</p>
      )}
    </motion.div>
  );
};
