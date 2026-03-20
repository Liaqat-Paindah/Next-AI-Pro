"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  Download,
  Clock,
  CheckCircle2,
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

const stageMessages: Record<string, { title: string; message: string }> = {
  information_submission: {
    title: "Information Submission",
    message: "Please complete and submit all required information to proceed.",
  },
  eligibility_assessment: {
    title: "Eligibility Assessment",
    message:
      "Your profile is under review. Please wait while we assess your eligibility.",
  },
  eligibility_alignment: {
    title: "Eligibility Alignment",
    message: "Follow our guidance to meet the required eligibility criteria.",
  },
  competitive_enhancement: {
    title: "Competitive Enhancement",
    message: "Work on the recommended improvements to strengthen your profile.",
  },
  application_customization: {
    title: "Application Customization",
    message:
      "We are tailoring your application. Stay available for any required input.",
  },
  application_submission: {
    title: "Application Submission",
    message: "Your application is being prepared and submitted professionally.",
  },
  post_submission_followup: {
    title: "Post-Submission Follow-Up",
    message:
      "We are following up on your application. We will update you on any progress",
  },
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
        <div className="relative overflow-hidden rounded-sm border border-red-500/20 bg-linear-to-br from-red-500/10 to-red-600/5 p-4 backdrop-blur-sm dark:from-red-500/20 dark:to-red-600/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
          <div className="relative flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-red-500/20 dark:bg-red-500/30">
              <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400 dark:text-red-300">
                System Alert
              </p>
              <p className="text-xs text-red-400/80 dark:text-red-300/70">
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
  isCurrentStage,
}: {
  stage: Stage;
  index: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onDownload: (filePath: string) => void;
  completedAt?: string;
  isCurrentStage: boolean;
}) => {
  const Icon = stage.icon;

  // Determine status text and colors
  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        text: "Completed",
        bg: "border border-green-400 dark:bg-green-500/20",
        textColor: "text-green-700 dark:text-green-400",
        borderColor: "border-green-500/30",
        glowColor: "shadow-green-500/20",
        iconColor: "text-green-600 dark:text-green-400",
        iconComponent: CheckCircle2,
      };
    }
    if (isCurrentStage) {
      return {
        text: "In Progress",
        bg: "border border-green-400 dark:bg-green-500/20",
        textColor: "text-green-700 dark:text-green-700",
        borderColor: "border-green-500/30",
        glowColor: "shadow-green-700/20",
        iconColor: "text-green-600 dark:text-green-400",
        iconComponent: Clock,
      };
    }
    return {
      text: "Not Started",
      bg: "bg-gray-100 dark:bg-white/5",
      textColor: "text-gray-700 dark:text-gray-300",
      borderColor: "border-gray-200 dark:border-white/10",
      glowColor: "shadow-transparent",
      iconColor: "text-gray-400 dark:text-gray-500",
      iconComponent: Clock,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.iconComponent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        group relative overflow-hidden rounded-sm border transition-all duration-300
        ${statusInfo.borderColor}
        ${
          isCompleted
            ? `bg-linear-to-r from-green-50/80 to-emerald-50/80 dark:from-green-500/10 dark:to-emerald-500/10 shadow-sm ${statusInfo.glowColor}`
            : isCurrentStage
              ? "bg-linear-to-r from-green-20/80 to-blue-50/20 dark:from-blue-100/10 dark:to-blue-300/10"
              : ""
        }
        backdrop-blur-sm
        hover:shadow-md transition-shadow
      `}
    >
      {/* Completed Stage Overlay Effect */}
      {isCompleted && (
        <div className="absolute inset-0 bg-linear-to-r from-green-500/5 to-emerald-500/5 pointer-events-none" />
      )}

      {/* Header - Optimized for mobile touch */}
      <div
        onClick={onToggle}
        className="relative flex cursor-pointer items-center justify-between p-3 min-h-18 active:bg-black/5 dark:active:bg-white/5"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Status Icon - Updated to match EducationTab design */}
          <div className="relative shrink-0">
            <div
              className={`
                relative flex h-10 w-10 items-center justify-center rounded-sm
                transition-all duration-300 group-active:scale-95
                ${
                  isCompleted
                    ? "bg-linear-to-br from-green-500 to-emerald-600 shadow-sm shadow-green-500/30"
                    : isCurrentStage
                      ? "bg-linear-to-br from-green-300 to-emerald-400"
                      : "bg-gray-100 dark:bg-white/10"
                }
              `}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : (
                <Icon
                  className={`h-5 w-5 ${
                    isCurrentStage
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              )}
            </div>

            {/* Completed Badge */}
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <div className="h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
              </motion.div>
            )}
          </div>

          {/* Title and Description - Optimized for text wrapping */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1">
              <h3
                className={`text-sm font-semibold ${
                  isCompleted
                    ? "text-green-700 dark:text-green-400"
                    : isCurrentStage
                      ? "text-green-700 dark:text-green-100"
                      : "text-gray-900 dark:text-white"
                }`}
              >
                {stage.title}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 ml-2">
          {/* Status Badge - Compact for mobile */}
          <div
            className={`
              flex items-center gap-1 rounded-sm px-2 py-1
              ${statusInfo.bg} ${statusInfo.textColor}
            `}
          >
            <StatusIcon className={`h-3 w-3 ${statusInfo.iconColor}`} />
            <span className="text-xs font-medium">{statusInfo.text}</span>
          </div>

          <motion.button
            className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-500 transition-colors hover:text-gray-900 dark:bg-white/10 dark:text-gray-400 dark:hover:bg-white/20 dark:hover:text-white shrink-0"
            whileHover={{ scale: 1.05 }}
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

      {/* Expanded Content - Mobile optimized */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-4 pt-0">
              <div className="ml-2 space-y-3">
                {/* Full Description - Better text wrapping */}
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {stage.description}
                </p>

                {/* File Download Section - Full width on mobile */}
                {stage.fileAvailable && stage.filePath && (
                  <motion.button
                    onClick={() => onDownload(stage.filePath)}
                    className="w-full"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2 cursor-pointer rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] px-4 py-2 text-white active:opacity-90">
                      <Download className="h-4 w-4" />
                      <span className="text-xs">Download Guidelines</span>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to determine completed stages and current active stage
const calculateProgress = (
  applicationData: ApplicationData | undefined,
): {
  progress: ProgressData;
  nextStage: Stage | null;
  activeStageKey: string | null;
  hasValidStage: boolean;
} => {
  // If no application data, return empty progress with no active stage
  if (!applicationData) {
    return { progress: {}, nextStage: null, activeStageKey: null, hasValidStage: false };
  }

  const backendStage = applicationData.stage;
  const createdAt = applicationData.createdAt;
  const updatedAt = applicationData.updatedAt;
  
  // Check if the stage from backend exists and is valid
  const isValidStage = backendStage 
    ? stages.some((stage) => stage.key === backendStage)
    : false;

  const progress: ProgressData = {};

  // Initialize all stages as not completed
  stages.forEach((stage) => {
    progress[stage.key] = { completed: false };
  });

  // Only mark stages as completed if we have a valid stage from backend
  if (isValidStage && backendStage) {
    const currentStageIndex = stages.findIndex((stage) => stage.key === backendStage);
    
    // Mark all stages before current as completed
    stages.forEach((stage, index) => {
      if (index < currentStageIndex) {
        progress[stage.key] = {
          completed: true,
          completedAt: updatedAt || createdAt,
        };
      }
    });

    // Only mark information submission as completed if:
    // 1. The current stage is actually information_submission AND personal data exists, OR
    // 2. The current stage is past information_submission (already handled above)
    if (
      backendStage === "information_submission" &&
      applicationData.personal &&
      Object.keys(applicationData.personal).length > 0
    ) {
      progress.information_submission = {
        completed: true,
        completedAt: createdAt,
      };
    }
  } else {
    // If no valid stage, don't mark any stage as completed automatically
    // Only mark information submission if we have personal data AND no stage is set
    // This handles new users who haven't started the process
    if (
      !backendStage &&
      applicationData.personal &&
      Object.keys(applicationData.personal).length > 0
    ) {
      progress.information_submission = {
        completed: true,
        completedAt: createdAt,
      };
    }
  }

  // Find the first incomplete stage (this will be the next stage to work on)
  const firstIncompleteStage = stages.find((stage) => !progress[stage.key]?.completed);
  
  // Convert undefined to null for nextStage
  const nextStage = firstIncompleteStage || null;
  
  // Determine active stage:
  // - If we have a valid backend stage and it's not completed, show that as active
  // - If the backend stage is completed, show the next incomplete stage as active
  let activeStageKey = null;
  
  if (isValidStage && backendStage) {
    const isStageCompleted = progress[backendStage]?.completed || false;
    if (!isStageCompleted) {
      // Current stage is not completed, show it as active
      activeStageKey = backendStage;
    } else {
      // Current stage is completed, show the next incomplete stage as active
      activeStageKey = nextStage?.key || null;
    }
  } else if (!isValidStage && nextStage) {
    // If no valid stage from backend but we have an incomplete stage (like info submission with personal data)
    activeStageKey = nextStage.key;
  }

  return { 
    progress, 
    nextStage, 
    activeStageKey,
    hasValidStage: isValidStage 
  };
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
  const [, setGlowIntensity] = useState(0.5);

  const { data: userSession, status } = useSession();
  const userId = userSession?.user?._id;
  const { data: response, isPending } = UseGetApplicants(userId as string);
  const applicationData: ApplicationData | undefined = response?.data;

  const router = useRouter();

  const { progress, activeStageKey } = useMemo(
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

  const handleStageToggle = (stageKey: string) => {
    setExpandedStage(expandedStage === stageKey ? null : stageKey);
  };

  const baseUrl = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseUrl) {
    console.error("The file URL is missing");
    return null;
  }

  const handleDownload = (filePath: string) => {
    const link = document.createElement("a");
    link.href = `${baseUrl}/application_guidlines/${filePath}`;
    link.target = "_blank";
    link.click();
  };

  // Get current stage message - only if we have a valid active stage
  const currentStageMessage =
    activeStageKey && stageMessages[activeStageKey]
      ? stageMessages[activeStageKey]
      : null;

  if (isLoading) return <Loading />;

  return (
    <ErrorBoundary onError={onError}>
      <div className="relative">
        {/* Background Effects - Optimized for mobile */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-1/4 top-0 h-64 w-64 rounded-full bg-linear-to-r from-[#00A3FF]/5 to-[#7000FF]/5 blur-sm" />
          <div className="absolute -right-1/4 bottom-0 h-64 w-64 rounded-full bg-linear-to-r from-[#7000FF]/5 to-[#00A3FF]/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto max-w-sm md:max-w-2xl lg:max-w-4xl"
        >
          {/* Main Container */}
          <div className="relative overflow-hidden rounded-sm border backdrop-blur-sm dark:border-white/10 bg-white/80 dark:bg-gray-900/80">
            {/* Header with Progress Bar - Mobile optimized */}
            <div className="relative border-b border-gray-200 p-4 dark:border-white/10">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF] shadow-sm shadow-[#00A3FF]/20">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-base font-bold text-gray-900 dark:text-white">
                      Scholarship Framework
                    </h1>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Track your progress
                    </p>
                  </div>
                </div>

                {/* Progress Badge */}
                <div className="shrink-0">
                  <div className="rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] p-px">
                    <div className="rounded-sm px-3 py-1.5 bg-white dark:bg-gray-900">
                      <span className="text-xs font-medium bg-clip-text text-transparent bg-linear-to-r from-[#00A3FF] to-[#7000FF]">
                        {completedCount}/{totalStages}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Overall Progress
                  </span>
                  <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-[#00A3FF] to-[#7000FF]">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-linear-to-r from-[#00A3FF] to-[#7000FF] relative"
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Current Stage Message - Only shows when there's a valid active stage from backend */}
              {currentStageMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 p-3 rounded-sm bg-linear-to-r from-[#00A3FF]/10 to-[#7000FF]/10 border border-[#00A3FF]/20 dark:border-[#7000FF]/30"
                >
                  <div className="flex items-start space-x-2">
                    <div className="shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-[#00A3FF] animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">
                        {currentStageMessage.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {currentStageMessage.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Stages List - Optimized spacing for mobile */}
            <div className="p-3 sm:p-4">
              <div className="space-y-2">
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
                    isCurrentStage={
                      stage.key === activeStageKey
                    }
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