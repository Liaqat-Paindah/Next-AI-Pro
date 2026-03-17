import { Application } from "@/types/application_details";
import InfoField from "../InfoField";
import TagList from "../TagList";

interface GoalsTabProps {
  goals: Application['goals'];
  preferences: Application['preferences'];
  distinction: Application['distinction'];
}

const GoalsTab = ({ goals, preferences, distinction }: GoalsTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Goals & Preferences
      </h2>

      <div className="space-y-4">
        <InfoField label="Purpose of Education" value={goals.purposeOfEducation} />
        <InfoField label="Post-Study Plan" value={goals.postStudyPlan} />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-lg text-gray-900 dark:text-white">Preferences</h3>
        <TagList items={preferences.preferredFields} label="Preferred Fields" />
        <TagList items={preferences.preferredCountries} label="Preferred Countries" />
        <TagList items={preferences.preferredUniversities} label="Preferred Universities" />
        <InfoField label="Preferred Study Level" value={preferences.preferredStudyLevel} />
      </div>

      <InfoField label="Special Skills" value={distinction.specialSkills} />
      <InfoField label="Achievements" value={distinction.achievements} />
    </div>
  );
};

export default GoalsTab;