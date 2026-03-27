"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { UseFormRegister } from "react-hook-form";
import Loading from "@/app/loading";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useSpecialConditions } from "@/hooks/useApplication";

// Define the form data type
export interface SpecialConditionsFormData {
  hasSpecialDisease: "Yes" | "No";
  specialDiseaseDescription?: string;
  hasPhysicalDisability: "Yes" | "No";
  physicalDisabilityDescription?: string;
}

// Zod Validation Schema
const specialConditionsSchema = z
  .object({
    hasSpecialDisease: z.enum(["Yes", "No"]),
    specialDiseaseDescription: z.string().optional(),
    hasPhysicalDisability: z.enum(["Yes", "No"]),
    physicalDisabilityDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If hasSpecialDisease is "Yes", validate that description is provided
    if (
      data.hasSpecialDisease === "Yes" &&
      !data.specialDiseaseDescription?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe your condition",
        path: ["specialDiseaseDescription"],
      });
    }

    // If hasPhysicalDisability is "Yes", validate that description is provided
    if (
      data.hasPhysicalDisability === "Yes" &&
      !data.physicalDisabilityDescription?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe your disability and accommodation needs",
        path: ["physicalDisabilityDescription"],
      });
    }
  });

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

// Form TextArea Component
interface FormTextAreaProps {
  label: string;
  register: UseFormRegister<SpecialConditionsFormData>;
  error?: string;
  placeholder: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  fieldName: keyof SpecialConditionsFormData;
}

const FormTextArea = ({
  label,
  register,
  error,
  placeholder,
  icon,
  required = false,
  disabled,
  rows = 4,
  fieldName,
}: FormTextAreaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}

        <textarea
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          rows={rows}
          className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light resize-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          {...register(fieldName)}
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

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </motion.div>
  );
};

export default function SpecialConditions() {
  const router = useRouter();
  const { data: UserSession, status } = useSession();
  const mutation = useSpecialConditions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<SpecialConditionsFormData>({
    resolver: zodResolver(specialConditionsSchema),
    defaultValues: {
      hasSpecialDisease: "No",
      specialDiseaseDescription: "",
      hasPhysicalDisability: "No",
      physicalDisabilityDescription: "",
    },
  });

  const hasSpecialDisease = watch("hasSpecialDisease");
  const hasPhysicalDisability = watch("hasPhysicalDisability");

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

  // Radio button component
  const RadioOption = ({
    name,
    label,
    icon,
  }: {
    name: keyof SpecialConditionsFormData;
    label: string;
    icon: React.ReactNode;
  }) => {
    const value = watch(name) as "Yes" | "No";

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex gap-6">
          {["Yes", "No"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="radio"
                  value={option}
                  checked={value === option}
                  onChange={() => setValue(name, option as "Yes" | "No")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-sm transition-all duration-300 ${
                    value === option
                      ? "border-[#00A3FF] bg-[#00A3FF]"
                      : "border border-gray-300 dark:border-[#064e78] group-hover:border-[#00A3FF]"
                  }`}
                >
                  {value === option && (
                    <svg
                      className="w-full h-full text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {option}
              </span>
            </label>
          ))}
        </div>
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
        )}
      </div>
    );
  };

  const submit = async (data: SpecialConditionsFormData) => {
    // Trigger validation first
    const isValid = await trigger();
    if (!isValid) return;

    // Transform data to match the expected payload
    const payload = {
      specialDisease:
        data.hasSpecialDisease === "Yes"
          ? data.specialDiseaseDescription?.trim() || "No"
          : "No",
      physicalDisability:
        data.hasPhysicalDisability === "Yes"
          ? data.physicalDisabilityDescription?.trim() || "No"
          : "No",
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
              <form onSubmit={handleSubmit(submit)} className="space-y-8">
                {/* Header Section */}
                <div className="border-b border-gray-200 dark:border-[#064e78] pb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                    Health Condition
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Please indicate if you have any conditions that may require
                    accommodations
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Special Diseases Section */}
                  <div className="space-y-4">
                    <RadioOption
                      name="hasSpecialDisease"
                      label="Special Diseases / Chronic Illnesses"
                      icon=""
                    />

                    {hasSpecialDisease === "Yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pl-4 border-l-2 border-[#00A3FF]"
                      >
                        <FormTextArea
                          label="Describe your condition"
                          register={register}
                          fieldName="specialDiseaseDescription"
                          placeholder="Please describe your chronic illness, treatment requirements, and any accommodations needed..."
                          icon=""
                          error={errors.specialDiseaseDescription?.message}
                          required
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Physical Disability Section */}
                  <div className="space-y-4">
                    <RadioOption
                      name="hasPhysicalDisability"
                      label="Physical Disability Requiring Accommodations"
                      icon=""
                    />

                    {hasPhysicalDisability === "Yes" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pl-4 border-l-2 border-[#00A3FF]"
                      >
                        <FormTextArea
                          label="Describe your needs"
                          register={register}
                          fieldName="physicalDisabilityDescription"
                          placeholder="Please describe your disability, mobility needs, and required accommodations..."
                          icon=""
                          error={errors.physicalDisabilityDescription?.message}
                          required
                        />
                      </motion.div>
                    )}
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
                    <div className="relative px-4 py-2 bg-transparent border border-gray-300 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 hover:border-[#00A3FF] transition-colors">
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
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
