"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/app/loading";
import { FileUpload } from "@/components/shared/drop_zone";
import { useLanguage } from "@/hooks/useApplication";
import { languageSchema, LanguageFormData } from "@/schema/languageSchema";
import { LanguageIcons } from "@/components/dashboard/applicants/languageSkills/LanguageIcons";
import { Loader2 } from "lucide-react";

// Form Input Component
interface FormInputProps {
  label: string;
  type: string;
  register: ReturnType<UseFormRegister<LanguageFormData>>;
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

// Form Select Component
interface FormSelectProps {
  label: string;
  register: ReturnType<UseFormRegister<LanguageFormData>>;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}

const FormSelect = ({
  label,
  register,
  error,
  icon,
  required = false,
  children,
}: FormSelectProps) => {
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
          {children}
        </select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// Document Type Select Component (Only for Foreign Language)
interface DocumentTypeSelectProps {
  label: string;
  register: ReturnType<UseFormRegister<LanguageFormData>>;
  error?: string;
  required?: boolean;
}

const DocumentTypeSelect = ({
  label,
  register,
  error,
  required = false,
}: DocumentTypeSelectProps) => {
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          className={`w-full px-3 py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light appearance-none`}
          {...register}
        >
          <option value="">Select Document Type</option>
          <option value="Certificate">Certificate</option>
          <option value="Diploma">Diploma</option>
          <option value="Transcript">Transcript</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default function LanguageSkillsForm() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    mode: "onSubmit",
    defaultValues: {
      englishLevel: "",
      englishTest: "None",
      englishTestScore: "",
      englishCertificate: undefined,
      foreignLanguage: "",
      foreignLanguageLevel: undefined,
      foreignDocumentType: undefined,
      foreignCertificate: undefined,
      nativeLanguage: "",
      nativeLanguageLevel: undefined,
      localLanguage: "",
      localLanguageLevel: undefined,
      studiedLanguage: "",
      studiedLanguageDocument: undefined,
    },
  });

  const englishTest = watch("englishTest");
  const foreignLanguage = watch("foreignLanguage");

  // Handle file changes
  const handleEnglishCertificateChange = (file: File) => {
    setValue("englishCertificate", file);
  };

  const handleEnglishCertificateRemove = () => {
    setValue("englishCertificate", undefined);
  };

  const handleForeignCertificateChange = (file: File) => {
    setValue("foreignCertificate", file);
  };

  const handleForeignCertificateRemove = () => {
    setValue("foreignCertificate", undefined);
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

  const onSubmit = async (data: LanguageFormData) => {
    const submissionData = {
      ...data,
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
                  Language Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your language skills and proficiency
                </p>
              </div>

              {/* English Language Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-[#064e78] pb-2">
                  <LanguageIcons.English className="w-5 h-5 text-[#00A3FF]" />
                  <span className="text-sm font-medium">English Language</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="English Language Level"
                    register={register("englishLevel")}
                    error={errors.englishLevel?.message}
                    icon={<LanguageIcons.English className="w-4 h-4" />}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                  </FormSelect>

                  <FormSelect
                    label="English Test"
                    register={register("englishTest")}
                    error={errors.englishTest?.message}
                  >
                    <option value="None">None</option>
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="Duolingo">Duolingo</option>
                  </FormSelect>

                  {englishTest && englishTest !== "None" && (
                    <>
                      <FormInput
                        label={`${englishTest} Score`}
                        type="text"
                        register={register("englishTestScore")}
                        placeholder={`Example: ${
                          englishTest === "IELTS"
                            ? "7.0"
                            : englishTest === "TOEFL"
                              ? "100"
                              : "120"
                        }`}
                        error={errors.englishTestScore?.message}
                        required
                      />

                      <div className="md:col-span-1">
                        <FileUpload
                          id="english-certificate"
                          label="Upload English Certificate"
                          onFileAccepted={handleEnglishCertificateChange}
                          onFileRemove={handleEnglishCertificateRemove}
                          error={errors.englishCertificate?.message}
                          currentFile={getValues("englishCertificate")}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Native Language Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-[#064e78] pb-2">
                  <LanguageIcons.Native className="w-5 h-5 text-[#00A3FF]" />
                  <span className="text-sm font-medium">Native Language</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Native Language"
                    type="text"
                    register={register("nativeLanguage")}
                    placeholder="Example: English, Arabic, Chinese"
                    icon={<LanguageIcons.Native className="w-4 h-4" />}
                    required
                    error={errors.nativeLanguage?.message}
                  />

                  <FormSelect
                    label="Proficiency Level"
                    register={register("nativeLanguageLevel")}
                    error={errors.nativeLanguageLevel?.message}
                    icon={<LanguageIcons.Native className="w-4 h-4" />}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </FormSelect>
                </div>
              </div>

              {/* Foreign Language Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-[#064e78] pb-2">
                  <LanguageIcons.Foreign className="w-5 h-5 text-[#00A3FF]" />
                  <span className="text-sm font-medium">Foreign Language</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Foreign Language"
                    type="text"
                    register={register("foreignLanguage")}
                    placeholder="Example: German, French, Spanish"
                    icon={<LanguageIcons.Foreign className="w-4 h-4" />}
                  />

                  <FormSelect
                    label="Proficiency Level"
                    register={register("foreignLanguageLevel")}
                    error={errors.foreignLanguageLevel?.message}
                    icon={<LanguageIcons.Foreign className="w-4 h-4" />}
                  >
                    <option value="">Select Level</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                  </FormSelect>

                  {foreignLanguage && (
                    <>
                      <DocumentTypeSelect
                        label="Document Type"
                        register={register("foreignDocumentType")}
                        error={errors.foreignDocumentType?.message}
                        required
                      />

                      <div className="md:col-span-1">
                        <FileUpload
                          id="foreign-certificate"
                          label="Upload Supporting Document"
                          onFileAccepted={handleForeignCertificateChange}
                          onFileRemove={handleForeignCertificateRemove}
                          error={errors.foreignCertificate?.message}
                          currentFile={getValues("foreignCertificate")}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Local Language Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-[#064e78] pb-2">
                  <LanguageIcons.Local className="w-5 h-5 text-[#00A3FF]" />
                  <span className="text-sm font-medium">Local Language</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Local Language"
                    type="text"
                    register={register("localLanguage")}
                    placeholder="Example: Pashto, Dari"
                    icon={<LanguageIcons.Local className="w-4 h-4" />}
                  />

                  <FormSelect
                    label="Proficiency Level"
                    register={register("localLanguageLevel")}
                    error={errors.localLanguageLevel?.message}
                    icon={<LanguageIcons.Local className="w-4 h-4" />}
                  >
                    <option value="">Select Level</option>
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Fluent">Fluent</option>
                  </FormSelect>
                </div>
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
                  <div className="relative px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-medium text-sm flex items-center justify-center gap-2">
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <LanguageIcons.ArrowRight className="w-4 h-4" />
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
}