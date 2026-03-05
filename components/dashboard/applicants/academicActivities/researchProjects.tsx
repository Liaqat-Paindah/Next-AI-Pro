"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { FileUpload } from "@/components/shared/drop_zone";

interface ResearchProject {
  title: string;
  file?: File;
}

interface Props {
  onChange?: (hasProjects: "Yes" | "No", projects: ResearchProject[]) => void;
}

// Icons for the form
const Icons = {
  Project: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
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
};

// Zod Validation Schema - Fixed version
const researchProjectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  file: z.instanceof(File).optional(),
});

const researchProjectsSchema = z.object({
  hasProjects: z.enum(["Yes", "No"]),
  projects: z.array(researchProjectSchema).superRefine((projects, ctx) => {
    // If hasProjects is "Yes", validate that at least one project has a title
    const hasAtLeastOneValidProject = projects.some(
      (p) => p.title && p.title.trim() !== "",
    );
    if (!hasAtLeastOneValidProject) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one project with a title is required",
        path: ["projects"],
      });
    }
  }),
});

type ResearchProjectsFormData = z.infer<typeof researchProjectsSchema>;

// Form Input Component
const FormInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  error,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
  error?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        <span className="text-[#00A3FF] ml-1">*</span>
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light`}
        />

        {/* Digital Underline Effect */}
        <motion.div
          className="absolute -bottom-px left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </motion.div>
  );
};

const ResearchProjectsForm: React.FC<Props> = ({ onChange }) => {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const [hasProjects, setHasProjects] = useState<"Yes" | "No">("No");
  const [projects, setProjects] = useState<ResearchProject[]>([
    { title: "", file: undefined },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  // Validate form
  const validateForm = (): boolean => {
    try {
      const formData: ResearchProjectsFormData = {
        hasProjects,
        projects: projects.filter((p) => p.title.trim() !== ""),
      };
      researchProjectsSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join(".");
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle Yes/No change
  const handleHasProjectsChange = (value: "Yes" | "No") => {
    setHasProjects(value);
    if (value === "No") {
      setProjects([]);
      onChange?.(value, []);
      setErrors({});
    } else {
      setProjects([{ title: "", file: undefined }]);
      onChange?.(value, [{ title: "", file: undefined }]);
    }
  };

  // Handle title change
  const handleTitleChange = (index: number, value: string) => {
    const updated = [...projects];
    updated[index].title = value;
    setProjects(updated);
    onChange?.(hasProjects, updated);

    // Clear error for this field
    if (errors[`projects.${index}.title`]) {
      const newErrors = { ...errors };
      delete newErrors[`projects.${index}.title`];
      setErrors(newErrors);
    }
  };

  // Handle file change
  const handleFileChange = (index: number, file: File | undefined) => {
    const updated = [...projects];
    updated[index].file = file;
    setProjects(updated);
    onChange?.(hasProjects, updated);
  };

  // Handle file remove
  const handleFileRemove = (index: number) => {
    const updated = [...projects];
    updated[index].file = undefined;
    setProjects(updated);
    onChange?.(hasProjects, updated);
  };

  // Add new project
  const addProject = () => {
    setProjects([...projects, { title: "", file: undefined }]);
  };

  // Remove project
  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    onChange?.(hasProjects, updated);

    // Clear errors for removed project
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`projects.${index}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsPending(true);

      // Simulate API call - replace with actual mutation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log({
        hasResearchProjects: hasProjects,
        researchProjects: hasProjects === "Yes" ? projects : [],
        userId: userSession?.user?._id,
      });

      setIsPending(false);

      // Navigate to next step or show success
      // router.push("/next-step");
    }
  };

  return (
    <section className="relative w-full overflow-hidden py-2">
      {/* Digital Grid Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 dark:bg-[#00A3FF]/5 rounded-full"
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
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-gray-200 dark:border-[#064e78] pb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wider">
                  Research Projects
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Share your research projects and related documents
                </p>
              </div>

              {/* Global Error Display */}
              {errors.projects && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-sm p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {errors.projects}
                  </p>
                </div>
              )}

              {/* First Question - Digital Radio */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Do you have any research projects?
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
                          checked={hasProjects === option}
                          onChange={() =>
                            handleHasProjectsChange(option as "Yes" | "No")
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-sm transition-all duration-300 ${
                            hasProjects === option
                              ? "border-[#00A3FF] bg-[#00A3FF]"
                              : "border-gray-300 dark:border-[#064e78] group-hover:border-[#00A3FF]"
                          }`}
                        >
                          {hasProjects === option && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </motion.svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional project inputs */}
              {hasProjects === "Yes" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative border border-gray-200 dark:border-[#064e78] rounded-sm p-6 space-y-4"
                    >
                      {/* Project Number */}
                      <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-[#011b2b] text-xs font-medium text-[#00A3FF]">
                        Project {index + 1}
                      </div>

                      {/* Remove Button */}
                      {projects.length > 1 && (
                        <motion.button
                          type="button"
                          onClick={() => removeProject(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute -top-3 right-4 px-2 py-0.5 bg-white dark:bg-[#011b2b] text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 border border-gray-200 dark:border-[#064e78] rounded-sm"
                        >
                          <Icons.Remove className="w-3 h-3" />
                          Remove
                        </motion.button>
                      )}

                      <div className="grid grid-cols-1 gap-4">
                        <FormInput
                          label="Project Title"
                          type="text"
                          value={project.title}
                          onChange={(e) =>
                            handleTitleChange(index, e.target.value)
                          }
                          placeholder="Enter project title"
                          icon={<Icons.Project className="w-4 h-4" />}
                          error={errors[`projects.${index}.title`]}
                        />

                        <FileUpload
                          id={`project-file-${index}`}
                          label="Project File (Optional)"
                          onFileAccepted={(file) =>
                            handleFileChange(index, file)
                          }
                          onFileRemove={() => handleFileRemove(index)}
                          currentFile={project.file}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Project Button */}
                  <motion.button
                    type="button"
                    onClick={addProject}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative group"
                  >
                    <div className="relative px-4 py-3 bg-white dark:bg-[#011b2b] border border-[#00A3FF] rounded-sm text-[#00A3FF] text-sm flex items-center justify-center gap-2">
                      <Icons.Add className="w-4 h-4" />
                      Add Another Project
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                <motion.button
                  type="button"
                  onClick={() => window.history.back()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 relative group"
                >
                  <div className="relative px-4 py-2 bg-transparent border border-gray-300 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 hover:border-[#00A3FF] transition-colors">
                    <span>Back</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={handleSubmit}
                  disabled={!hasProjects || isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 relative group ${
                    !hasProjects ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-medium text-sm flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-sm"
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchProjectsForm;
