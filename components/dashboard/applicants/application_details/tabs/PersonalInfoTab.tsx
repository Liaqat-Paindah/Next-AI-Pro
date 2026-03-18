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
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500 dark:text-gray-400">
          Personal details and identification information.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-200 dark:border-white/10">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {/* Column 1 */}
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Full name
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {`${data.firstName} ${data.lastName}`}
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <User2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Father name
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {data.fatherName}
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Date of birth
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {formatDate(data.birthDate)} ({data.age} years)
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <Heart className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Gender
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {data.gender}
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Marital status
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {data.maritalStatus}
              </dd>
            </div>
          </div>

          {/* Column 2 */}
          <div className="divide-y divide-gray-200 dark:divide-white/10">
            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <Flag className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Nationality
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {data.nationality}
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <Fingerprint className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                National ID
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {data.nationalId}
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <CreditCard className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Passport ID
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {data.passportId}
              </dd>
            </div>

            <div className="py-3 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="flex items-center gap-2 text-sm/6 font-medium text-gray-700 dark:text-gray-100">
                <CalendarClock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                Passport expiry
              </dt>
              <dd className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400 sm:col-span-2 sm:mt-0">
                {formatDate(data.dataofExpire)}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PersonalInfoTab;