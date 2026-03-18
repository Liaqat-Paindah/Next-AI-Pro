import {
  Application,
  Article,
  Project,
  Conference,
  LabActivity,
  AcademicAward,
  ResearchSkill,
} from "@/types/application_details";
import {
  FileText,
  BookOpen,
  Microscope,
  Presentation,
  FlaskConical,
  Award,
  Beaker,
  ExternalLink,
  BookMarked,
  FileCheck,
} from "lucide-react";
import { motion } from "framer-motion";

interface ResearchTabProps {
  data: Application["research"];
}

const ResearchTab = ({ data }: ResearchTabProps) => {
  const baseURL = process.env.NEXT_PUBLIC_FILE_URL;
  if (!baseURL) {
    console.log("Base URL not Provided");
  }

  // Check if there's any research data to display by checking actual arrays
  const hasAnyResearch =
    data.steps !== "false" ||
    (data.articles && data.articles.length > 0) ||
    (data.projects && data.projects.length > 0) ||
    (data.conferences && data.conferences.length > 0) ||
    (data.laboratoryActivities && data.laboratoryActivities.length > 0) ||
    (data.researchSkills && data.researchSkills.length > 0) ||
    (data.academicAwards && data.academicAwards.length > 0);

  if (!hasAnyResearch) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Research Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added any research or publication details yet.
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
              <Microscope className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Research & Publications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Academic research, projects, and scholarly activities
            </p>
          </div>
        </div>
      </div>

      {/* Articles Section - check actual data */}
      {data.articles && data.articles.length > 0 && (
        <ResearchSection<Article>
          title="Published Articles"
          icon={<BookOpen className="h-5 w-5 text-[#00A3FF]" />}
          items={data.articles}
          renderItem={(article, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {article.title}
              </p>
              {article.citation && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic border-l-2 border-[#00A3FF]/30 pl-3">
                  {article.citation}
                </p>
              )}
              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#00A3FF] hover:text-[#7000FF] transition-colors mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View Article
                </a>
              )}
            </div>
          )}
        />
      )}

      {/* Projects Section - check actual data */}
      {data.projects && data.projects.length > 0 && (
        <ResearchSection<Project>
          title="Research Projects"
          icon={<Beaker className="h-5 w-5 text-[#00A3FF]" />}
          items={data.projects}
          renderItem={(project, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {project.title}
              </p>
              {project.fileUrl && (
                <FileAttachmentItem
                  icon={<FileCheck className="h-4 w-4 text-[#00A3FF]" />}
                  name="Project Document"
                  fileName={project.fileUrl}
                />
              )}
            </div>
          )}
        />
      )}

      {/* Conferences Section - check actual data */}
      {data.conferences && data.conferences.length > 0 && (
        <ResearchSection<Conference>
          title="Conference Presentations"
          icon={<Presentation className="h-5 w-5 text-[#00A3FF]" />}
          items={data.conferences}
          renderItem={(conference, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {conference.title}
              </p>
              {conference.fileUrl && (
                <FileAttachmentItem
                  icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
                  name="Conference Material"
                  fileName={conference.fileUrl}
                />
              )}
            </div>
          )}
        />
      )}

      {/* Laboratory Activities Section - check actual data */}
      {data.laboratoryActivities && data.laboratoryActivities.length > 0 && (
        <ResearchSection<LabActivity>
          title="Laboratory Activities"
          icon={<FlaskConical className="h-5 w-5 text-[#00A3FF]" />}
          items={data.laboratoryActivities}
          renderItem={(lab, idx) => (
            <div key={idx} className="space-y-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {lab.title}
              </p>
              {lab.fileUrl && (
                <div className="mt-2">
                  <FileAttachmentItem
                    icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
                    name="Laboratory Activity Document"
                    fileName={lab.fileUrl}
                  />
                </div>
              )}
            </div>
          )}
        />
      )}

      {/* Research Skills Section - check actual data */}
      {data.researchSkills && data.researchSkills.length > 0 && (
        <ResearchSection<ResearchSkill>
          title="Research Skills"
          icon={<BookMarked className="h-5 w-5 text-[#00A3FF]" />}
          items={data.researchSkills}
          renderItem={(skill, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {skill.title}
              </p>
              {skill.fileUrl && (
                <FileAttachmentItem
                  icon={<FileText className="h-4 w-4 text-[#00A3FF]" />}
                  name="Skill Documentation"
                  fileName={skill.fileUrl}
                />
              )}
            </div>
          )}
        />
      )}

      {/* Academic Awards Section - check actual data */}
      {data.academicAwards && data.academicAwards.length > 0 && (
        <ResearchSection<AcademicAward>
          title="Academic Awards & Honors"
          icon={<Award className="h-5 w-5 text-[#00A3FF]" />}
          items={data.academicAwards}
          renderItem={(award, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {award.title}
              </p>
              {award.fileUrl && (
                <FileAttachmentItem
                  icon={<Award className="h-4 w-4 text-[#00A3FF]" />}
                  name="Award Certificate"
                  fileName={award.fileUrl}
                />
              )}
            </div>
          )}
        />
      )}
    </div>
  );
};

// Generic Research Section Component with proper typing
const ResearchSection = <T,>({
  title,
  icon,
  items,
  renderItem,
}: {
  title: string;
  icon: React.ReactNode;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) => {
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group border-b border-gray-200 dark:border-white/10 last:border-b-0"
    >
      <div className="px-6 sm:px-8 py-6">
        {/* Section Header */}
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

        {/* Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative overflow-hidden rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-4 transition-all duration-300 hover:border-[#00A3FF]/30 hover:shadow-lg hover:shadow-[#00A3FF]/5"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">{renderItem(item, idx)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/5 to-[#7000FF]/0 dark:via-[#00A3FF]/10" />
      </div>
    </motion.div>
  );
};

// FileAttachmentItem Component with proper typing
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

export default ResearchTab;
