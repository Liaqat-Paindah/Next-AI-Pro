"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/app/loading";
import { FileUpload } from "@/components/shared/drop_zone";
import { UseResearchSkills } from "@/hooks/useApplication";
import { Loader2 } from "lucide-react";

interface ResearchSkill {
  title: string;
  file: File;
}

// Define the expected payload type for the mutation
export interface ResearchSkillsPayload {
  hasResearchSkills: "Yes" | "No";
  researchSkills: ResearchSkill[];
  userId: string | undefined;
}

// Zod Validation Schema
const researchSkillSchema = z.object({
  title: z.string().min(1, "Research skill title is required"),
  file: z
    .instanceof(File, { message: "Document is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    }),
});

const researchSkillsSchema = z
  .object({
    hasResearchSkills: z.enum(["Yes", "No"]),
    researchSkills: z.array(researchSkillSchema),
  })
  .superRefine((data, ctx) => {
    // If hasResearchSkills is "Yes", validate that at least one skill has a title and file
    if (data.hasResearchSkills === "Yes") {
      const hasAtLeastOneValidSkill = data.researchSkills.some(
        (c) => c.title && c.title.trim() !== "",
      );

      if (!hasAtLeastOneValidSkill) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one research skill with a title is required",
          path: ["researchSkills"],
        });
      }

      // Also check if any skill has a file when skills exist
      if (data.researchSkills.length > 0) {
        const hasFileForSkill = data.researchSkills.every(
          (c) => c.file instanceof File,
        );
        if (!hasFileForSkill) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each research skill must have a file",
            path: ["researchSkills"],
          });
        }
      }
    }
  });

type ResearchSkillsFormData = z.infer<typeof researchSkillsSchema>;

interface Props {
  onChange?: (
    hasResearchSkills: "Yes" | "No",
    researchSkills: ResearchSkill[],
  ) => void;
}

// Icons
const Icons = {
  Skill: ({ className = "w-4 h-4" }) => (
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
  Add: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Remove: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
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
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// Form Input Component with proper typing - no any
interface FormInputProps {
  label: string;
  type: string;
  register: ReturnType<UseFormRegister<ResearchSkillsFormData>>;
  error?: string;
  placeholder: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  autoComplete?: string;
  id?: string;
  name?: string;
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
  min,
  max,
  step,
  autoComplete,
  id,
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
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          id={id}
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

const ResearchSkillsForm: React.FC<Props> = ({ onChange }) => {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = UseResearchSkills();

  // State to track if research skills are selected
  const [skillsSelected, setSkillsSelected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    control,
    trigger,
  } = useForm<ResearchSkillsFormData>({
    resolver: zodResolver(researchSkillsSchema),
    defaultValues: {
      hasResearchSkills: "No",
      researchSkills: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "researchSkills",
  });

  const hasResearchSkills = watch("hasResearchSkills");
  const researchSkills = watch("researchSkills");

  // Effect to handle hasResearchSkills change
  useEffect(() => {
    if (!hasResearchSkills) {
      setSkillsSelected(false);
      setValue("researchSkills", []);
      return;
    }

    setSkillsSelected(true);

    // Initialize with one empty skill if "Yes" is selected and no skills exist
    if (hasResearchSkills === "Yes" && fields.length === 0) {
      append({ title: "", file: undefined as unknown as File });
    }
  }, [hasResearchSkills, setValue, append, fields.length]);

  // Handle file changes separately (not through react-hook-form)
  const handleFileChange = (index: number, file: File) => {
    const currentSkills = getValues("researchSkills");
    const updatedSkills = [...currentSkills];
    updatedSkills[index] = { ...updatedSkills[index], file };
    setValue("researchSkills", updatedSkills);
    trigger(`researchSkills.${index}.file`);
    onChange?.(hasResearchSkills, updatedSkills);
  };

  const handleFileRemove = (index: number) => {
    const currentSkills = getValues("researchSkills");
    const updatedSkills = [...currentSkills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      file: undefined as unknown as File,
    };
    setValue("researchSkills", updatedSkills);
    trigger(`researchSkills.${index}.file`);
    onChange?.(hasResearchSkills, updatedSkills);
  };

  // Handle hasResearchSkills change
  const handleHasResearchSkillsChange = (value: "Yes" | "No") => {
    setValue("hasResearchSkills", value);
    if (value === "No") {
      setValue("researchSkills", []);
    }
    trigger("hasResearchSkills");
    onChange?.(value, value === "Yes" ? getValues("researchSkills") : []);
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

  const onSubmit = async (data: ResearchSkillsFormData) => {
    // Trigger validation first
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const submissionData: ResearchSkillsPayload = {
      hasResearchSkills: data.hasResearchSkills,
      researchSkills:
        data.hasResearchSkills === "Yes" ? data.researchSkills : [],
      userId: userSession?.user?._id,
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
                  Research Skills
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your research skills including proficiency in research
                  methods, data analysis, etc.
                </p>
              </div>

              {/* Global Error Display */}
              {errors.researchSkills && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.researchSkills.message}
                  </p>
                </div>
              )}

              {/* First Question - Research Skills */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Do you have any research skills to share? (proficiency in
                  research methods, data analysis, etc.){" "}
                  <span className="text-[#00A3FF] ml-1">*</span>
                </label>

                <div className="flex gap-8">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          value={option}
                          checked={hasResearchSkills === option}
                          onChange={() =>
                            handleHasResearchSkillsChange(
                              option as "Yes" | "No",
                            )
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-sm transition-all duration-300 ${
                            hasResearchSkills === option
                              ? "border-[#00A3FF] bg-[#00A3FF]"
                              : "border-gray-300 dark:border-[#064e78] group-hover:border-[#00A3FF]"
                          }`}
                        >
                          {hasResearchSkills === option && (
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
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.hasResearchSkills && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hasResearchSkills.message}
                  </p>
                )}
              </div>

              {/* Conditional research skill inputs */}
              {hasResearchSkills === "Yes" && (
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border border-gray-200 dark:border-[#064e78] rounded-sm p-6 space-y-4"
                    >
                      {/* Skill Number */}
                      <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-[#011b2b] text-xs font-medium text-[#004973]">
                        Research Skill {index + 1}
                      </div>

                      {/* Remove Button */}
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute -top-3 right-4 px-2 py-0.5 bg-white dark:bg-[#011b2b] text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 border border-gray-200 dark:border-[#064e78] rounded-sm"
                        >
                          <Icons.Remove className="w-3 h-3" />
                          Remove
                        </button>
                      )}

                      <div className="grid grid-cols-1 gap-4">
                        <FormInput
                          label="Research Skill Title"
                          type="text"
                          register={register(`researchSkills.${index}.title`)}
                          placeholder="e.g., Quantitative Analysis, Research Methodology, SPSS, etc."
                          icon={<Icons.Skill className="w-4 h-4" />}
                          error={errors.researchSkills?.[index]?.title?.message}
                          required
                        />

                        <FileUpload
                          id={`research-skill-file-${index}`}
                          label="Research Skill Document (Certificate, Publication, etc.)"
                          onFileAccepted={(file) =>
                            handleFileChange(index, file)
                          }
                          onFileRemove={() => handleFileRemove(index)}
                          error={errors.researchSkills?.[index]?.file?.message}
                          currentFile={researchSkills[index]?.file}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Research Skill Button */}
                  <button
                    type="button"
                    onClick={() =>
                      append({ title: "", file: undefined as unknown as File })
                    }
                    className="w-full relative group"
                  >
                    <div className="relative px-4 py-2 bg-white dark:bg-[#011b2b] border border-[#00A3FF] rounded-sm text-[#00A3FF] text-sm flex items-center justify-center gap-2 hover:bg-[#00A3FF] hover:text-white transition-colors">
                      <Icons.Add className="w-4 h-4" />
                      Add Another Research Skill
                    </div>
                  </button>
                </div>
              )}

              {/* No Research Skills Selected Message */}
              {!skillsSelected && hasResearchSkills === "No" && (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#022b40] rounded-sm">
                  <Icons.Skill className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    You have indicated that you do not have any research skills
                    to share.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    You can always add them later by updating your profile
                  </p>
                </div>
              )}

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
                  className={`flex-1 relative group ${
                    !hasResearchSkills ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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

export default ResearchSkillsForm;
