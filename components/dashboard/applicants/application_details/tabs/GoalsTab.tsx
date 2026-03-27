import { Application } from "@/types/application_details";
import { Target, GraduationCap, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface GoalsTabProps {
  goals: Application["goals"];
  preferences: Application["preferences"];
  distinction: Application["distinction"];
}

const GoalsTab = ({ goals }: GoalsTabProps) => {
  return (
    <div className="w-full">
      {/* Header Section with Professional Spacing */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Academic Goals
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Educational objectives and career aspirations
            </p>
          </div>
        </div>
      </div>

      {/* Goals Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          <div className="space-y-6">
            {/* Purpose of Education */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
                <GraduationCap className="h-5 w-5 text-[#00A3FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Purpose of Education
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  {goals.purposeOfEducation || "Not specified"}
                </p>
              </div>
            </div>

            {/* Post-Study Plan */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
                <Globe className="h-5 w-5 text-[#00A3FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Post-Study Plan
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                  {goals.postStudyPlan || "Not specified"}
                </p>
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

export default GoalsTab;
