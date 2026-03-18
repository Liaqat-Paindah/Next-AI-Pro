import { Application } from "@/types/application_details";
import InfoField from "../InfoField";

interface LanguagesTabProps {
  data: Application['languages'];
}

const LanguagesTab = ({ data }: LanguagesTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Language Proficiency
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoField label="Native Language" value={data.nativeLanguage} />

        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            English Level
          </label>
          <p className="text-gray-900 dark:text-white">
            {data.english.level || "Not specified"}
          </p>
          {data.english.test !== "None" && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {data.english.test}: {data.english.score}
              </p>
              {data.english.certificateUrl && (
                <a
                  href={data.english.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline block mt-1"
                >
                  View Certificate
                </a>
              )}
            </>
          )}
        </div>

        <InfoField label="Foreign Language" value={data.foreignLanguage?.language} />
        <InfoField label="Local Language" value={data.localLanguage?.language} />
      </div>
    </div>
  );
};

export default LanguagesTab;