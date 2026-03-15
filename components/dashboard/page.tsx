"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  Target,
  Send,
  Mail,
  UserCheck,
  FileCheck,
  Sparkles,
  AlertCircle,
  Download,
  FileText,
  Circle,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Stage {
  key: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: React.ElementType;
  fileAvailable?: boolean;
  estimatedTime?: string;
  recommendation?: string;
}

const stages: Stage[] = [
  {
    key: "information_submission",
    title: "Information Submission",
    shortDescription: "Submit your academic details",
    description:
      "Submit all required information based on your education level (High School, Bachelor's, Master's, or PhD)",
    icon: FileCheck,
    fileAvailable: true,
    estimatedTime: "15-20 min",
    recommendation: "Ensure all academic transcripts and identification documents are ready before starting this stage.",
  },
  {
    key: "eligibility_assessment",
    title: "Eligibility Assessment",
    shortDescription: "Check your qualification",
    description:
      "Your profile will be evaluated against international scholarship requirements and criteria",
    icon: UserCheck,
    fileAvailable: true,
    estimatedTime: "2-3 days",
    recommendation: "Review scholarship criteria carefully and highlight achievements that match their requirements.",
  },
  {
    key: "eligibility_alignment",
    title: "Eligibility Alignment",
    shortDescription: "Match requirements",
    description:
      "Align your qualifications with minimum scholarship requirements through targeted improvements",
    icon: Target,
    fileAvailable: true,
    estimatedTime: "3-5 days",
    recommendation: "Focus on addressing any gaps in your qualifications and strengthen key areas.",
  },
  {
    key: "competitive_enhancement",
    title: "Competitive Enhancement",
    shortDescription: "Boost your profile",
    description:
      "Strengthen your profile to increase competitiveness for international scholarships",
    icon: TrendingUp,
    fileAvailable: true,
    estimatedTime: "1-2 weeks",
    recommendation: "Consider adding new achievements or improving language test scores to stand out.",
  },
  {
    key: "application_customization",
    title: "Application Customization",
    shortDescription: "Personalize applications",
    description:
      "Customize your applications to align with each scholarship's specific goals and values",
    icon: Sparkles,
    fileAvailable: true,
    estimatedTime: "3-4 days",
  },
  {
    key: "application_submission",
    title: "Application Submission",
    shortDescription: "Submit applications",
    description:
      "Submit your completed scholarship applications through the official portals",
    icon: Send,
    fileAvailable: true,
    estimatedTime: "1-2 hours",
  },
  {
    key: "post_submission_followup",
    title: "Post-Submission Follow-Up",
    shortDescription: "Track and follow up",
    description:
      "Engage in follow-up actions to increase visibility and demonstrate continued interest",
    icon: Mail,
    fileAvailable: true,
    estimatedTime: "Ongoing",
  },
];

// Progress data type
interface ProgressData {
  [key: string]: {
    completed: boolean;
    completedAt?: string;
  };
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

// Skeleton Loader
const ScholarshipTrackerSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="rounded-sm border border-gray-200 dark:border-[#064e78] overflow-hidden bg-white dark:bg-[#011b2b] w-full max-w-4xl mx-auto"
  >
    <div className="p-6 border-b border-gray-200 dark:border-[#064e78]">
      <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse" />
    </div>
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"
        />
      ))}
    </div>
  </motion.div>
);

// Error Boundary Component
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
        <div className="rounded-sm border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              Something went wrong loading scholarship tracker
            </p>
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
  onDownload: () => void;
  completedAt?: string;
}) => {
  const Icon = stage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        border border-gray-200 dark:border-[#064e78] rounded-sm
        ${isCompleted 
          ? "bg-green-50/30 dark:bg-green-900/5 border-green-200 dark:border-green-800" 
          : "bg-white dark:bg-[#011b2b]"
        }
        hover:border-[#00A3FF] dark:hover:border-[#00A3FF] transition-all duration-300
      `}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between px-4 sm:px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#064e78]/20 transition-colors"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Status Icon - Always has colors */}
          <div
            className={`
            w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center
            ${
              isCompleted
                ? "bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-[#064e78]"
            }
          `}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#00A3FF] dark:text-[#00A3FF]" />
            )}
          </div>

          {/* Title and Short Description */}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
              Stage {index + 1}: {stage.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {stage.shortDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {stage.estimatedTime && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-sm text-xs text-gray-600 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{stage.estimatedTime}</span>
            </div>
          )}
          <motion.button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
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
            <div className="px-4 sm:px-6 pb-6 pt-2">
              <div className="ml-12 sm:ml-14 space-y-4">
                {/* Full Description */}
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {stage.description}
                </p>


                {/* File Download Section */}
                {stage.fileAvailable && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-[#064e78]">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="w-4 h-4 text-[#00A3FF]" />
                      <span className="text-xs sm:text-sm font-medium">
                        Stage {index + 1} Guidelines
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onDownload}
                      className="flex items-center justify-center gap-2 px-4 py-1.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm text-xs hover:opacity-90 transition-opacity"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </motion.button>
                  </div>
                )}

                {/* Completion Info */}
                {completedAt && (
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-2 rounded-sm">
                    <CheckCircle2 className="w-3 h-3" />
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

// Main Component
const ScholarshipTracker = ({
  isLoading = false,
  onError,
}: {
  isLoading?: boolean;
  onError?: (error: Error) => void;
}) => {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // Progress data - Only Information Submission is completed
  const [progress] = useState<ProgressData>({
    information_submission: { completed: true, completedAt: "2024-01-15" },
    eligibility_assessment: { completed: false },
    eligibility_alignment: { completed: false },
    competitive_enhancement: { completed: false },
    application_customization: { completed: false },
    application_submission: { completed: false },
    post_submission_followup: { completed: false },
  });

  const completedCount = Object.values(progress).filter(
    (p) => p.completed,
  ).length;
  const totalStages = stages.length;
  const progressPercentage = (completedCount / totalStages) * 100;

  const currentStageIndex = stages.findIndex(
    (_, index) => !progress[stages[index].key]?.completed,
  );

  const handleStageToggle = (stageKey: string) => {
    setExpandedStage(expandedStage === stageKey ? null : stageKey);
  };

  const handleDownload = (stageKey: string) => {
    console.log("Downloading guidelines for:", stageKey);
    // In production, this would download actual files
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${stageKey}_guidelines.pdf`;
    link.click();
  };

  if (isLoading) {
    return <ScholarshipTrackerSkeleton />;
  }

  return (
    <ErrorBoundary onError={onError}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-sm border border-gray-200 dark:border-[#064e78] overflow-hidden bg-white dark:bg-[#011b2b] w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-[#064e78]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Scholarship Attainment Framework
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Track your scholarship application journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-sm">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {completedCount}/{totalStages} Completed
                </span>
              </div>
              <div className="px-3 py-1.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm">
                <span className="text-xs font-semibold text-white">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">
                Overall Progress
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute h-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
              />
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="relative flex justify-between mt-8 px-2">
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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`
                      w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-sm flex items-center justify-center
                      border-2 transition-all duration-300 cursor-pointer
                      ${
                        isCompleted
                          ? "border-[#00A3FF] bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                          : isCurrent
                            ? "border-[#00A3FF] bg-[#00A3FF]/10"
                            : "border-gray-300 dark:border-[#064e78] bg-white dark:bg-[#011b2b]"
                      }
                    `}
                      onClick={() => handleStageToggle(stage.key)}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <Circle
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${isCurrent ? "text-[#00A3FF]" : "text-gray-400 dark:text-gray-600"}`}
                        />
                      )}
                    </motion.div>

                    {/* Connection Line */}
                    {index < stages.length - 1 && (
                      <div className="absolute top-4 sm:top-5 left-[60%] w-full h-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{
                            width: progress[stages[index + 1].key]?.completed
                              ? "100%"
                              : "0%",
                          }}
                          className="h-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Stage Title - Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-2 py-1 rounded-sm pointer-events-none z-10">
                    {stage.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stages List */}
        <div className="p-6">
          <div className="flex flex-col gap-3">
            {stages.map((stage, index) => (
              <StageItem
                key={stage.key}
                stage={stage}
                index={index}
                isCompleted={progress[stage.key]?.completed || false}
                isExpanded={expandedStage === stage.key}
                onToggle={() => handleStageToggle(stage.key)}
                onDownload={() => handleDownload(stage.key)}
                completedAt={progress[stage.key]?.completedAt}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default ScholarshipTracker;