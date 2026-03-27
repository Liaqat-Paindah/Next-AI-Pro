import { Application } from "@/types/application_details";
import { Target } from "lucide-react";
import { motion } from "framer-motion";

interface PreferencesTabProps {
  preferences?: Application["preferences"];
}

const cleanList = (items?: string[]) =>
  (items || []).map((item) => item?.trim()).filter(Boolean) as string[];

const PreferenceGroup = ({
  label,
  items,
}: {
  label: string;
  items: string[];
}) => (
  <div className="pb-6 border-b border-gray-200 dark:border-white/10">
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
      {label}
    </p>
    {items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-sm bg-gray-100 dark:bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-800 dark:text-gray-200"
          >
            {item}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-600 dark:text-gray-400">Not specified</p>
    )}
  </div>
);

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
            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Target className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Preferences Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not set preference details yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8 space-y-6">
          <PreferenceGroup label="Preferred Fields" items={preferredFields} />
          <PreferenceGroup
            label="Preferred Countries"
            items={preferredCountries}
          />
          <PreferenceGroup
            label="Preferred Universities"
            items={preferredUniversities}
          />

          <div className="pb-6 border-b border-gray-200 dark:border-white/10">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Preferred Study Level
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {preferredStudyLevel || "Not specified"}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
        </div>
      </motion.div>
    </div>
  );
};

export default PreferencesTab;
