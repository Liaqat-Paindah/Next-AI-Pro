"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  Download,
  Circle,
  Clock,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { Stage, stages } from "@/data/stage";
import Loading from "@/app/loading";
import { UseGetApplicants } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Types
interface ProgressData {
  [key: string]: {
    completed: boolean;
    completedAt?: string;
  };
}

interface EducationItem {
  level?: string;
  fieldOfStudy?: string;
  institutionName?: string;
  gpa?: number;
}

interface ApplicationData {
  _id?: string;
  userId?: string;
  stage?: string;
  status?: string;
  personal?: Record<string, unknown>;
  education?: EducationItem[];
  createdAt?: string;
  updatedAt?: string;
}

// Format date helper
const formatDate = (date?: string | null): string => {
  if (!date) return "N/A";
  const cleanedDate = date.replace(/\+00:00$/, "Z");
  const dateObj = new Date(cleanedDate);
  if (isNaN(dateObj.getTime()) || dateObj.getFullYear() <= 1) return "N/A";
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: {
    children: React.ReactNode;
    onError?: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative overflow-hidden rounded-sm border border-red-500/20 bg-linear-to-br from-red-500/10 to-red-600/5 p-6 backdrop-blur-sm dark:from-red-500/20 dark:to-red-600/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
          <div className="relative flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-red-500/20 dark:bg-red-500/30">
              <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
            </div>
            <div>
              <p className="font-medium text-red-400 dark:text-red-300">
                System Alert
              </p>
              <p className="text-sm text-red-400/80 dark:text-red-300/70">
                Failed to load scholarship tracker
              </p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Stage Item Component
const StageItem = ({
  stage,
  index,
  isCompleted,
  isExpanded,
  onToggle,
  onDownload,
  completedAt,
}: {
  stage: Stage;
  index: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onDownload: (filePath: string) => void;
  completedAt?: string;
}) => {
  const Icon = stage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        group relative overflow-hidden rounded-sm border transition-all duration-500
        ${
          isCompleted
            ? "border-[#00A3FF]/30 bg-linear-to-br from-[#00A3FF]/5 via-transparent to-[#7000FF]/5 dark:from-[#00A3FF]/10 dark:via-transparent dark:to-[#7000FF]/10"
            : "border-gray-200  hover:border-[#00A3FF]/30 dark:border-white/10  dark:hover:border-[#00A3FF]/30"
        }
        backdrop-blur-sm
      `}
    >
      {/* Animated Background linear */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-5 dark:group-hover:opacity-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-5" />

      {/* Header */}
      <div
        onClick={onToggle}
        className="relative flex cursor-pointer items-center justify-between px-6 py-4"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-4">
          {/* Status Icon with Glow Effect */}
          <div className="relative">
            <div
              className={`
                relative flex h-12 w-12 items-center justify-center rounded-sm
                ${
                  isCompleted
                    ? "bg-linear-to-br from-[#00A3FF] to-[#7000FF]"
                    : ""
                }
                transition-all duration-500 group-hover:scale-110
              `}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-6 w-6 text-white" />
              ) : (
                <Icon className="h-6 w-6 text-[#00A3FF]" />
              )}
            </div>
            {/* Glow Effect */}
            <div
              className={`
                absolute inset-0 -z-10 rounded-sm blur-xl transition-opacity duration-500
                ${
                  isCompleted
                    ? "bg-[#00A3FF]/30 dark:bg-[#00A3FF]/50"
                    : "bg-[#00A3FF]/10 opacity-0 group-hover:opacity-50 dark:bg-[#00A3FF]/20 dark:group-hover:opacity-100"
                }
              `}
            />
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              <span className="text-[#00A3FF]">Stage {index + 1}</span> ·{" "}
              {stage.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stage.shortDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {stage.estimatedTime && (
            <div className="hidden items-center gap-2 rounded-sm bg-gray-100 px-3 py-1.5 text-xs text-gray-700 dark:bg-white/5 dark:text-gray-300 sm:flex">
              <Clock className="h-4 w-4 text-[#00A3FF]" />
              <span>{stage.estimatedTime}</span>
            </div>
          )}
          <motion.button
            className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-100 text-gray-500 transition-colors  hover:text-gray-900 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative px-6 pb-6 pt-2">
              <div className="ml-16 space-y-4">
                {/* Full Description */}
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {stage.description}
                </p>

                {/* File Download Section */}
                {stage.fileAvailable && stage.filePath && (
                  <motion.button
                    onClick={() => onDownload(stage.filePath)}
                    className="group relative overflow-hidden rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] p-0.5"
                  >
                    <div className="relative flex items-center gap-2 rounded-sm px-6 py-2 transition-colors">
                      <Download className="h-4 w-4 text-white" />
                      <span className="text-xs text-white">
                        Download Guidelines
                      </span>
                    </div>
                  </motion.button>
                )}

                {/* Completion Info */}
                {completedAt && (
                  <div className="flex items-center gap-2 rounded-sm bg-green-50 px-4 py-2 text-xs text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Completed on {formatDate(completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to determine completed stages
const calculateProgress = (
  applicationData: ApplicationData | undefined,
): ProgressData => {
  if (!applicationData) return {};

  const currentStage = applicationData.stage || "information_submission";
  const createdAt = applicationData.createdAt;
  const updatedAt = applicationData.updatedAt;
  const currentStageIndex = stages.findIndex(
    (stage) => stage.key === currentStage,
  );

  const progress: ProgressData = {};

  stages.forEach((stage, index) => {
    if (index < currentStageIndex) {
      progress[stage.key] = {
        completed: true,
        completedAt: updatedAt || createdAt,
      };
    } else if (index === currentStageIndex) {
      progress[stage.key] = { completed: false };
    } else {
      progress[stage.key] = { completed: false };
    }
  });

  // Mark info submission complete if personal data exists
  if (
    applicationData.personal &&
    Object.keys(applicationData.personal).length > 0
  ) {
    progress.information_submission = {
      completed: true,
      completedAt: createdAt,
    };
  }

  return progress;
};

// Main Component
const ScholarshipTracker = ({
  isLoading = false,
  onError,
}: {
  isLoading?: boolean;
  onError?: (error: Error) => void;
}) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  const { data: userSession, status } = useSession();
  const userId = userSession?.user?._id;
  const { data: response, isPending } = UseGetApplicants(userId as string);
  const applicationData: ApplicationData | undefined = response?.data;

  const router = useRouter();

  const progress = useMemo(
    () => calculateProgress(applicationData),
    [applicationData],
  );

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");

    // Animate glow intensity
    const interval = setInterval(() => {
      setGlowIntensity(0.3 + Math.random() * 0.4);
    }, 2000);

    return () => clearInterval(interval);
  }, [status, router]);

  if (status === "loading" || isPending) return <Loading />;

  const completedCount = Object.values(progress).filter(
    (p) => p?.completed,
  ).length;
  const totalStages = stages.length;
  const progressPercentage = (completedCount / totalStages) * 100;

  const currentStageIndex = stages.findIndex(
    (stage) => !progress[stage.key]?.completed,
  );

  const handleStageToggle = (stageKey: string) => {
    setExpandedStage(expandedStage === stageKey ? null : stageKey);
  };
  const baseUrl = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseUrl) {
    console.error("The file URL is missing");
    return;
  }
  const handleDownload = (filePath: string) => {
    const link = document.createElement("a");
    link.href = `${baseUrl}/application_guidlines/${filePath}`;
    link.target = "_blank";
    link.click();
  };

  if (isLoading) return <Loading />;

  return (
    <ErrorBoundary onError={onError}>
      <div className="relative md:p-2">
        {/* Nexus Background Effects */}
        <div className="fixed inset-0 overflow-hidden">
          {/* linear Orbs - Light Mode */}
          <div className="absolute -left-1/4 top-0 h-125 w-125 rounded-full bg-[#00A3FF]/5 blur-[120px] dark:hidden" />
          <div className="absolute -right-1/4 bottom-0 h-125 w-125 rounded-full bg-[#7000FF]/5 blur-[120px] dark:hidden" />

          {/* linear Orbs - Dark Mode */}
          <div className="absolute -left-1/4 top-0 hidden h-125 w-125 rounded-full bg-[#00A3FF]/10 blur-[120px] dark:block" />
          <div className="absolute -right-1/4 bottom-0 hidden h-125 w-125 rounded-full bg-[#7000FF]/10 blur-[120px] dark:block" />

          {/* Scanning Line */}
          <motion.div
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#00A3FF]/30 to-transparent dark:via-[#00A3FF]/50"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto max-w-6xl"
        >
          {/* Main Container */}
          <div className="relative overflow-hidden rounded-sm border border-gray-200  backdrop-blur-sm dark:border-white/10 ">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/10 to-[#7000FF]/0 opacity-0 transition-opacity duration-1000 hover:opacity-100 dark:via-[#00A3FF]/20" />

            {/* Header */}
            <div className="relative border-b border-gray-200 p-8 dark:border-white/10">
              {/* Top Glow */}
              <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#00A3FF] to-transparent dark:via-[#00A3FF]" />

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute inset-0 -z-10 animate-pulse rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Scholarship
                      <span className="text-[#00A3FF]"> Attainment </span>
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Track your scholarship application journey
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] p-0.5">
                      <div className="rounded-sm bg-white px-6 py-2 dark:bg-black/90">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 -z-10 rounded-sm blur-lg"
                      style={{
                        background: `linear-linear(to right, #00A3FF, #7000FF)`,
                        opacity:
                          glowIntensity *
                          (typeof window !== "undefined" &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? 0.5
                            : 0.3),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Current Stage Indicator */}
              {applicationData?.stage && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-6 rounded-sm bg-linear-to-r from-[#00A3FF]/5 to-[#7000FF]/5 p-4 dark:from-[#00A3FF]/10 dark:to-[#7000FF]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#00A3FF]/10 dark:bg-[#00A3FF]/20">
                      <Cpu className="h-4 w-4 text-[#00A3FF]" />
                    </div>
                    <p className="text-xs text-[#00A3FF] dark:text-[#00A3FF]">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Active Stage:
                      </span>{" "}
                      {stages.find((s) => s.key === applicationData.stage)
                        ?.title || applicationData.stage}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    System Progress
                  </span>
                  <span className="font-mono text-[#00A3FF] dark:text-[#00A3FF]">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>

                <div className="relative h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative h-full rounded-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                  >
                    {/* Scanning Effect */}
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 w-20 bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-white/30"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Stage Indicators */}
              <div className="relative mt-6 sm:mt-8 md:mt-10 flex justify-between px-2 sm:px-4">
                {stages.map((stage, index) => {
                  const isCompleted = progress[stage.key]?.completed;
                  const isCurrent = index === currentStageIndex;

                  return (
                    <div
                      key={stage.key}
                      className="group relative flex-1 text-center"
                    >
                      <div className="relative inline-block">
                        {/* Stage Dot */}
                        <motion.button
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStageToggle(stage.key)}
                          className={`
              relative flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 
              items-center justify-center border border-[#7000FF] 
              rounded-sm transition-all duration-500
              ${
                isCompleted
                  ? "border-[#00A3FF] bg-linear-to-br from-[#00A3FF] to-[#7000FF]"
                  : isCurrent
                    ? "border-[#00A3FF] bg-[#00A3FF]/10 dark:bg-[#00A3FF]/20"
                    : "border border-[#7000FF] hover:border-[#00A3FF]/50 dark:border-[#7000FF] dark:hover:border-[#00A3FF]/50"
              }
            `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
                          ) : (
                            <Circle
                              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 ${
                                isCurrent
                                  ? "text-[#00A3FF]"
                                  : "text-[#7000FF] dark:text-[#7000FF]"
                              }`}
                            />
                          )}

                          {/* Pulse Effect for Current Stage */}
                          {isCurrent && !isCompleted && (
                            <span className="absolute inset-0 animate-ping rounded-sm bg-[#00A3FF]/20 dark:bg-[#00A3FF]/30" />
                          )}
                        </motion.button>

                        {/* Glow Effect */}
                        <div
                          className={`
              absolute inset-0 -z-10 rounded-sm blur-md sm:blur-lg md:blur-xl 
              transition-opacity duration-500
              ${
                isCompleted
                  ? "bg-[#00A3FF]/30 dark:bg-[#00A3FF]/50"
                  : isCurrent
                    ? "bg-[#00A3FF]/20 dark:bg-[#00A3FF]/30"
                    : "bg-transparent group-hover:bg-[#00A3FF]/10 dark:group-hover:bg-[#00A3FF]/20"
              }
            `}
                        />

                        {/* Optional: Stage Label - Visible on larger screens */}
                        <span className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400 sm:block md:text-sm"></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Stage Label - Separate row for stage names on mobile */}
              <div className="mt-8 flex justify-between px-2 sm:hidden">
                {stages.map((stage) => (
                  <div key={stage.key} className="flex-1 text-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400"></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stages List */}
            <div className="relative p-8">
              <div className="relative space-y-3">
                {stages.map((stage, index) => (
                  <StageItem
                    key={stage.key}
                    stage={stage}
                    index={index}
                    isCompleted={progress[stage.key]?.completed || false}
                    isExpanded={expandedStage === stage.key}
                    onToggle={() => handleStageToggle(stage.key)}
                    onDownload={handleDownload}
                    completedAt={progress[stage.key]?.completedAt}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default ScholarshipTracker;
