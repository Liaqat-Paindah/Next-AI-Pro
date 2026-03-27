import { Application } from "@/types/application_details";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  ExternalLink,
  FolderOpen,
  ClipboardList,
} from "lucide-react";

interface ActivitiesTabProps {
  data: Application["activities"];
}

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

const activityLabelMap = activityOptions.reduce(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<string, string>,
);

const NO_ACTIVITY_VALUES = new Set(["no_activity", "none"]);

const normalizeType = (type: string | undefined) =>
  (type || "").trim().toLowerCase();

const getActivityLabel = (type: string) => {
  const normalizedType = normalizeType(type);
  if (NO_ACTIVITY_VALUES.has(normalizedType)) {
    return "No Activity";
  }
  return activityLabelMap[normalizedType] || type;
};

const buildFileUrl = (fileUrl?: string | null) => {
  if (!fileUrl) return null;
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;

  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseURL) {
    return fileUrl;
  }

  const safeBase = baseURL.replace(/\/+$/, "");
  const safePath = fileUrl.replace(/^\/+/, "");
  return `${safeBase}/${safePath}`;
};

const ActivitiesTab = ({ data }: ActivitiesTabProps) => {
  const activities = Array.isArray(data) ? data : [];

  const meaningfulActivities = activities.filter(
    (activity) => !NO_ACTIVITY_VALUES.has(normalizeType(activity?.type)),
  );

  const workExperiences = meaningfulActivities.filter(
    (activity) => normalizeType(activity?.type) === "work_experience",
  );

  const otherActivities = meaningfulActivities.filter(
    (activity) => normalizeType(activity?.type) !== "work_experience",
  );

  const hasAnyActivity = meaningfulActivities.length > 0;

  if (!hasAnyActivity) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Activities Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added work experience or activity details yet.
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
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Work Experience & Activities
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional experiences and extracurricular activities
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        {workExperiences.length > 0 && (
          <ActivitySection
            title="Work Experience"
            items={workExperiences}
            icon={<Briefcase className="h-4 w-4 text-[#00A3FF]" />}
          />
        )}

        {otherActivities.length > 0 && (
          <ActivitySection
            title="Activities"
            items={otherActivities}
            icon={<FolderOpen className="h-4 w-4 text-[#00A3FF]" />}
          />
        )}

        <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
        </div>
      </motion.div>
    </div>
  );
};

const ActivitySection = ({
  title,
  items,
  icon,
}: {
  title: string;
  items: Application["activities"];
  icon: React.ReactNode;
}) => {
  return (
    <div className="px-6 sm:px-8 py-8 border-b border-gray-200 dark:border-white/10 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
          {icon}
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((activity, index) => {
          const fileUrl = buildFileUrl(activity.fileUrl);
          return (
            <motion.div
              key={`${activity.type}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative overflow-hidden rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-4 transition-all duration-300 hover:border-[#00A3FF]/30 hover:shadow-lg hover:shadow-[#00A3FF]/5"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Activity Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white ">
                    {getActivityLabel(activity.type)}
                  </p>
                </div>

                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/25"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesTab;
