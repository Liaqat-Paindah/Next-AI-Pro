import { Application } from "@/types/application_details";
import { Target, GraduationCap, Globe, Building2, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface PreferencesTabProps {
  preferences?: Application["preferences"];
}

const cleanList = (items?: string[]) =>
  (items || []).map((item) => item?.trim()).filter(Boolean) as string[];

const PreferencesTab = ({ preferences }: PreferencesTabProps) => {
  const preferredFields = cleanList(preferences?.preferredFields);
  const preferredCountries = cleanList(preferences?.preferredCountries);
  const preferredUniversities = cleanList(preferences?.preferredUniversities);
  const preferredStudyLevel = preferences?.preferredStudyLevel?.trim();

  const hasData = Boolean(
    preferredFields.length > 0 ||
      preferredCountries.length > 0 ||
      preferredUniversities.length > 0 ||
      preferredStudyLevel,
  );

  if (!hasData) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <Target className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Preferences Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not set any study preference details yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
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
              Study Preferences
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Preferred fields, countries, universities, and study level
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Preferred Fields */}
              {preferredFields.length > 0 && (
                <PreferenceItem
                  icon={<BookOpen className="h-4 w-4 text-[#00A3FF]" />}
                  label="Preferred Fields of Study"
                  items={preferredFields}
                />
              )}

              {/* Preferred Study Level */}
              {preferredStudyLevel && (
                <StudyLevelItem
                  icon={<GraduationCap className="h-4 w-4 text-[#00A3FF]" />}
                  label="Preferred Study Level"
                  level={preferredStudyLevel}
                />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Preferred Countries */}
              {preferredCountries.length > 0 && (
                <PreferenceItem
                  icon={<Globe className="h-4 w-4 text-[#00A3FF]" />}
                  label="Preferred Countries"
                  items={preferredCountries}
                />
              )}

              {/* Preferred Universities */}
              {preferredUniversities.length > 0 && (
                <PreferenceItem
                  icon={<Building2 className="h-4 w-4 text-[#00A3FF]" />}
                  label="Preferred Universities"
                  items={preferredUniversities}
                />
              )}
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

// Preference Item Component for lists (tags)
const PreferenceItem = ({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
}) => {
  // Capitalize first letter of each item
  const capitalizedItems = items.map(item => 
    item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
  );

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          {label}
        </p>
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            {capitalizedItems.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="inline-flex items-center rounded-sm bg-[#00A3FF]/10 px-2.5 py-1.5 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Study Level Item Component
const StudyLevelItem = ({
  icon,
  label,
  level,
}: {
  icon: React.ReactNode;
  label: string;
  level: string;
}) => {
  // Capitalize first letter of study level
  const capitalizedLevel = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          {label}
        </p>
        <div className="mt-2">
          <span className="inline-flex items-center rounded-sm bg-[#00A3FF]/10 px-2.5 py-1.5 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20">
            {capitalizedLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;