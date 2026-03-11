"use client";

import {  useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/app/loading";
import { FileUpload } from "@/components/shared/drop_zone";
import { UseSkills } from "@/hooks/useApplication";
import { Loader2 } from "lucide-react";

// Define the expected payload type for the mutation
export interface SkillsPayload {
  hasComputerSkills: "Yes" | "No";
  hasCommunicationSkills: "Yes" | "No";
  hasMediaContentCreation: "Yes" | "No";
  youtubeLink?: string;
  hasTeamworkSkills: "Yes" | "No";
  hasLeadershipSkills: "Yes" | "No";
  hasProblemSolving: "Yes" | "No";
  hasTimeManagement: "Yes" | "No";
  hasPresentationSkills: "Yes" | "No";
  computerSkillsFile?: File;
  userId: string;
}

// Zod Validation Schema
const skillsSchema = z
  .object({
    hasComputerSkills: z.enum(["Yes", "No"]),
    hasCommunicationSkills: z.enum(["Yes", "No"]),
    hasMediaContentCreation: z.enum(["Yes", "No"]),
    youtubeLink: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    hasTeamworkSkills: z.enum(["Yes", "No"]),
    hasLeadershipSkills: z.enum(["Yes", "No"]),
    hasProblemSolving: z.enum(["Yes", "No"]),
    hasTimeManagement: z.enum(["Yes", "No"]),
    hasPresentationSkills: z.enum(["Yes", "No"]),
    computerSkillsFile: z
      .instanceof(File, { message: "Document is required" })
      .refine((file) => file.size <= 10 * 1024 * 1024, {
        message: "File size must be less than 10MB",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // If hasComputerSkills is "Yes", validate that a file is provided
    if (data.hasComputerSkills === "Yes" && !data.computerSkillsFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Computer skills document is required",
        path: ["computerSkillsFile"],
      });
    }

    // If hasMediaContentCreation is "Yes", validate that youtubeLink is provided
    if (data.hasMediaContentCreation === "Yes" && !data.youtubeLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "YouTube link is required",
        path: ["youtubeLink"],
      });
    }
  });

type SkillsFormData = z.infer<typeof skillsSchema>;

interface Props {
  onChange?: (data: Partial<SkillsPayload>) => void;
}

// Icons
const Icons = {
  Computer: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Communication: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Media: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  ),
  Teamwork: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 20v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
      <circle cx="4" cy="4" r="2" />
      <circle cx="20" cy="4" r="2" />
    </svg>
  ),
  Leadership: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  ProblemSolving: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  TimeManagement: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Presentation: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
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
  register: ReturnType<UseFormRegister<SkillsFormData>>;
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

const SkillsForm: React.FC<Props> = ({ onChange }) => {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = UseSkills();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      hasComputerSkills: "No",
      hasCommunicationSkills: "No",
      hasMediaContentCreation: "No",
      youtubeLink: "",
      hasTeamworkSkills: "No",
      hasLeadershipSkills: "No",
      hasProblemSolving: "No",
      hasTimeManagement: "No",
      hasPresentationSkills: "No",
      computerSkillsFile: undefined,
    },
  });

  const hasComputerSkills = watch("hasComputerSkills");
  const hasMediaContentCreation = watch("hasMediaContentCreation");

  // Handle file changes
  const handleFileChange = (file: File) => {
    setValue("computerSkillsFile", file);
    trigger("computerSkillsFile");
    onChange?.({
      hasComputerSkills,
      computerSkillsFile: file,
    });
  };

  const handleFileRemove = () => {
    setValue("computerSkillsFile", undefined);
    trigger("computerSkillsFile");
    onChange?.({
      hasComputerSkills,
      computerSkillsFile: undefined,
    });
  };

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

  const onSubmit = async (data: SkillsFormData) => {
    // Trigger validation first
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const submissionData: SkillsPayload = {
      hasComputerSkills: data.hasComputerSkills,
      hasCommunicationSkills: data.hasCommunicationSkills,
      hasMediaContentCreation: data.hasMediaContentCreation,
      youtubeLink: data.youtubeLink,
      hasTeamworkSkills: data.hasTeamworkSkills,
      hasLeadershipSkills: data.hasLeadershipSkills,
      hasProblemSolving: data.hasProblemSolving,
      hasTimeManagement: data.hasTimeManagement,
      hasPresentationSkills: data.hasPresentationSkills,
      computerSkillsFile: data.computerSkillsFile,
      userId: userSession?.user?._id || '',
    };

    mutation.mutate(submissionData);
  };

  // Radio button component
  const RadioOption = ({
    name,
    label,
    icon,
  }: {
    name: keyof SkillsFormData;
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
                  onChange={(e) =>
                    setValue(name, e.target.value as "Yes" | "No")
                  }
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
                  Professional Skills
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your professional skills and competencies
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Computer Skills */}
                <div className="space-y-4">
                  <RadioOption
                    name="hasComputerSkills"
                    label="Computer Skills"
                    icon={<Icons.Computer className="w-4 h-4 text-[#00A3FF]" />}
                  />

                  {hasComputerSkills === "Yes" && (
                    <div className="mt-4 pl-4 border-l-2 border-[#00A3FF]">
                      <FileUpload
                        id="computer-skills-file"
                        label="Upload Document (Certificate)"
                        onFileAccepted={handleFileChange}
                        onFileRemove={handleFileRemove}
                        error={errors.computerSkillsFile?.message}
                        currentFile={getValues("computerSkillsFile")}
                      />
                    </div>
                  )}
                </div>

                {/* Communication Skills */}
                <RadioOption
                  name="hasCommunicationSkills"
                  label="Communication Skills"
                  icon={<Icons.Communication className="w-4 h-4 text-[#00A3FF]" />}
                />

                {/* Media Content Creation */}
                <div className="space-y-4">
                  <RadioOption
                    name="hasMediaContentCreation"
                    label="Media Content Creation"
                    icon={<Icons.Media className="w-4 h-4 text-[#00A3FF]" />}
                  />

                  {hasMediaContentCreation === "Yes" && (
                    <div className="mt-4 pl-4 border-l-2 border-[#00A3FF]">
                      <FormInput
                        label="YouTube Channel or Video Link"
                        type="url"
                        register={register("youtubeLink")}
                        placeholder="https://youtube.com/..."
                        icon={<Icons.Media className="w-4 h-4" />}
                        error={errors.youtubeLink?.message}
                      />
                    </div>
                  )}
                </div>

                {/* Teamwork Skills */}
                <RadioOption
                  name="hasTeamworkSkills"
                  label="Teamwork Skills"
                  icon={<Icons.Teamwork className="w-4 h-4 text-[#00A3FF]" />}
                />

                {/* Leadership Skills */}
                <RadioOption
                  name="hasLeadershipSkills"
                  label="Leadership Skills"
                  icon={<Icons.Leadership className="w-4 h-4 text-[#00A3FF]" />}
                />

                {/* Problem Solving */}
                <RadioOption
                  name="hasProblemSolving"
                  label="Problem Solving"
                  icon={<Icons.ProblemSolving className="w-4 h-4 text-[#00A3FF]" />}
                />

                {/* Time Management */}
                <RadioOption
                  name="hasTimeManagement"
                  label="Time Management"
                  icon={<Icons.TimeManagement className="w-4 h-4 text-[#00A3FF]" />}
                />

                {/* Presentation Skills */}
                <RadioOption
                  name="hasPresentationSkills"
                  label="Presentation Skills"
                  icon={<Icons.Presentation className="w-4 h-4 text-[#00A3FF]" />}
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

export default SkillsForm;