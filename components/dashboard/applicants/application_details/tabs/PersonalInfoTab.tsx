import { Application } from "@/types/application_details";
import {
  User,
  User2,
  Calendar,
  Heart,
  Users,
  Flag,
  Fingerprint,
  CreditCard,
  CalendarClock,
} from "lucide-react";
import { motion } from "framer-motion";

interface PersonalInfoTabProps {
  data: Application["personal"];
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
    <div className="w-full">
      {/* Header Section with Professional Spacing */}
      <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF] to-[#7000FF]">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 -z-10 rounded-sm bg-[#00A3FF]/30 blur-xl dark:bg-[#00A3FF]/50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personal details and identification information
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="px-6 sm:px-8 py-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20">
                <User className="h-5 w-5 text-[#00A3FF]" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {`${data.firstName} ${data.lastName}`}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {data.nationality || "Nationality not specified"}
                </p>
              </div>
            </div>

            {/* Age Badge */}
            {data.age && (
              <div className="rounded-sm bg-[#00A3FF]/10 px-3 py-1 text-xs font-medium text-[#00A3FF] dark:bg-[#00A3FF]/20 dark:text-[#00A3FF]">
                {data.age} years old
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <User className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Full Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {`${data.firstName} ${data.lastName}`}
                  </p>
                </div>
              </div>

              {/* Father's Name */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <User2 className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Father Name
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.fatherName || (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Calendar className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Date of Birth
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.birthDate ? formatDate(data.birthDate) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Heart className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Gender
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.gender ? (
                      data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase()
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Marital Status */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Users className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Marital Status
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.maritalStatus ? (
                      data.maritalStatus.split(" ").map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(" ")
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Identification */}
            <div className="space-y-4">
              {/* Nationality */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Flag className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Nationality
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.nationality ? (
                      data.nationality.split(" ").map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(" ")
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* National ID */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <Fingerprint className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    National ID
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {data.nationalId || (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Passport ID */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <CreditCard className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Passport ID
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {data.passportId || (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Passport Expiry */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
                  <CalendarClock className="h-4 w-4 text-[#00A3FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                    Passport Expiry
                  </p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.dataofExpire ? (
                      <>
                        {formatDate(data.dataofExpire)}
                        {new Date(data.dataofExpire) < new Date() && (
                          <span className="ml-2 inline-flex items-center rounded-sm bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
                            Expired
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Not provided
                      </span>
                    )}
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


export default PersonalInfoTab;