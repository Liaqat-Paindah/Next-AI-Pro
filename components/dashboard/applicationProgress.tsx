"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle,
  GraduationCap,
  Beaker,
  Zap,
  Languages,
  Activity,
  Heart,
  Wallet,
  Target,
  Globe,
  FolderOpen,
  Phone,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  User
} from "lucide-react";
import { checkApplicationSteps, ApplicationSteps } from "@/lib/checkApplicationSteps";
import type { ScholarshipApplication } from "@/types/checkSteps";
import Loading from "@/app/loading";

interface ApplicationProgressProps {
  application: {
    data: ScholarshipApplication;
    id?: string;
    status?: string;
  };
  onStepClick?: (stepKey: keyof ApplicationSteps) => void;
  isLoading?: boolean;
  onError?: (error: Error) => void;
}

// Icons mapping for each section
const SECTION_ICONS = {
  personal: User,
  education: GraduationCap,
  research: Beaker,
  skills: Zap,
  languages: Languages,
  activities: Activity,
  health: Heart,
  financial: Wallet,
  goals: Target,
  preferences: Globe,
  documents: FolderOpen,
  contact: Phone,
  studyType: BookOpen,
  distinction: Award,
};

// Color linears with your colors (#00A3FF and #7000FF)
const SECTION_linearS = {
  personal: "from-[#00A3FF] to-[#7000FF]",
  education: "from-[#00A3FF] to-[#7000FF]",
  research: "from-[#00A3FF] to-[#7000FF]",
  skills: "from-[#00A3FF] to-[#7000FF]",
  languages: "from-[#00A3FF] to-[#7000FF]",
  activities: "from-[#00A3FF] to-[#7000FF]",
  health: "from-[#00A3FF] to-[#7000FF]",
  financial: "from-[#00A3FF] to-[#7000FF]",
  goals: "from-[#00A3FF] to-[#7000FF]",
  preferences: "from-[#00A3FF] to-[#7000FF]",
  documents: "from-[#00A3FF] to-[#7000FF]",
  contact: "from-[#00A3FF] to-[#7000FF]",
  studyType: "from-[#00A3FF] to-[#7000FF]",
  distinction: "from-[#00A3FF] to-[#7000FF]",
};

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



// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
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
        <div className="rounded-sm border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-2">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            <p className="text-sm font-medium">
              Something went wrong loading application progress
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Progress Card Component
const ProgressCard = ({
  step,
  isCompleted,
  icon: Icon,
  linear,
  onClick,
}: {
  step: { key: string; label: string; description: string };
  isCompleted: boolean;
  icon: React.ElementType;
  linear: string;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="relative group cursor-pointer rounded-sm overflow-hidden border border-gray-200 dark:border-[#064e78] bg-white dark:bg-[#011b2b] hover:border-[#00A3FF] dark:hover:border-[#00A3FF] transition-all duration-300"
    >
      <div className="relative p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-sm bg-linear-to-r ${linear} bg-opacity-10`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {step.label}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            )}
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#00A3FF] transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
const ApplicationProgress = ({ 
  application, 
  onStepClick, 
  isLoading = false,
  onError 
}: ApplicationProgressProps) => {
  const steps = checkApplicationSteps(application?.data);

  const stepList: {
    key: keyof ApplicationSteps;
    label: string;
    description: string;
  }[] = [
    { key: "personal", label: "Personal Information", description: "Basic details, identity documents, and nationality" },
    { key: "education", label: "Education History", description: "Academic background, degrees, and transcripts" },
    { key: "research", label: "Research Experience", description: "Publications, projects, and academic achievements" },
    { key: "skills", label: "Skills & Competencies", description: "Technical, communication, and leadership skills" },
    { key: "languages", label: "Language Proficiency", description: "Native language, English test scores, and other languages" },
    { key: "activities", label: "Activities", description: "Extracurricular and volunteer activities" },
    { key: "health", label: "Health Information", description: "Medical conditions and accessibility needs" },
    { key: "financial", label: "Financial Information", description: "Income, tuition, and travel payment capability" },
    { key: "goals", label: "Goals & Objectives", description: "Purpose of education and post-study plans" },
    { key: "preferences", label: "Study Preferences", description: "Preferred fields, countries, and universities" },
    { key: "documents", label: "Required Documents", description: "CV, SOP, passport, and other supporting documents" },
    { key: "contact", label: "Contact Information", description: "Address, phone, email, and emergency contact" },
    { key: "studyType", label: "Study Type", description: "Scholarship and private study preferences" },
    { key: "distinction", label: "Distinctions", description: "Special skills and notable achievements" },
  ];

  const completed = Object.values(steps).filter(Boolean).length;
  const total = stepList.length;
  const percent = Math.round((completed / total) * 100);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary onError={onError}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden "
      >
        {/* Header */}
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Application Progress
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your application completion status
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-sm">
                <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                  {application?.status || "draft"}
                </span>
              </div>
              
              <div className="px-3 py-1.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm">
                <span className="text-sm font-semibold text-white">
                  {completed}/{total}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-900 dark:text-white">{percent}%</span>
            </div>
            
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute h-full bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
              />
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Completed: {completed}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Updated: {formatDate(application?.data?.updatedAt as string)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Steps List - Single Column */}
        <div className="p-6">
          <div className="space-y-3">
            {stepList.map((step) => {
              const Icon = SECTION_ICONS[step.key];
              const linear = SECTION_linearS[step.key];
              const isCompleted = steps[step.key];

              return (
                <ProgressCard
                  key={step.key}
                  step={step}
                  isCompleted={isCompleted}
                  icon={Icon}
                  linear={linear}
                  onClick={() => onStepClick?.(step.key)}
                />
              );
            })}
          </div>
        </div>


      </motion.div>
    </ErrorBoundary>
  );
};

export default ApplicationProgress;