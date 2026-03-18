import { Application } from "@/types/application_details";
import InfoField from "../InfoField";

interface FinancialTabProps {
  financial: Application['financial'];
  studyType: Application['studyType'];
}

const FinancialTab = ({ financial, studyType }: FinancialTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Financial Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financial.familyIncome && (
          <InfoField 
            label="Family Income" 
            value={`$${financial.familyIncome.toLocaleString()}`} 
          />
        )}

        <InfoField label="Can Pay Tuition" value={financial.canPayTuition} />
        <InfoField label="Can Pay Travel" value={financial.canPayTravel} />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Study Type
        </label>
        <div className="flex gap-4 mt-1">
          {studyType.scholarshipOnly && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
              Scholarship Only
            </span>
          )}
          {studyType.privateStudyOption && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
              Private Study Option
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialTab;