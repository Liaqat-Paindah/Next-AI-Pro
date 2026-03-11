"use client";

import { useSpecialConditions } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { specialConditionsSchema, SpecialConditionsFormData } from "@/types/application";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { UseFormRegister, FieldError } from "react-hook-form";
import Loading from "@/app/loading";

// Icons for the form
const Icons = {
  Activity: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Heart: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Wheelchair: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="16" cy="4" r="1" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 12L9 20l5-4 4 4 2-3" />
      <path d="M9 12V9a3 3 0 0 1 3-3h4" />
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
  id: keyof SpecialConditionsFormData;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<SpecialConditionsFormData>;
  error?: FieldError;
  disabled?: boolean;
  icon?: React.ReactNode;
  rows?: number;
}

// Form Input Component (Textarea variant for this use case)
const FormTextArea = ({
  label,
  id,
  placeholder,
  required,
  register,
  error,
  disabled,
  icon,
  rows = 3,
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
          <div className="absolute left-3 top-3 text-gray-400">
            {icon}
          </div>
        )}

        <textarea
          id={id}
          {...register(id)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          rows={rows}
          className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light resize-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

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

export default function SpecialConditions() {
  const router = useRouter();
  const { data: UserSession, status } = useSession();
  const mutation = useSpecialConditions(); // You might want to create a separate hook for this

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SpecialConditionsFormData>({
    resolver: zodResolver(specialConditionsSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }
  if (status !== "authenticated") {
    return null;
  }

  const submit = (data: SpecialConditionsFormData) => {
    // Add userId to the data before submitting
    const payload = {
      ...data,
      userId: UserSession?.user?._id as string,
    };
    mutation.mutate(payload);
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-2">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
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
                <div className="grid grid-cols-1 gap-6">
                  {/* Header Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2 mb-4">
                      Special Health Conditions
                    </h3>

                  </div>

                  {/* Special Diseases Input */}
                  <FormTextArea
                    label="Special Diseases / Chronic Illnesses"
                    type="text"
                    id="specialDisease"
                    placeholder="Enter any chronic illnesses or special diseases (e.g., diabetes, hypertension, asthma)..."
                    register={register}
                    error={errors.specialDisease}
                    icon={<Icons.Activity className="w-4 h-4" />}
                    rows={4}
                  />

                  {/* Physical Disability Input */}
                  <FormTextArea
                    label="Physical Disability Requiring Accommodations"
                    type="text"
                    id="physicalDisability"
                    placeholder="Enter any physical disabilities or accommodation needs (e.g., wheelchair access, mobility assistance)..."
                    register={register}
                    error={errors.physicalDisability}
                    icon={<Icons.Wheelchair className="w-4 h-4" />}
                    rows={4}
                  />

                  {/* Additional Notes Section (Optional) */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      This information helps us make necessary arrangements for your comfort and safety during the pilgrimage.
                    </p>
                  </div>
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
                    <div className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="relative px-4 py-2 dark:bg-[#076094] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 dark:border-[#5fb7e9]">
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
                    <div className="absolute -inset-0.5 rounded-sm opacity-75 group-hover:opacity-100" />
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
                          <span>Saving...</span>
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