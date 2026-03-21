// app/dashboard/applicants/academicPreferences/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { MultiSelect } from "@/components/shared/multi-select";
import { AcademicPreferencesData } from "@/types/academicPreferences";
import { useAcademicPreferences } from "@/hooks/useApplication";
import { countries, universities } from "@/data/countries";

const studyLevels = [
  { value: "high_school", label: "High School" },
  { value: "bachelor", label: "Bachelor Degree" },
  { value: "master", label: "Master Degree" },
  { value: "phd", label: "PHD" },
  { value: "postdoctoral", label: "Postdoctoral" },
];

// Icons
const Icons = {
  Academic: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Book: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Globe: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  University: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      <path d="M6 12v5a6 6 0 0 0 12 0v-5" />
    </svg>
  ),
};

export default function AcademicPreferencesPage() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const { mutate, isPending } = useAcademicPreferences();

  const [formData, setFormData] = useState<AcademicPreferencesData>({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    preferredCountries: [],
    preferredUniversities: [],
    studyLevel: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || isPending) {
    return <Loading />;
  }

  const handleFieldChange = (
    field: keyof Pick<
      AcademicPreferencesData,
      "field1" | "field2" | "field3" | "field4"
    >,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountriesChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      preferredCountries: selected,
    }));
  };

  const handleUniversitiesChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      preferredUniversities: selected,
    }));
  };

  const handleStudyLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      studyLevel: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!userSession?.user?._id) return;

    mutate({
      userId: userSession.user._id as string,
      ...formData,
    });
  };

  const isValidForSubmission = () => {
    return (
      formData.field1.trim() !== "" &&
      formData.field2.trim() !== "" &&
      formData.field3.trim() !== "" &&
      formData.field4.trim() !== "" &&
      formData.preferredCountries.length > 0 &&
      formData.studyLevel !== ""
    );
  };

  return (
    <section className="relative w-full overflow-hidden py-2">
      {/* Digital Grid Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 dark:bg-[#00A3FF]/5 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative container">
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 md:p-8 relative">
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-[#064e78] pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Academic className="w-5 h-5 text-[#00A3FF]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                    Academic Preferences
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your academic interests and preferences
                </p>
              </div>

              {/* Fields of Study */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Book className="w-4 h-4 text-[#00A3FF]" />
                  <label className="block font-medium text-gray-900 dark:text-white">
                    Preferred Fields of Study (in order of priority)
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="relative">
                      <input
                        name={`field${num}`}
                        placeholder={`${num}. ${num === 1 ? "First" : num === 2 ? "Second" : num === 3 ? "Third" : "Fourth"} Priority`}
                        value={
                          formData[
                            `field${num}` as keyof Pick<
                              AcademicPreferencesData,
                              "field1" | "field2" | "field3" | "field4"
                            >
                          ]
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            `field${num}` as keyof Pick<
                              AcademicPreferencesData,
                              "field1" | "field2" | "field3" | "field4"
                            >,
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                        required
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Preferred Countries */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Icons.Globe className="w-4 h-4 text-[#00A3FF]" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Countries
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>
                </div>
                <MultiSelect
                  options={countries}
                  selected={formData.preferredCountries}
                  onChange={handleCountriesChange}
                  placeholder="Select countries..."
                  required
                />
              </motion.div>

              {/* Preferred Universities */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Icons.University className="w-4 h-4 text-[#00A3FF]" />
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preferred Universities
                  </label>
                </div>
                <MultiSelect
                  options={universities}
                  selected={formData.preferredUniversities}
                  onChange={handleUniversitiesChange}
                  placeholder="Select universities (optional)"
                />
              </motion.div>

              {/* Study Level */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Level of Study
                  <span className="text-[#00A3FF] ml-1">*</span>
                </label>
                <select
                  value={formData.studyLevel}
                  onChange={handleStudyLevelChange}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                  required
                >
                  <option value="">Select Level</option>
                  {studyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                <motion.button
                  type="button"
                  onClick={() => router.back()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 relative group"
                >
                  <div className="relative px-4 py-2 bg-transparent border border-gray-300 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 hover:border-[#00A3FF] transition-colors">
                    <span>Back</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={!isValidForSubmission() || isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 relative group ${
                    !isValidForSubmission()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="relative px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-medium text-sm flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-sm"
                        />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <Icons.ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
