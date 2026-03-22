"use client";

import type { FieldError, Path, UseFormRegister, UseFormWatch } from "react-hook-form";
import { FormInput } from "./FormInput";
import type { EducationFormData } from "@/types/application";

const CalendarIcon = ({ className }: { className?: string }) => (
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
);

type EndFieldName = "graduationDate" | "endDate";

type PeriodEndDateRowProps = {
  prefix: string;
  endFieldName: EndFieldName;
  endLabel: string;
  register: UseFormRegister<EducationFormData>;
  watch: UseFormWatch<EducationFormData>;
  endDateError?: FieldError;
};

export function PeriodEndDateRow({
  prefix,
  endFieldName,
  endLabel,
  register,
  watch,
  endDateError,
}: PeriodEndDateRowProps) {
  const path = `${prefix}.currentlyStudying` as Path<EducationFormData>;
  const currentlyStudying = Boolean(watch(path));
  const endId = `${prefix}.${endFieldName}`;

  return (
<div className="md:col-span-1 grid grid-cols-1 items-start gap-2">
  <FormInput
    label={endLabel}
    type="date"
    id={endId}
    placeholder=""
    required={false}
    register={register}
    error={endDateError}
    disabled={currentlyStudying}
    icon={<CalendarIcon className="w-4 h-4" />}
  />

  <div className="flex items-center mt-1">
    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
      <input
        type="checkbox"
        className="rounded border-gray-300 dark:border-[#064e78] text-[#00A3FF] focus:ring-[#00A3FF]"
        {...register(path, { valueAsBoolean: true } as never)}
      />
      <span className="select-none">I am currently studying here</span>
    </label>
  </div>
</div>
  );
}
