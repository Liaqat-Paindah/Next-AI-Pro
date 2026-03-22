// components/education/BachelorEducation.tsx
"use client";

import { motion } from "framer-motion";
import type { Path } from "react-hook-form";
import { FormInput } from "./FormInput";
import { FileUpload } from "@/components/shared/drop_zone";
import { BachelorEducationProps, EducationFormData } from "@/types/application";
import { PeriodEndDateRow } from "./PeriodEndDateRow";

// Icons
const Icons = {
  Clock: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
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
  Education: ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

export const BachelorEducation = ({
  prefix,
  register,
  errors,
  onRemove,
  watch,
}: BachelorEducationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="relative p-6 border border-gray-200 dark:border-[#064e78] rounded-sm mb-6"
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
        Bachelor`s Degree Details
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Field of Study"
          type="text"
          id={`${prefix}.fieldOfStudy`}
          placeholder="Enter your field of study"
          required
          register={register}
          error={errors?.fieldOfStudy}
          icon={<Icons.Book className="w-4 h-4" />}
        />

        <FormInput
          label="Institution Name"
          type="text"
          id={`${prefix}.institutionName`}
          placeholder="Enter institution name"
          required
          register={register}
          error={errors?.institutionName}
          icon={<Icons.University className="w-4 h-4" />}
        />

        <FormInput
          label="Average Marks"
          type="number"
          id={`${prefix}.gpa`}
          placeholder="Enter Average Marks"
          required
          register={register}
          error={errors?.gpa}
          icon={<Icons.Education className="w-4 h-4" />}
        />

        <FormInput
          label="Academic Rank"
          type="text"
          id={`${prefix}.academicRank`}
          placeholder="Enter academic rank (optional)"
          register={register}
          error={errors?.academicRank}
        />

        <FormInput
          label="Start Date"
          type="date"
          id={`${prefix}.startDate`}
          placeholder=""
          required
          register={register}
          error={errors?.startDate}
          icon={<Icons.Calendar className="w-4 h-4" />}
        />

        {watch ? (
          <PeriodEndDateRow
            prefix={prefix}
            endFieldName="graduationDate"
            endLabel="Graduation date"
            register={register}
            watch={watch}
            endDateError={errors?.graduationDate}
          />
        ) : (
          <FormInput
            label="Graduation Date"
            type="date"
            id={`${prefix}.graduationDate`}
            placeholder=""
            required={false}
            register={register}
            error={errors?.graduationDate}
            icon={<Icons.Calendar className="w-4 h-4" />}
          />
        )}

        <FormInput
          label="Official Duration of the Bachelor's Program (In Yeas)"
          type="text"
          id={`${prefix}.academic_gap`}
          placeholder="Type in Year"
          required
          register={register}
          error={errors?.academic_gap}
          icon={<Icons.Clock className="w-4 h-4" />}
        />

        <FormInput
          label="Thesis Topic"
          type="text"
          id={`${prefix}.thesisTopic`}
          register={register}
          error={errors?.thesisTopic}
          placeholder="Enter thesis topic (optional)"
        />

        <FileUpload
          id={`${prefix}.thesisFile`}
          label="Upload Thesis"
          onFileAccepted={(file) => {
            register(
              `${prefix}.thesisFile` as Path<EducationFormData>,
            ).onChange({
              target: { name: `${prefix}.thesisFile`, value: file },
            });
          }}
          error={errors?.thesisFile?.message}
          icon={<Icons.Education className="w-4 h-4" />}
        />

        <FileUpload
          id={`${prefix}.diplomaFile`}
          label="Upload Diploma"
          onFileAccepted={(file) => {
            register(
              `${prefix}.diplomaFile` as Path<EducationFormData>,
            ).onChange({
              target: { name: `${prefix}.diplomaFile`, value: file },
            });
          }}
          error={errors?.diplomaFile?.message}
          icon={<Icons.Education className="w-4 h-4" />}
        />

        <FileUpload
          id={`${prefix}.transcriptFile`}
          label="Upload Transcript"
          onFileAccepted={(file) => {
            register(
              `${prefix}.transcriptFile` as Path<EducationFormData>,
            ).onChange({
              target: { name: `${prefix}.transcriptFile`, value: file },
            });
          }}
          error={errors?.transcriptFile?.message}
          icon={<Icons.Education className="w-4 h-4" />}
        />
      </div>
    </motion.div>
  );
};
