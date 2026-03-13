"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { StudyRequestData } from "@/types/studyRequest";
import { useStudyRequest } from "@/hooks/useApplication";

const Icons = {
  Scholarship: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      <path d="M12 22v-8" />
    </svg>
  ),
  Award: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Star: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Skills: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Achievement: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
      <path d="M12 15l-2-2 2-2 2 2-2 2z" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  ),
};

export default function StudyRequestPage() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const { mutate, isPending } = useStudyRequest();

  const [formData, setFormData] = useState<StudyRequestData>({
    scholarshipOnly: false,
    privateStudyOption: false,
    specialSkills: "",
    achievements: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || isPending) {
    return <Loading />;
  }

  const handleRadioChange = (
    field: "scholarshipOnly" | "privateStudyOption",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "yes",
    }));
  };

  const handleTextChange = (
    field: "specialSkills" | "achievements",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      formData.specialSkills.trim() !== "" &&
      formData.achievements.trim() !== ""
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
                  <Icons.Scholarship className="w-5 h-5 text-[#00A3FF]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                    Study Request & Story of Distinction
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Tell us about your study preferences and what makes you unique
                </p>
              </div>

              {/* SECTION 16 - Types of Study Requested */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* Scholarship Only */}
                <div className="space-y-3 pl-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Applying for Scholarship-Funded Study
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="scholarshipOnly"
                        value="yes"
                        checked={formData.scholarshipOnly === true}
                        onChange={(e) =>
                          handleRadioChange("scholarshipOnly", e.target.value)
                        }
                        className="w-4 h-4 text-[#00A3FF] focus:ring-[#00A3FF] border-gray-300 dark:border-[#064e78] dark:bg-[#011b2b]"
                        required
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Yes
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="scholarshipOnly"
                        value="no"
                        checked={formData.scholarshipOnly === false}
                        onChange={(e) =>
                          handleRadioChange("scholarshipOnly", e.target.value)
                        }
                        className="w-4 h-4 text-[#00A3FF] focus:ring-[#00A3FF] border-gray-300 dark:border-[#064e78] dark:bg-[#011b2b]"
                        required
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        No
                      </span>
                    </label>
                  </div>
                </div>

                {/* Private Study */}
                <div className="space-y-3 pl-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Applying for Private (Self-Funded) Study
                    <span className="text-[#00A3FF] ml-1">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="privateStudyOption"
                        value="yes"
                        checked={formData.privateStudyOption === true}
                        onChange={(e) =>
                          handleRadioChange("privateStudyOption", e.target.value)
                        }
                        className="w-4 h-4 text-[#00A3FF] focus:ring-[#00A3FF] border-gray-300 dark:border-[#064e78] dark:bg-[#011b2b]"
                        required
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Yes
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="privateStudyOption"
                        value="no"
                        checked={formData.privateStudyOption === false}
                        onChange={(e) =>
                          handleRadioChange("privateStudyOption", e.target.value)
                        }
                        className="w-4 h-4 text-[#00A3FF] focus:ring-[#00A3FF] border-gray-300 dark:border-[#064e78] dark:bg-[#011b2b]"
                        required
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        No
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* SECTION 17 - Story of Distinction */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 pt-4 border-t border-gray-200 dark:border-[#064e78]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icons.Award className="w-4 h-4 text-[#00A3FF]" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Story of Distinction and Excellence
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 pl-4">
                  If you have any special skills, abilities, achievements, or
                  unique experiences that distinguish you from others and give
                  you an advantage, please describe them below.
                </p>

                {/* Special Skills */}
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2">
                    <Icons.Skills className="w-4 h-4 text-[#00A3FF]" />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Special Skills and Abilities
                      <span className="text-[#00A3FF] ml-1">*</span>
                    </label>
                  </div>
                  <textarea
                    value={formData.specialSkills}
                    onChange={(e) =>
                      handleTextChange("specialSkills", e.target.value)
                    }
                    placeholder="Describe your special skills and abilities (e.g., languages, technical skills, leadership abilities)..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light resize-none"
                    required
                  />
                </div>

                {/* Achievements */}
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-2">
                    <Icons.Achievement className="w-4 h-4 text-[#00A3FF]" />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Special Achievements and Experiences
                      <span className="text-[#00A3FF] ml-1">*</span>
                    </label>
                  </div>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) =>
                      handleTextChange("achievements", e.target.value)
                    }
                    placeholder="Describe your achievements and unique experiences (e.g., awards, competitions, research, community service)..."
                    rows={4}
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light resize-none"
                    required
                  />
                </div>
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
