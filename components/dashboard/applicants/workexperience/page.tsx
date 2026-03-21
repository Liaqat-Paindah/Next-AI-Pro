"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useActivities } from "@/hooks/useApplication";
import { Activity } from "@/types/workExperience";
import { FileUpload } from "@/components/shared/drop_zone";

const activityOptions = [
  {
    value: "work_experience",
    label: "Work Experience",
  },
  { value: "internship", label: "Internship" },
  {
    value: "volunteer",
    label: "Volunteer Activities",
  },
  {
    value: "public_welfare",
    label: "Participation in Public Welfare Activities",
  },
  {
    value: "media_activities",
    label: "Media Activities such as publishing articles, interviews, etc.",
  },
  {
    value: "community_awareness",
    label: "Community Awareness Activities",
  },
  {
    value: "social_organizations",
    label: "Membership, Establishment, or Leadership of Social Organizations",
  },
  {
    value: "awards",
    label: "Awards and Certificates Received",
  },
  {
    value: "other",
    label: "Others Activities",
  },
  { value: "no_activity", label: "No Activity" },
];

// Icons for the form
const Icons = {
  Activity: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  Add: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Remove: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
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
  Upload: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};

export default function ActivitiesUpload() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const [activities, setActivities] = useState<Activity[]>([
    { type: "", file: null },
  ]);

  const { mutate, isPending } = useActivities();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (isPending || status === "loading") {
    return <Loading />;
  }

  const addActivity = () => {
    setActivities([...activities, { type: "", file: null }]);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof Activity,
    value: string | File | null,
  ) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const handleFileAccepted = (index: number, file: File) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], file };
    setActivities(updated);
  };

  const handleFileRemove = (index: number) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], file: null };
    setActivities(updated);
  };

  const handleSubmit = () => {
    if (!userSession?.user?._id) return;

    // Check if "No Activity" is selected in any activity
    const hasNoActivity = activities.some((a) => a.type === "no_activity");

    if (hasNoActivity) {
      // If "No Activity" is selected, send empty activities array
      mutate({
        userId: userSession.user._id as string,
        activities: [],
      });
      return;
    }

    // Filter out empty activities and send the rest
    const validActivities = activities.filter(
      (a) => a.type !== "" && a.type !== "no_activity",
    );

    mutate({
      userId: userSession.user._id as string,
      activities: validActivities,
    });
  };
  // Check if form is valid for submission
  const isValidForSubmission = () => {
    if (activities.length === 0) return false;
    const hasNoActivity = activities.some((a) => a.type === "no_activity");

    if (hasNoActivity) return true;
    return activities.some((activity) => activity.type !== "");
  };

  const requiresAttachment = (activityType: string) => {
    return (
      activityType && activityType !== "" && activityType !== "no_activity"
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                  Activities & Work Experiences
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your professional and social activities
                </p>
              </div>

              {/* Activities Section */}
              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative border border-gray-200 dark:border-[#064e78] rounded-sm p-6 space-y-4"
                  >
                    {/* Activity Number */}
                    <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-[#011b2b] text-xs font-medium text-[#00A3FF]">
                      Activity {index + 1}
                    </div>

                    {/* Remove Button */}
                    {activities.length > 1 && (
                      <motion.button
                        type="button"
                        onClick={() => removeActivity(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute -top-3 right-4 px-2 py-0.5 bg-white dark:bg-[#011b2b] text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 border border-gray-200 dark:border-[#064e78] rounded-sm"
                      >
                        <Icons.Remove className="w-3 h-3" />
                        Remove
                      </motion.button>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      {/* Activity Type */}
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Activity Type
                          <span className="text-[#00A3FF] ml-1">*</span>
                        </label>
                        <select
                          value={activity.type}
                          onChange={(e) => {
                            handleChange(index, "type", e.target.value);
                          }}
                          className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
                        >
                          <option value="">Select Activity</option>
                          {activityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Upload Document - Only show if activity requires attachment */}
                      {requiresAttachment(activity.type) && (
                        <FileUpload
                          id={`file-upload-${index}`}
                          label="Upload Document"
                          onFileAccepted={(file) =>
                            handleFileAccepted(index, file)
                          }
                          onFileRemove={() => handleFileRemove(index)}
                          currentFile={activity.file || undefined}
                          icon={<Icons.Upload className="w-4 h-4" />}
                          accept={{
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                              [".docx"],
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Add Activity Button - Only show if no "No Activity" is selected */}
                {!activities.some((a) => a.type === "no_activity") && (
                  <motion.button
                    type="button"
                    onClick={addActivity}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative group"
                  >
                    <div className="relative px-4 py-3 bg-white dark:bg-[#011b2b] border border-[#00A3FF] rounded-sm text-[#00A3FF] text-sm flex items-center justify-center gap-2">
                      <Icons.Add className="w-4 h-4" />
                      Add Another Activity
                    </div>
                  </motion.button>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                <motion.button
                  type="button"
                  onClick={() => window.history.back()}
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
