import { Application } from "@/types/application_details";
import { Heart, Stethoscope, Pill } from "lucide-react";
import { motion } from "framer-motion";

interface HealthTabProps {
  health?: Application["health"] | null;
}

const HealthTab = ({ health }: HealthTabProps) => {
  const specialDiseases = health?.specialDiseases?.trim();
  const disabilityNeeds = health?.disabilityNeeds?.trim();
  const hasAnyHealthInfo = Boolean(specialDiseases || disabilityNeeds);

  if (!hasAnyHealthInfo) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <Heart className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Health Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added any health details yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section with Professional Spacing */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Health Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Medical conditions and special needs
            </p>
          </div>
        </div>
      </div>

      {/* Health Info Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Special Diseases */}
            <div className="space-y-4">
              {/* Special Diseases */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Stethoscope className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Special Diseases
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {specialDiseases || "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Disability Needs */}
            <div className="space-y-4">
              {/* Disability Needs */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Pill className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Disability Needs
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {disabilityNeeds || "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Hover Effect */}
        <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
        </div>
      </motion.div>
    </div>
  );
};

export default HealthTab;
