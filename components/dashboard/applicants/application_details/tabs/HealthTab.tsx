import { Application } from "@/types/application_details";
import InfoField from "../InfoField";

interface HealthTabProps {
  health: Application["health"];
}

const HealthTab = ({ health }: HealthTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Health Information
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <InfoField label="Special Diseases" value={health.specialDiseases} />
        <InfoField label="Disability Needs" value={health.disabilityNeeds} />
      </div>
    </div>
  );
};

export default HealthTab;
