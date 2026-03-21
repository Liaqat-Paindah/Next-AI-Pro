"use client";

import Loading from "@/app/loading";
import { UsePersonalInformation } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfoFormData } from "@/types/application";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { UseFormRegister, FieldError } from "react-hook-form";

// Icons for the form
const Icons = {
  User: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Mail: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Passport: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 18h10" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Save: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
};

// Digital Cursor Component
const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 border-[#00A3FF] hidden lg:block mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

// Form Input Props Interface
interface FormInputProps {
  label: string;
  type: string;
  id: keyof PersonalInfoFormData;
  placeholder: string;
  required?: boolean;
  min?: string;
  register: UseFormRegister<PersonalInfoFormData>;
  error?: FieldError;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Form Input Component
const FormInput = ({
  label,
  type,
  id,
  placeholder,
  required,
  register,
  error,
  disabled,
  icon,
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {type === "select" ? (
          <select
            id={id}
            {...register(id)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
              error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
            } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light appearance-none ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {id === "gender" && (
              <>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </>
            )}
            {id === "maritalStatus" && (
              <>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Other">Engaged</option>
              </>
            )}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            {...register(id, type === "number" ? { valueAsNumber: true } : {})}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
              error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
            } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        )}

        {/* Digital Underline Effect */}
        {!disabled && (
          <motion.div
            className="absolute -bottom-px left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </motion.div>
  );
};

// Static Email Display Component
const StaticEmailDisplay = ({
  email,
  icon,
}: {
  email: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email <span className="text-[#00A3FF] ml-1">*</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <div className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white flex items-center">
          {email}
        </div>
      </div>
    </motion.div>
  );
};

export default function Personal() {
  const router = useRouter();
  const { data: UserSession, status } = useSession();
  const mutation = UsePersonalInformation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });
  const watchedMaritalStatus = watch("maritalStatus");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && UserSession?.user) {
      setValue("phone", UserSession.user.phone || "");
      setValue("email", UserSession.user.email || "");
      setValue("first_name", UserSession.user.first_name || "");
      setValue("last_name", UserSession.user.last_name || "");
    }
  }, [status, UserSession, setValue]);

  if (status === "loading") {
    return <Loading />;
  }
  if (status !== "authenticated") {
    return null;
  }

  const submit = (data: PersonalInfoFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-2">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
          <div className="" />

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-[#00A3FF]/10 dark:bg-[#00A3FF]/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#7000FF]/10 dark:bg-[#7000FF]/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative container">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 md:p-8 relative">
              <form onSubmit={handleSubmit(submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2 mb-4">
                      Personal Details
                    </h3>
                  </div>

                  <FormInput
                    label="First Name"
                    type="text"
                    id="first_name"
                    placeholder="Enter your first name"
                    required
                    register={register}
                    error={errors.first_name}
                    icon={<Icons.User className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Last Name"
                    type="text"
                    id="last_name"
                    placeholder="Enter your last name"
                    required
                    register={register}
                    error={errors.last_name}
                    icon={<Icons.User className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Father Name"
                    type="text"
                    id="fatherName"
                    placeholder="Enter your father's name"
                    required
                    register={register}
                    error={errors.fatherName}
                    icon={<Icons.User className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Mother Name"
                    type="string"
                    id="mother_name"
                    placeholder="Enter your Mother Name"
                    required
                    register={register}
                    error={errors.mother_name}
                    icon={<Icons.Calendar className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Number of siblings"
                    type="text"
                    id="siblings"
                    placeholder="Enter your siblings number"
                    required
                    register={register}
                    error={errors.siblings}
                    icon={<Icons.Calendar className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Number of dependents"
                    type="text"
                    id="dependents"
                    placeholder="Enter your dependents number"
                    required
                    register={register}
                    error={errors.dependents}
                    icon={<Icons.Calendar className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Gender"
                    type="select"
                    id="gender"
                    placeholder="Select Gender"
                    required
                    register={register}
                    error={errors.gender}
                  />

                  <FormInput
                    label="Marital Status"
                    type="select"
                    id="maritalStatus"
                    placeholder="Select Status"
                    required
                    register={register}
                    error={errors.maritalStatus}
                  />
                  {watchedMaritalStatus === "Married" && (
                    <FormInput
                      label="Number of Children (if any)"
                      type="text"
                      min="0"
                      id="children"
                      placeholder="Enter number of children"
                      register={register}
                      error={errors.children}
                      icon={<Icons.Calendar className="w-4 h-4" />}
                    />
                  )}

                  <FormInput
                    label="Birth Date"
                    type="date"
                    id="birthDate"
                    placeholder=""
                    required
                    register={register}
                    error={errors.birthDate}
                    icon={<Icons.Calendar className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Nationality"
                    type="text"
                    id="nationality"
                    placeholder="Enter your nationality"
                    required
                    register={register}
                    error={errors.nationality}
                    icon={<Icons.User className="w-4 h-4" />}
                  />

                  {/* Passport Details Section */}
                  <div className="space-y-4 md:col-span-2 mt-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2 mb-4">
                      ID & Passport Details
                    </h3>
                  </div>

                  <FormInput
                    label="National ID (Tazkira)"
                    type="text"
                    id="nationalId"
                    placeholder="Enter your national ID"
                    required
                    register={register}
                    error={errors.nationalId}
                    icon={<Icons.Passport className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Passport Number"
                    type="text"
                    id="passportId"
                    placeholder="Enter your passport number"
                    required
                    register={register}
                    error={errors.passportId}
                    icon={<Icons.Passport className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Passport Issue Date"
                    type="date"
                    id="dateofIssue"
                    placeholder=""
                    required
                    register={register}
                    error={errors.dateofIssue}
                    icon={<Icons.Calendar className="w-4 h-4" />}
                  />

                  <FormInput
                    label="Passport Expiry Date"
                    type="date"
                    id="dataofExpire"
                    placeholder=""
                    required
                    register={register}
                    error={errors.dataofExpire}
                    icon={<Icons.Calendar className="w-4 h-4" />}
                  />

                  {/* Contact Details Section */}
                  <div className="space-y-4 md:col-span-2 mt-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2 mb-4">
                      Contact Details
                    </h3>
                  </div>

                  <FormInput
                    label="Phone"
                    type="text"
                    id="phone"
                    placeholder="Enter your phone number"
                    required
                    register={register}
                    error={errors.phone}
                    icon={<Icons.Phone className="w-4 h-4" />}
                  />

                  {/* Static Email Display - Non-editable */}
                  <StaticEmailDisplay
                    email={UserSession?.user?.email || ""}
                    icon={<Icons.Mail className="w-4 h-4" />}
                  />

                  {/* Hidden input to submit email with form */}
                  <input
                    type="hidden"
                    {...register("email")}
                    value={UserSession?.user?.email || ""}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                  <motion.button
                    type="button"
                    onClick={() => router.back()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative group"
                  >
                    <div className="absolute -inset-0.5  rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="relative px-4 py-2  dark:bg-[#076094] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2  dark:border-[#5fb7e9]">
                      <span>Back</span>
                    </div>
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={mutation.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative group"
                  >
                    <div className="absolute -inset-0.5  rounded-sm opacity-75 group-hover:opacity-100" />
                    <div className="relative px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-medium text-sm flex items-center justify-center gap-2">
                      {mutation.isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Continue...</span>
                        </>
                      ) : (
                        <>
                          <span>Save & Continue</span>
                          <Icons.ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
