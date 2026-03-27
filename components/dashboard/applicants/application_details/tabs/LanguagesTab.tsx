import { Application } from "@/types/application_details";
import {
  Languages,
  Globe,
  Flag,
  MapPin,
  BookOpen,
  Award,
  FileText,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface LanguagesTabProps {
  data: Application["languages"];
}

const LanguagesTab = ({ data }: LanguagesTabProps) => {
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseURL) {
    console.log("Base URL not Provided");
  }

  // Check if there's any language data to display
  const hasAnyLanguage =
    data?.nativeLanguage?.language ||
    data?.english?.level ||
    data?.foreignLanguage?.language ||
    data?.localLanguage?.language;

  if (!hasAnyLanguage) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <Languages className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Language Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added any language proficiency details yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Language Proficiency
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Language skills and certifications
            </p>
          </div>
        </div>
      </div>

      {/* Languages Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Native, Local & Foreign Languages */}
            <div className="space-y-4">
              {/* Native Language */}
              {data?.nativeLanguage?.language && (
                <LanguageItem
                  icon={<Globe className="h-4 w-4 text-[#00A3FF]" />}
                  label="Native Language"
                  language={data.nativeLanguage.language}
                  level={data.nativeLanguage.level}
                />
              )}

              {/* Local Language */}
              {data?.localLanguage?.language && (
                <LanguageItem
                  icon={<MapPin className="h-4 w-4 text-[#00A3FF]" />}
                  label="Local Language"
                  language={data.localLanguage.language}
                  level={data.localLanguage.level}
                />
              )}

              {/* Foreign Language */}
              {data?.foreignLanguage?.language && (
                <ForeignLanguageItem
                  language={data.foreignLanguage.language}
                  level={data.foreignLanguage.level}
                  documentType={data.foreignLanguage.documentType}
                  certificateUrl={data.foreignLanguage.certificateUrl}
                />
              )}
            </div>

            {/* Right Column - English Proficiency */}
            <div className="space-y-4">
              {data?.english && (
                <EnglishProficiencyItem english={data.english} />
              )}
            </div>
          </div>
        </div>

        {/* Subtle Hover Effect */}
        <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
        </div>
      </motion.div>
    </div>
  );
};

// Language Item Component for Native and Local Languages
const LanguageItem = ({
  icon,
  label,
  language,
  level,
}: {
  icon: React.ReactNode;
  label: string;
  language: string;
  level?: string;
}) => {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          {label}
        </p>
        <p className="mt-1 text-sm text-gray-900 dark:text-white">{language}</p>
        {level && (
          <div className="mt-2">
            <span className="inline-flex items-center rounded-sm bg-[#00A3FF]/10 px-2 py-1 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20">
              {level}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Foreign Language Item Component
const ForeignLanguageItem = ({
  language,
  level,
  documentType,
  certificateUrl,
}: {
  language: string;
  level?: string;
  documentType?: string;
  certificateUrl?: string;
}) => {

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        <Flag className="h-4 w-4 text-[#00A3FF]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          Foreign Language
        </p>
        <p className="mt-1 text-sm text-gray-900 dark:text-white">{language}</p>
        
        {level && (
          <div className="mt-2">
            <span className="inline-flex items-center rounded-sm bg-[#00A3FF]/10 px-2 py-1 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20">
              {level}
            </span>
          </div>
        )}

        {documentType && documentType !== "Other" && (
          <div className="mt-2 flex items-center gap-2">
            <Award className="h-3 w-3 text-[#00A3FF]" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Document: {documentType}
            </p>
          </div>
        )}

        {certificateUrl && (
          <div className="mt-3">
            <FileAttachmentItem
              icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
              name="Foreign Language Certificate"
              fileName={certificateUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// English Proficiency Component
const EnglishProficiencyItem = ({
  english,
}: {
  english: {
    level?: string;
    test?: string;
    score?: string;
    certificateUrl?: string;
  };
}) => {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
        <BookOpen className="h-4 w-4 text-[#00A3FF]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
          English Proficiency
        </p>

        {/* English Level */}
        {english.level ? (
          <div className="mt-2">
            <span className="inline-flex items-center rounded-sm bg-[#00A3FF]/10 px-2 py-1 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20">
              {english.level}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500 italic">
            Level not specified
          </p>
        )}

        {/* English Test */}
        {english.test && english.test !== "None" && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-3 w-3 text-[#00A3FF]" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {english.test}
                {english.score && (
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    : {english.score}
                  </span>
                )}
              </p>
            </div>

            {/* Certificate */}
            {english.certificateUrl && (
              <div className="mt-2">
                <FileAttachmentItem
                  icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
                  name="English Certificate"
                  fileName={english.certificateUrl}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// FileAttachmentItem Component
const FileAttachmentItem = ({
  icon,
  name,
  fileName,
}: {
  icon: React.ReactNode;
  name: string;
  fileName: string;
}) => {
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  const displayName = fileName.split("/").pop() || fileName;
  const fileUrl = baseURL ? `${baseURL}/${fileName}` : fileName;

  return (
    <div className="group/file relative overflow-hidden rounded-sm border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 transition-all duration-300 hover:border-[#00A3FF]/30 hover:shadow-lg hover:shadow-[#00A3FF]/5">
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 opacity-0 transition-opacity duration-300 group-hover/file:opacity-100" />

      <div className="relative flex items-center justify-between p-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="shrink-0">{icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {displayName}
            </p>
          </div>
        </div>

        <div className="ml-2 shrink-0">
          <a
            href={fileUrl}
            className="inline-flex items-center gap-1 rounded-sm bg-linear-to-r from-[#00A3FF] to-[#7000FF] px-2.5 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#00A3FF]/25"
            target="_blank"
            rel="noopener noreferrer"
          >
            View
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LanguagesTab;