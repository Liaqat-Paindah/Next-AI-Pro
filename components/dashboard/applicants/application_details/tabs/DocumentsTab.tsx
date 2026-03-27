import { Application } from "@/types/application_details";
import {
  FileText,
  FileCheck,
  User,
  IdCard,
  FileSignature,
  Briefcase,
  Lightbulb,
  Image,
  File,
} from "lucide-react";
import { motion } from "framer-motion";

interface DocumentsTabProps {
  supportingDocuments?: Application["supportingDocuments"];
  files?: Application["files"];
}

const DocumentsTab = ({ files }: DocumentsTabProps) => {
  const safeFiles: Partial<Application["files"]> = files ?? {};

  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseURL) {
    console.log("Base URL not Provided");
  }

  // Document sections configuration - show based on file existence
  const supportingDocsConfig = [
    {
      key: "sop",
      label: "Statement of Purpose",
      icon: <FileSignature className="h-4 w-4 text-[#00A3FF]" />,
      description:
        "Personal statement outlining your academic goals and motivation",
      fileUrl: safeFiles.sopUrl,
      show: !!safeFiles.sopUrl, // Show if file exists
    },
    {
      key: "recommendationLetter",
      label: "Recommendation Letters",
      icon: <FileCheck className="h-4 w-4 text-[#00A3FF]" />,
      description:
        "Letters of recommendation from academic or professional references",
      fileUrl: safeFiles.recommendationLettersUrl,
      show: !!safeFiles.recommendationLettersUrl, // Show if file exists
    },
    {
      key: "cv",
      label: "CV / Resume",
      icon: <Briefcase className="h-4 w-4 text-[#00A3FF]" />,
      description:
        "Curriculum vitae highlighting your experience and qualifications",
      fileUrl: safeFiles.cvUrl,
      show: !!safeFiles.cvUrl, // Show if file exists
    },
    {
      key: "researchProposal",
      label: "Research Proposal",
      icon: <Lightbulb className="h-4 w-4 text-[#00A3FF]" />,
      description: "Detailed research plan and objectives",
      fileUrl: safeFiles.researchProposalUrl,
      show: !!safeFiles.researchProposalUrl, // Show if file exists
    },
    {
      key: "portfolio",
      label: "Portfolio",
      icon: <Image className="h-4 w-4 text-[#00A3FF]" />,
      description: "Collection of your work and achievements",
      fileUrl: safeFiles.portfolioUrl,
      show: !!safeFiles.portfolioUrl, // Show if file exists
    },
  ];

  const identificationDocsConfig = [
    {
      key: "nid",
      label: "National ID",
      icon: <User className="h-4 w-4 text-[#00A3FF]" />,
      description: "Government-issued national identification",
      fileUrl: safeFiles.nidUrl,
      show: !!safeFiles.nidUrl, // Show if file exists
    },
    {
      key: "passport",
      label: "Passport",
      icon: <IdCard className="h-4 w-4 text-[#00A3FF]" />,
      description: "Valid passport for international identification",
      fileUrl: safeFiles.passportUrl,
      show: !!safeFiles.passportUrl, // Show if file exists
    },
  ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Supporting Documents
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Required documents for your application
            </p>
          </div>
        </div>
      </div>

      {/* Supporting Documents Section */}
      <div className="divide-y divide-gray-200 dark:border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="px-6 sm:px-8 py-8">
            {/* Section Title */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <FileText className="h-5 w-5 text-[#00A3FF]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Academic & Professional Documents
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Documents that support your academic and professional
                    background
                  </p>
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportingDocsConfig.map(
                (doc, index) =>
                  doc.show && (
                    <DocumentCard
                      key={doc.key}
                      icon={doc.icon}
                      label={doc.label}
                      description={doc.description}
                      fileUrl={doc.fileUrl}
                      delay={index * 0.1}
                    />
                  ),
              )}
            </div>

            {/* No Supporting Documents Message */}
            {supportingDocsConfig.every((doc) => !doc.show) && (
              <div className="text-center py-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5 mb-3">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No supporting documents have been uploaded yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Identification Documents Section */}
        {identificationDocsConfig.some((doc) => doc.show) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="px-6 sm:px-8 py-8">
              {/* Section Title */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                    <User className="h-5 w-5 text-[#00A3FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Identification Documents
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Official identification documents for verification
                    </p>
                  </div>
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {identificationDocsConfig.map(
                  (doc, index) =>
                    doc.show && (
                      <DocumentCard
                        key={doc.key}
                        icon={doc.icon}
                        label={doc.label}
                        description={doc.description}
                        fileUrl={doc.fileUrl}
                        delay={0.3 + index * 0.1}
                      />
                    ),
                )}
              </div>
            </div>

            {/* Subtle Hover Effect */}
            <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Document Card Component
const DocumentCard = ({
  icon,
  label,
  description,
  fileUrl,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  fileUrl?: string | null;
  delay?: number;
}) => {
  const fullUrl = fileUrl
    ? `${process.env.NEXT_PUBLIC_FILE_URL}/${fileUrl}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 transition-all duration-300 hover:border-[#00A3FF]/30 hover:shadow-lg hover:shadow-[#00A3FF]/5"
    >
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              {icon}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {label}
            </h5>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
              {description}
            </p>

            {fullUrl ? (
              <a
                href={fullUrl}
                className="inline-flex items-center gap-1.5 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] px-3 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <File className="h-3 w-3" />
                View Document
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-sm bg-gray-100 dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed">
                <File className="h-3 w-3" />
                Not Uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentsTab;
