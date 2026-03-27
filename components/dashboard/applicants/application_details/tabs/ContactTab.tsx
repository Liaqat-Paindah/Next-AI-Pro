import { Application } from "@/types/application_details";
import {
  Phone,
  MessageCircle,
  Mail,
  Users,
  MapPin,
  Home,
  LocateFixed,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

interface ContactTabProps {
  contact: Application["contact"];
}

// Define the address type
interface Address {
  area?: string;
  district?: string;
  province?: string;
}

const ContactTab = ({ contact }: ContactTabProps) => {
  const formatAddress = (address: Address | undefined): string => {
    if (!address) return "";
    return [address.area, address.district, address.province]
      .filter(Boolean)
      .join(", ");
  };

  const hasData = Boolean(
    contact?.phone ||
    contact?.whatsapp ||
    contact?.email ||
    contact?.relativePhone ||
    contact?.detailedAddress ||
    contact?.permanentAddress?.area ||
    contact?.permanentAddress?.district ||
    contact?.permanentAddress?.province ||
    contact?.currentAddress?.area ||
    contact?.currentAddress?.district ||
    contact?.currentAddress?.province,
  );

  if (!hasData) {
    return (
      <div className="w-full">
        <div className="px-6 sm:px-8 py-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Phone className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Contact Information
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The applicant has not added contact details yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section with Professional Spacing */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contact details and addresses
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10">
                  <MessageCircle className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact Details
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Phone className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Phone Number
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {contact.phone || "Not specified"}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <MessageCircle className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {contact.whatsapp || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Mail className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Email Address
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                    {contact.email || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Relative Phone */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Users className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Relative Phone
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {contact.relativePhone || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Addresses */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10">
                  <MapPin className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Address Information
                </p>
              </div>

              {/* Permanent Address */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Home className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Permanent Address
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white leading-relaxed">
                    {formatAddress(contact.permanentAddress) || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Current Address */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <LocateFixed className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Current Address
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white leading-relaxed">
                    {formatAddress(contact.currentAddress) || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Detailed Address */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Building2 className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Detailed Address
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white leading-relaxed text-justify">
                    {contact.detailedAddress || "Not specified"}
                  </p>
                </div>
              </div>
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

export default ContactTab;
