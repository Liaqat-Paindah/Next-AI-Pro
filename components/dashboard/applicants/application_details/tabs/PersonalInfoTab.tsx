import { Application } from "@/types/application_details";
import InfoField from "../InfoField";

interface PersonalInfoTabProps {
  data: Application['personal'];
}

const PersonalInfoTab = ({ data }: PersonalInfoTabProps) => {
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
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InfoField label="Full Name" value={`${data.firstName} ${data.lastName}`} />
          <InfoField label="Father Name" value={data.fatherName} />
          <InfoField label="Date of Birth" value={formatDate(data.birthDate)} />
          <InfoField label="Age" value={`${data.age} years`} />
          <InfoField label="Gender" value={data.gender} />
        </div>
        <div className="space-y-4">
          <InfoField label="Marital Status" value={data.maritalStatus} />
          <InfoField label="Nationality" value={data.nationality} />
          <InfoField label="National ID" value={data.nationalId} />
          <InfoField label="Passport ID" value={data.passportId} />
          <InfoField label="Passport Expiry" value={formatDate(data.dataofExpire)} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;