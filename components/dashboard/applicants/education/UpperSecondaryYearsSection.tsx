"use client";

import { motion } from "framer-motion";
import { FormInput } from "./FormInput";
import { PeriodEndDateRow } from "./PeriodEndDateRow";
import type { EducationFormData } from "@/types/application";
import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

const Icons = {
  Book: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  University: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 21h16" />
      <path d="M4 11l8-7 8 7" />
      <path d="M6 11v8" />
      <path d="M10 11v8" />
      <path d="M14 11v8" />
      <path d="M18 11v8" />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
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
};

type Props = {
  register: UseFormRegister<EducationFormData>;
  watch: UseFormWatch<EducationFormData>;
  errors?: FieldErrors<Record<string, unknown>>;
};

export function UpperSecondaryYearsSection({ register, watch, errors }: Props) {
  const labels = ["Year 1", "Year 2", "Year 3"] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6 border border-dashed border-gray-300 dark:border-[#064e78] rounded-sm"
    >
      <div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          Upper secondary years (optional detail)
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Some institutions require each of the three upper-secondary years
          separately. If that applies to you, fill all three rows below.
        </p>
      </div>

      {labels.map((defaultLabel, index) => {
        const prefix = `upperSecondaryYears.${index}` as const;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- discriminated union form errors
        const rowErrors = (errors as any)?.upperSecondaryYears?.[index];
        return (
          <div
            key={prefix}
            className="p-4 border border-gray-200 dark:border-[#064e78] rounded-sm space-y-4"
          >
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Upper-secondary year {index + 1}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Year / grade label"
                type="text"
                id={`${prefix}.yearLabel`}
                placeholder={defaultLabel}
                required
                register={register}
                error={rowErrors?.yearLabel}
                icon={<Icons.Book className="w-4 h-4" />}
              />
              <FormInput
                label="Institution name"
                type="text"
                id={`${prefix}.institutionName`}
                placeholder="School or institute"
                required
                register={register}
                error={rowErrors?.institutionName}
                icon={<Icons.University className="w-4 h-4" />}
              />
              <FormInput
                label="Field of study (optional)"
                type="text"
                id={`${prefix}.fieldOfStudy`}
                placeholder="Stream / focus"
                register={register}
                error={rowErrors?.fieldOfStudy}
                icon={<Icons.Book className="w-4 h-4" />}
              />
              <FormInput
                label="Start date"
                type="date"
                id={`${prefix}.startDate`}
                placeholder=""
                required
                register={register}
                error={rowErrors?.startDate}
                icon={<Icons.Calendar className="w-4 h-4" />}
              />
              <PeriodEndDateRow
                prefix={prefix}
                endFieldName="endDate"
                endLabel="End date"
                register={register}
                watch={watch}
                endDateError={rowErrors?.endDate}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
