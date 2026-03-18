import { Application } from "@/types/application_details";
import InfoField from "../InfoField";

interface ContactTabProps {
  contact: Application['contact'];
}

const ContactTab = ({ contact }: ContactTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg text-gray-900 dark:text-white">Contact Details</h3>
          <InfoField label="Phone" value={contact.phone} />
          <InfoField label="WhatsApp" value={contact.whatsapp} />
          <InfoField label="Email" value={contact.email} />
          <InfoField label="Relative Phone" value={contact.relativePhone} />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
              Permanent Address
            </h3>
            <p className="text-gray-900 dark:text-white">
              {[
                contact.permanentAddress?.area,
                contact.permanentAddress?.district,
                contact.permanentAddress?.province
              ].filter(Boolean).join(', ')}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">
              Current Address
            </h3>
            <p className="text-gray-900 dark:text-white">
              {[
                contact.currentAddress?.area,
                contact.currentAddress?.district,
                contact.currentAddress?.province
              ].filter(Boolean).join(', ')}
            </p>
          </div>

          <InfoField label="Detailed Address" value={contact.detailedAddress} />
        </div>
      </div>
    </div>
  );
};

export default ContactTab;