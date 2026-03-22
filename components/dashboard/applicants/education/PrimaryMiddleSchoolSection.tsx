"use client";

import { motion } from "framer-motion";
import { HighSchoolEducation as K12SchoolForm } from "./HighSchoolSection";
import type { EducationFormData } from "@/types/application";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<EducationFormData>;
  watch: UseFormWatch<EducationFormData>;
  /** Loose typing: form is a discriminated union; paths vary by level */
  errors?: FieldErrors<Record<string, unknown>>;
  /** Show Associate (14th) question + optional form (PHD, Master, Bachelor, Associate) */
  showAssociateBlock: boolean;
  /** Show middle school K-12 block */
  showMiddleSchoolBlock: boolean;
};

export function PrimaryMiddleSchoolSection({
  register,
  watch,
  errors,
  showAssociateBlock,
  showMiddleSchoolBlock,
}: Props) {
  const hasAssociate = watch("hasAssociate14thDegree");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {showAssociateBlock && (
        <div className="p-6 border border-gray-200 dark:border-[#064e78] rounded-sm space-y-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Do you have a 14th Grade (Associate) degree?
          </p>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                value="yes"
                className="border-gray-300 dark:border-[#064e78] text-[#00A3FF] focus:ring-[#00A3FF]"
                {...register("hasAssociate14thDegree")}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                value="no"
                className="border-gray-300 dark:border-[#064e78] text-[#00A3FF] focus:ring-[#00A3FF]"
                {...register("hasAssociate14thDegree")}
              />
              No
            </label>
          </div>
          {errors?.hasAssociate14thDegree && (
            <p className="text-xs text-red-500">
              {errors.hasAssociate14thDegree.message as string}
            </p>
          )}

          {hasAssociate === "yes" && (
            <K12SchoolForm
              prefix="primarySchool"
              register={register}
              watch={watch}
              errors={errors?.primarySchool}
              heading="14th Grade (Associate) information"
              subheading="Provide your Associate / 14th grade details."
              showFinalExam={false}
            />
          )}
        </div>
      )}

      {showMiddleSchoolBlock && (
        <K12SchoolForm
          prefix="middleSchool"
          register={register}
          watch={watch}
          errors={errors?.middleSchool}
          heading="Middle school"
          subheading="Required: indicate your middle-level schooling."
        />
      )}
    </motion.div>
  );
}
