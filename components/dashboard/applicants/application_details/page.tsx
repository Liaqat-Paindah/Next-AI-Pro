"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  FileText,
  FlaskConical,
  GraduationCap,
  Heart,
  Languages,
  Phone,
  Target,
  User,
  Wrench,
  Calendar,
  Award,
  Briefcase,
  Download,
  ChevronDown,
  Clock,
  FileDown,
  Printer,
  Mail,
  Share2,
  Sparkles,
} from "lucide-react";
import Loading from "@/app/loading";
import { UseGetApplicants } from "@/hooks/useApplication";
import { Application } from "@/types/application_details";
import TabNavigation from "@/components/dashboard/applicants/application_details/TabNavigation";
import PersonalInfoTab from "@/components/dashboard/applicants/application_details/tabs/PersonalInfoTab";
import EducationTab from "@/components/dashboard/applicants/application_details/tabs/EducationTab";
import ResearchTab from "@/components/dashboard/applicants/application_details/tabs/ResearchTab";
import SkillsTab from "@/components/dashboard/applicants/application_details/tabs/SkillsTab";
import LanguagesTab from "@/components/dashboard/applicants/application_details/tabs/LanguagesTab";
import HealthTab from "@/components/dashboard/applicants/application_details/tabs/HealthTab";
import FinancialTab from "@/components/dashboard/applicants/application_details/tabs/FinancialTab";
import DocumentsTab from "@/components/dashboard/applicants/application_details/tabs/DocumentsTab";
import ContactTab from "@/components/dashboard/applicants/application_details/tabs/ContactTab";
import ActivitiesTab from "@/components/dashboard/applicants/application_details/tabs/ActivitiesTab";
import HobbiesTab from "@/components/dashboard/applicants/application_details/tabs/HobbiesTab";
import PreferencesTab from "@/components/dashboard/applicants/application_details/tabs/PreferencesTab";
import DistinctionTab from "@/components/dashboard/applicants/application_details/tabs/DistinctionTab";

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
      const standardErrorType = this.state.error?.name || "ApplicationDataError";

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-gray-200 bg-white/70 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
            <div className="relative flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/10">
                <FileText className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {standardErrorType}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unable to display application details due to incomplete data.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const GetApplicationDetails = () => {
  const { data: userSession, status } = useSession();
  const id = userSession?.user._id;
  const { data: NewData, isLoading } = UseGetApplicants(id as string);
  const application = NewData?.data;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }

    // Animate glow intensity
    const interval = setInterval(() => {
      setGlowIntensity(0.3 + Math.random() * 0.4);
    }, 2000);

    return () => clearInterval(interval);
  }, [status, router]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = async (format: "pdf" | "json" | "txt") => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate download completion
    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setIsDownloading(false);
      setIsDownloadMenuOpen(false);

      // Show success message (you can replace with toast notification)
      alert(`Application downloaded as ${format.toUpperCase()}`);

      // Reset progress after showing success
      setTimeout(() => setDownloadProgress(0), 1000);
    }, 2000);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "research", label: "Research", icon: FlaskConical },
    { id: "activities", label: "Activities", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "health", label: "Health", icon: Heart },
    { id: "financial", label: "Financial", icon: DollarSign },
    { id: "preferences", label: "Preferences", icon: Target },
    { id: "hobbies", label: "Hobbies", icon: Heart },
    { id: "distinction", label: "Plan & Goals", icon: Award },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "contact", label: "Contact", icon: Phone },
  ];

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (!application) {
    return (
      <div className=" flex items-center justify-center">
        <div className="relative max-w-sm w-full">
          {/* Nexus Background Effects */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute -left-1/4 top-0 h-125 w-125 rounded-full bg-[#00A3FF]/5 blur-[120px] dark:hidden" />
            <div className="absolute -right-1/4 bottom-0 h-125 w-125 rounded-full bg-[#7000FF]/5 blur-[120px] dark:hidden" />
            <div className="absolute -left-1/4 top-0 hidden h-125 w-125 rounded-full bg-[#00A3FF]/10 blur-[120px] dark:block" />
            <div className="absolute -right-1/4 bottom-0 hidden h-125 w-125 rounded-full bg-[#7000FF]/10 blur-[120px] dark:block" />
            <motion.div
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#00A3FF]/30 to-transparent dark:via-[#00A3FF]/50"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-sm border border-gray-200 backdrop-blur-sm dark:border-white/10"
          >
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/10 to-[#7000FF]/0 opacity-0 transition-opacity duration-1000 hover:opacity-100 dark:via-[#00A3FF]/20" />

            <div className="relative p-8 text-center">
              <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#00A3FF] to-transparent dark:via-[#00A3FF]" />

              <div className="relative flex justify-center mb-6">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <div
                    className="absolute inset-0 -z-10 animate-pulse rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50"
                    style={{ opacity: glowIntensity }}
                  />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Application Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                You have not submitted any scholarship application yet.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/dashboard/apply")}
                className="mt-6 inline-flex items-center px-6 py-2.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm text-sm font-medium hover:shadow-lg hover:shadow-[#00A3FF]/20 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Application
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const app = application as Application;

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab data={app.personal} />;
      case "education":
        return <EducationTab data={app.education} EducationLevel ={app?.level} />;
      case "research":
        return <ResearchTab data={app.research} />;
      case "activities":
        return <ActivitiesTab data={app.activities} />;
      case "skills":
        return <SkillsTab data={app.skills} />;
      case "languages":
        return <LanguagesTab data={app.languages} />;
      case "health":
        return <HealthTab health={app.health} />;
      case "financial":
        return <FinancialTab financial={app.financial} />;
      case "preferences":
        return <PreferencesTab preferences={app.preferences} />;
      case "hobbies":
        return <HobbiesTab hobbies={app.hobbies} />;
      case "distinction":
        return (
          <DistinctionTab
            distinction={app.distinction}
            studyType={app.studyType}
            goals={app.goals}
          />
        );
      case "documents":
        return (
          <DocumentsTab
            supportingDocuments={app.supportingDocuments}
            files={app.files}
          />
        );
      case "contact":
        return <ContactTab contact={app.contact} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative md:p-2 min-h-screen">
        {/* Nexus Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-5" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto max-w-7xl"
        >
          {/* Main Container */}
          <div className="relative overflow-hidden rounded-sm border border-gray-200 backdrop-blur-sm dark:border-white/10">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-sm bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/10 to-[#7000FF]/0 opacity-0 transition-opacity duration-1000 hover:opacity-100 dark:via-[#00A3FF]/20" />

            {/* Header with Status */}
            <div className="relative border-b border-gray-200 p-4 sm:p-6 dark:border-white/10">
              {/* Top Glow */}
              <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#00A3FF] to-transparent dark:via-[#00A3FF]" />

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
                      <Award className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div
                      className="absolute inset-0 -z-10 animate-pulse rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50"
                      style={{ opacity: glowIntensity }}
                    />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Application
                      <span className="text-[#00A3FF]"> Details</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Submitted on {formatDate(app.createdAt)}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        Updated {formatDate(app.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Tab Navigation with Nexus styling */}
              <div className="mt-6">
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="relative p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  {/* Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-5 pointer-events-none" />

                  {/* Content */}
                  <div className="relative">{renderTabContent()}</div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with Download Button */}
            <div className="relative border-t border-gray-200 dark:border-white/10 p-4 sm:p-6">
              {/* Bottom Glow */}
              <div className="absolute left-1/2 bottom-0 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#00A3FF] to-transparent dark:via-[#00A3FF]" />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Download Section */}
                <div className="relative flex items-center gap-3">
                  {/* Download Progress Bar */}
                  {isDownloading && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${downloadProgress}%` }}
                      className="absolute -top-2 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-full"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  )}

                  {/* Download Button with Dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                      disabled={isDownloading}
                      className="inline-flex items-center px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm text-sm font-medium hover:shadow-lg hover:shadow-[#00A3FF]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading
                        ? `Downloading... ${downloadProgress}%`
                        : "Download Application"}
                      <ChevronDown
                        className={`w-4 h-4 ml-2 transition-transform duration-300 ${isDownloadMenuOpen ? "rotate-180" : ""}`}
                      />
                    </motion.button>

                    {/* Download Dropdown Menu */}
                    <AnimatePresence>
                      {isDownloadMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-full mb-2 right-0 w-48 rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
                        >
                          <div className="p-1">
                            <button
                              onClick={() => handleDownload("pdf")}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors"
                            >
                              <FileDown className="w-4 h-4 mr-2 text-[#00A3FF]" />
                              Download as PDF
                            </button>
                            <button
                              onClick={() => handleDownload("json")}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors"
                            >
                              <FileDown className="w-4 h-4 mr-2 text-[#7000FF]" />
                              Download as JSON
                            </button>
                            <button
                              onClick={() => handleDownload("txt")}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors"
                            >
                              <FileDown className="w-4 h-4 mr-2 text-gray-500" />
                              Download as TXT
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2 rounded-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Footer Stats */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                <span>Application ID: {app._id?.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default GetApplicationDetails;
