import { Education } from "@/types/application_details";
import InfoField from "../InfoField";
import TagList from "../TagList";

interface EducationTabProps {
  data: Education[];
}

const EducationTab = ({ data }: EducationTabProps) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Education History
      </h2>
      {data.map((edu, index) => (
        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-lg text-blue-600 dark:text-blue-400">
            {edu.level}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Field of Study" value={edu.fieldOfStudy} />
            <InfoField label="Institution" value={edu.institutionName} />
            <InfoField label="GPA" value={edu.gpa} />
            <InfoField label="Academic Rank" value={edu.academicRank} />
            <InfoField label="Start Date" value={edu.startDate && formatDate(edu.startDate)} />
            <InfoField label="Graduation Date" value={edu.graduationDate && formatDate(edu.graduationDate)} />
            <InfoField label="Final Exam Score" value={edu.finalExamScore} />
          </div>
          <TagList items={edu.majorSubjects} label="Major Subjects" />
        </div>
      ))}
    </div>
  );
};

export default EducationTab;