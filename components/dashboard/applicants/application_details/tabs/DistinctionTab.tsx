import { Application } from "@/types/application_details";
import {
  Award,
  DollarSign,
  Globe,
  GraduationCap,
  Target,
  Trophy,
  Lightbulb,
  BookOpen,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

interface DistinctionTabProps {
  distinction?: Application["distinction"];
  studyType?: Application["studyType"];
  goals?: Application["goals"];
}

const DistinctionTab = ({ distinction, studyType, goals }: DistinctionTabProps) => {
  const specialSkills = distinction?.specialSkills?.trim();
  const achievements = distinction?.achievements?.trim();
  const purposeOfEducation = goals?.purposeOfEducation?.trim();
  const postStudyPlan = goals?.postStudyPlan?.trim();
  const scholarshipOnly = Boolean(studyType?.scholarshipOnly);
  const privateStudyOption = Boolean(studyType?.privateStudyOption);
  const hasData = Boolean(
    specialSkills ||
      achievements ||
      scholarshipOnly ||
      privateStudyOption ||
      purposeOfEducation ||
      postStudyPlan,
  );

  if (!hasData) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <Award className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Study, Goals, or Distinction Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added study type, goals, or distinction details yet.
          </p>
        </div>
      </div>
    );
  }

  // Capitalize first letter function
  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Study Type, Goals & Distinction
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Funding preference, educational goals, special skills, and achievements
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Study Type Section - Two Column Layout */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
                <DollarSign className="h-5 w-5 text-[#00A3FF]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Funding Preference
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Study type and scholarship options
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Scholarship Only */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <GraduationCap className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Scholarship Only
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${
                        scholarshipOnly
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400"
                      }`}
                    >
                      {scholarshipOnly ? "Selected" : "Not selected"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Private Study Option */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Briefcase className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Private Study Option
                  </p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${
                        privateStudyOption
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400"
                      }`}
                    >
                      {privateStudyOption ? "Selected" : "Not selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals Section - Single Column Layout */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
                <Target className="h-5 w-5 text-[#00A3FF]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Educational Goals
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Purpose and future plans
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Purpose of Education */}
              <div className="flex items-start gap-3 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <BookOpen className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Purpose of Education
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                    {purposeOfEducation ? capitalizeFirstLetter(purposeOfEducation) : "Not specified"}
                  </p>
                </div>
              </div>

              {/* Post-Study Plan */}
              <div className="flex items-start gap-3 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Globe className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Post-Study Plan
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                    {postStudyPlan ? capitalizeFirstLetter(postStudyPlan) : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Distinction Section - Two Rows Layout */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
                <Trophy className="h-5 w-5 text-[#00A3FF]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Distinction
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Special skills and achievements
                </p>
              </div>
            </div>

            {/* Two Rows Layout for Special Skills and Achievements */}
            <div className="space-y-6">
              {/* Row 1 - Special Skills */}
              <div className="flex items-start gap-3 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Lightbulb className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Special Skills
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                    {specialSkills ? capitalizeFirstLetter(specialSkills) : "Not specified"}
                  </p>
                </div>
              </div>

              {/* Row 2 - Achievements */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Trophy className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Achievements
                  </p>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                    {achievements ? capitalizeFirstLetter(achievements) : "Not specified"}
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

export default DistinctionTab;