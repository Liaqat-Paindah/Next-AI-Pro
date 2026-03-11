"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/app/loading";
import { Loader2 } from "lucide-react";
import { useFinancialInfo } from "@/hooks/useApplication";

export type YesNo = "Yes" | "No";

// Define the expected payload type for the mutation
export interface FinancialInfoPayload {
  familyIncome: string;
  tuitionAbility: string;
  transportAbility: YesNo;
  userId: string;
}

// Zod Validation Schema - simple string validation
const financialInfoSchema = z.object({
  familyIncome: z.string().min(1, "Family income is required"),
  tuitionAbility: z
    .string()
    .min(1, "Please select your ability to pay tuition fees"),
  transportAbility: z
    .string()
    .min(1, "Please select your ability to pay transportation costs"),
});

type FinancialInfoFormData = z.infer<typeof financialInfoSchema>;

interface Props {
  onChange?: (data: Partial<FinancialInfoPayload>) => void;
}

// Icons
const Icons = {
  Income: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v20M17 5H9.5M17 12h-5M17 19h-5" />
      <path d="M5 5h14v14H5z" />
    </svg>
  ),
  Tuition: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Transport: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <circle cx="8" cy="17" r="2" />
      <circle cx="16" cy="17" r="2" />
      <line x1="10" y1="7" x2="14" y2="7" />
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

// Form Input Component
interface FormInputProps {
  label: string;
  type: string;
  register: ReturnType<UseFormRegister<FinancialInfoFormData>>;
  error?: string;
  placeholder: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

const FormInput = ({
  label,
  type,
  register,
  error,
  placeholder,
  icon,
  required = false,
  disabled,
  readOnly,
}: FormInputProps) => {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light`}
          {...register}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Select Input Component
interface SelectInputProps {
  label: string;
  register: ReturnType<UseFormRegister<FinancialInfoFormData>>;
  error?: string;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
}

const SelectInput = ({
  label,
  register,
  error,
  options,
  icon,
  required = false,
  placeholder = "Select an option",
}: SelectInputProps) => {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400 z-10">{icon}</div>
        )}

        <select
          className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light appearance-none`}
          {...register}
        >
          <option value="" className="text-gray-400 dark:text-gray-600">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Radio Option Component
interface RadioOptionProps {
  name: string;
  label: string;
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
  error?: string;
}

const RadioOption = ({
  name,
  label,
  value,
  onChange,
  error,
}: RadioOptionProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
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
                name={name}
                value={option}
                checked={value === option}
                onChange={() => onChange(option as "Yes" | "No")}
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const FinancialInformationForm: React.FC<Props> = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = useFinancialInfo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FinancialInfoFormData>({
    resolver: zodResolver(financialInfoSchema),
    defaultValues: {
      familyIncome: "",
      tuitionAbility: "",
      transportAbility: "No",
    },
  });

  const transportAbility = watch("transportAbility") as YesNo;

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

  const onSubmit = async (data: FinancialInfoFormData) => {
    // Trigger validation first
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const submissionData: FinancialInfoPayload = {
      familyIncome: data.familyIncome,
      tuitionAbility: data.tuitionAbility,
      transportAbility: data.transportAbility as YesNo, // Type assertion here since we know it will be "Yes" or "No"
      userId: userSession?.user?._id || "",
    };

    mutation.mutate(submissionData);
  };

  return (
    <section className="relative w-full overflow-hidden py-2">
      <div className="relative container">
        {/* Form Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 md:p-8 relative">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-[#064e78] pb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                  Financial Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Provide details about your financial situation
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-6">
                {/* Family Income */}
                <FormInput
                  label="Approximate Family Income in Afghani (Monthly)"
                  type="number"
                  register={register("familyIncome")}
                  placeholder="Example: 25000 AFN"
                  icon={<Icons.Income className="w-4 h-4" />}
                  error={errors.familyIncome?.message}
                  required
                />

                {/* Ability to Pay Tuition Fees */}
                <SelectInput
                  label="Ability to Pay Educational/Tuition Fees"
                  register={register("tuitionAbility")}
                  error={errors.tuitionAbility?.message}
                  icon={<Icons.Tuition className="w-4 h-4" />}
                  required
                  options={[
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" },
                    { value: "None", label: "None" },
                  ]}
                  placeholder="Select your ability to pay"
                />

                {/* Ability to Pay Transportation Costs */}
                <RadioOption
                  name="transportAbility"
                  label="Ability to Pay Transportation Costs (Travel to and from the institution)"
                  value={transportAbility}
                  onChange={(value) => setValue("transportAbility", value)}
                  error={errors.transportAbility?.message}
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 relative group"
                >
                  <div className="relative px-4 py-2 bg-transparent border border-gray-300 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 hover:border-[#00A3FF] transition-colors">
                    <span>Back</span>
                  </div>
                </button>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 relative group"
                >
                  <div className="absolute -inset-0.5 rounded-sm opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
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
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialInformationForm;
