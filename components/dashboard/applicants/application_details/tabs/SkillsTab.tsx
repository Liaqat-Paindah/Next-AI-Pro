import { Application } from "@/types/application_details";
import InfoField from "../InfoField";

interface SkillsTabProps {
  data: Application['skills'];
}

const SkillsTab = ({ data }: SkillsTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Skills
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InfoField label="Computer Skills" value={data.computerSkills.hasSkill ? "Yes" : "No"} />
          <InfoField label="Communication Skills" value={data.communicationSkills ? "Yes" : "No"} />
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Media Content Creation
            </label>
            <p className="text-gray-900 dark:text-white">
              {data.mediaContentCreation.hasSkill ? "Yes" : "No"}
            </p>
            {data.mediaContentCreation.youtubeLink && (
              <a
                href={data.mediaContentCreation.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline block mt-1"
              >
                YouTube Channel
              </a>
            )}
          </div>
          <InfoField label="Teamwork Skills" value={data.teamworkSkills ? "Yes" : "No"} />
        </div>

        <div className="space-y-4">
          <InfoField label="Leadership Skills" value={data.leadershipSkills ? "Yes" : "No"} />
          <InfoField label="Problem Solving" value={data.problemSolving ? "Yes" : "No"} />
          <InfoField label="Time Management" value={data.timeManagement ? "Yes" : "No"} />
          <InfoField label="Presentation Skills" value={data.presentationSkills ? "Yes" : "No"} />
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;