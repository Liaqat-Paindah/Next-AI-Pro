"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/app/loading";
import { FileUpload } from "@/components/shared/drop_zone";
import { UseAcademicAwards } from "@/hooks/useApplication";
import { Loader2 } from "lucide-react";

interface AcademicAward {
  title: string;
  file: File;
}

// Define the expected payload type for the mutation
export interface AcademicAwardsPayload {
  hasAcademicAwards: "Yes" | "No";
  academicAwards: AcademicAward[];
  userId: string | undefined;
}

// Zod Validation Schema
const academicAwardSchema = z.object({
  title: z.string().min(1, "Academic award title is required"),
  file: z
    .instanceof(File, { message: "Document is required" })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "File size must be less than 10MB",
    }),
});

const academicAwardsSchema = z
  .object({
    hasAcademicAwards: z.enum(["Yes", "No"]),
    academicAwards: z.array(academicAwardSchema),
  })
  .superRefine((data, ctx) => {
    // If hasAcademicAwards is "Yes", validate that at least one award has a title and file
    if (data.hasAcademicAwards === "Yes") {
      const hasAtLeastOneValidAward = data.academicAwards.some(
        (c) => c.title && c.title.trim() !== "",
      );

      if (!hasAtLeastOneValidAward) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one academic award with a title is required",
          path: ["academicAwards"],
        });
      }

      // Also check if any award has a file when awards exist
      if (data.academicAwards.length > 0) {
        const hasFileForAward = data.academicAwards.every(
          (c) => c.file instanceof File,
        );
        if (!hasFileForAward) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Each academic award must have a file",
            path: ["academicAwards"],
          });
        }
      }
    }
  });

type AcademicAwardsFormData = z.infer<typeof academicAwardsSchema>;

interface Props {
  onChange?: (hasAcademicAwards: "Yes" | "No", academicAwards: AcademicAward[]) => void;
}

// Icons
const Icons = {
  Award: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
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
  register: ReturnType<UseFormRegister<AcademicAwardsFormData>>;
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

const AcademicAwardsForm: React.FC<Props> = ({ onChange }) => {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = UseAcademicAwards();

  // State to track if academic awards are selected
  const [awardsSelected, setAwardsSelected] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    control,
    trigger,
  } = useForm<AcademicAwardsFormData>({
    resolver: zodResolver(academicAwardsSchema),
    defaultValues: {
      hasAcademicAwards: "No",
      academicAwards: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "academicAwards",
  });

  const hasAcademicAwards = watch("hasAcademicAwards");
  const academicAwards = watch("academicAwards");

  // Effect to handle hasAcademicAwards change
  useEffect(() => {
    if (!hasAcademicAwards) {
      setAwardsSelected(false);
      setValue("academicAwards", []);
      return;
    }

    setAwardsSelected(true);

    // Initialize with one empty award if "Yes" is selected and no awards exist
    if (hasAcademicAwards === "Yes" && fields.length === 0) {
      append({ title: "", file: undefined as unknown as File });
    }
  }, [hasAcademicAwards, setValue, append, fields.length]);

  // Handle file changes separately (not through react-hook-form)
  const handleFileChange = (index: number, file: File) => {
    const currentAwards = getValues("academicAwards");
    const updatedAwards = [...currentAwards];
    updatedAwards[index] = { ...updatedAwards[index], file };
    setValue("academicAwards", updatedAwards);
    trigger(`academicAwards.${index}.file`);
    onChange?.(hasAcademicAwards, updatedAwards);
  };

  const handleFileRemove = (index: number) => {
    const currentAwards = getValues("academicAwards");
    const updatedAwards = [...currentAwards];
    updatedAwards[index] = {
      ...updatedAwards[index],
      file: undefined as unknown as File,
    };
    setValue("academicAwards", updatedAwards);
    trigger(`academicAwards.${index}.file`);
    onChange?.(hasAcademicAwards, updatedAwards);
  };

  // Handle hasAcademicAwards change
  const handleHasAcademicAwardsChange = (value: "Yes" | "No") => {
    setValue("hasAcademicAwards", value);
    if (value === "No") {
      setValue("academicAwards", []);
    }
    trigger("hasAcademicAwards");
    onChange?.(value, value === "Yes" ? getValues("academicAwards") : []);
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

  const onSubmit = async (data: AcademicAwardsFormData) => {
    // Trigger validation first
    const isValid = await trigger();

    if (!isValid) {
      return;
    }

    const submissionData: AcademicAwardsPayload = {
      hasAcademicAwards: data.hasAcademicAwards,
      academicAwards: data.hasAcademicAwards === "Yes" ? data.academicAwards : [],
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
                  Academic Awards
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your academic awards, honors, and recognitions
                </p>
              </div>

              {/* Global Error Display */}
              {errors.academicAwards && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.academicAwards.message}
                  </p>
                </div>
              )}

              {/* First Question - Academic Awards */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Have you received any academic awards or honors?{" "}
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
                          checked={hasAcademicAwards === option}
                          onChange={() =>
                            handleHasAcademicAwardsChange(option as "Yes" | "No")
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-sm transition-all duration-300 ${
                            hasAcademicAwards === option
                              ? "border-[#00A3FF] bg-[#00A3FF]"
                              : "border-gray-300 dark:border-[#064e78] group-hover:border-[#00A3FF]"
                          }`}
                        >
                          {hasAcademicAwards === option && (
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
                {errors.hasAcademicAwards && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.hasAcademicAwards.message}
                  </p>
                )}
              </div>

              {/* Conditional academic award inputs */}
              {hasAcademicAwards === "Yes" && (
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border border-gray-200 dark:border-[#064e78] rounded-sm p-6 space-y-4"
                    >
                      {/* Award Number */}
                      <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-[#011b2b] text-xs font-medium text-[#004973]">
                        Academic Award {index + 1}
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
                          label="Award Title"
                          type="text"
                          register={register(`academicAwards.${index}.title`)}
                          placeholder="e.g., Dean's List, Merit Scholarship, Research Excellence Award"
                          icon={<Icons.Award className="w-4 h-4" />}
                          error={errors.academicAwards?.[index]?.title?.message}
                          required
                        />

                        <FileUpload
                          id={`academic-award-file-${index}`}
                          label="Award Document (Certificate, Letter, etc.)"
                          onFileAccepted={(file) =>
                            handleFileChange(index, file)
                          }
                          onFileRemove={() => handleFileRemove(index)}
                          error={errors.academicAwards?.[index]?.file?.message}
                          currentFile={academicAwards[index]?.file}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add Academic Award Button */}
                  <button
                    type="button"
                    onClick={() =>
                      append({ title: "", file: undefined as unknown as File })
                    }
                    className="w-full relative group"
                  >
                    <div className="relative px-4 py-2 bg-white dark:bg-[#011b2b] border border-[#00A3FF] rounded-sm text-[#00A3FF] text-sm flex items-center justify-center gap-2 hover:bg-[#00A3FF] hover:text-white transition-colors">
                      <Icons.Add className="w-4 h-4" />
                      Add Another Academic Award
                    </div>
                  </button>
                </div>
              )}

              {/* No Academic Awards Selected Message */}
              {!awardsSelected && hasAcademicAwards === "No" && (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#022b40] rounded-sm">
                  <Icons.Award className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    You have indicated that you do not have any academic awards to share.
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
                    !hasAcademicAwards ? "opacity-50 cursor-not-allowed" : ""
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

export default AcademicAwardsForm;