"use client";
import React, { useState, ReactNode, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FileUpload } from '@/components/shared/drop_zone'


type Article = {
  title: string;
  citation: string;
  link: string;
};

type Project = {
  title: string;
  file: File | null;
};

type Conference = {
  title: string;
  file: File | null;
};

type Award = {
  file: File | null;
};

type LabActivity = {
  file: File | null;
};

type ResearchSkill = {
  description: string;
  file: File | null;
};

/* ===========================
   ICONS (Simplified)
=========================== */
const Icons = {
  Article: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16v16H4V4z" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  ),
  Project: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  Conference: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Award: ({ className = "w-3.5 h-3.5" }) => (
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
  Lab: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 2v7.31L4 20h16l-6-10.69V2" />
      <line x1="8" y1="2" x2="16" y2="2" />
    </svg>
  ),
  Skill: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Upload: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Trash: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0h10" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Add: ({ className = "w-3.5 h-3.5" }) => (
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
  ArrowLeft: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  ArrowRight: ({ className = "w-3.5 h-3.5" }) => (
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
  ChevronDown: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};

/* ===========================
   DIGITAL CURSOR (Optional, can be kept or removed for compactness)
=========================== */
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
      className="pointer-events-none fixed z-50 h-6 w-6 rounded-sm border border-[#00A3FF] hidden lg:block mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};


interface NexusSelectProps {
  value: "Yes" | "No";
  onChange: (value: "Yes" | "No") => void;
}

const NexusSelect = ({ value, onChange }: NexusSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const options: ("Yes" | "No")[] = ["Yes", "No"];

  return (
    <div className="relative w-24">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 text-xs bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white flex items-center justify-between gap-1 focus:outline-none focus:border-[#00A3FF]"
      >
        <span>{value}</span>
        <Icons.ChevronDown
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-[#064e78] ${
                opt === value
                  ? "text-[#00A3FF]"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ===========================
   MAIN COMPONENT (Compact Nexus Version)
=========================== */

interface AcademicActivitiesStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
  isPending?: boolean;
}

const AcademicActivitiesStep = ({
  onBack,
  isPending = false,
}: AcademicActivitiesStepProps) => {
  // State declarations
  const [hasArticles, setHasArticles] = useState<"Yes" | "No">("No");
  const [hasProjects, setHasProjects] = useState<"Yes" | "No">("No");
  const [hasConferences, setHasConferences] = useState<"Yes" | "No">("No");
  const [hasAwards, setHasAwards] = useState<"Yes" | "No">("No");
  const [hasLabs, setHasLabs] = useState<"Yes" | "No">("No");
  const [hasSkills, setHasSkills] = useState<"Yes" | "No">("No");

  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [labs, setLabs] = useState<LabActivity[]>([]);
  const [skills, setSkills] = useState<ResearchSkill[]>([]);

  // Helper functions
  const addItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    item: T,
  ) => setter((prev) => [...prev, item]);
  
  const removeItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
  ) => setter((prev) => prev.filter((_, i) => i !== index));
  
  const updateItem = <T extends Record<string, unknown>>(
    items: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    field: keyof T,
    value: T[keyof T],
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-4">
        {/* Simplified Background */}
        <div className="absolute inset-0 " />

        <div className="relative container ">
          {/* Compact Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className=" dark:bg-[#01111c] border border-gray-200 dark:border-[#064e78] rounded-sm"
          >
            <div className="p-4 md:p-5">
              {/* Ultra Compact Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                    Academic Activities
                  </h2>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  Research, publications & achievements
                </p>
                {/* Slim Progress Bar */}
                <div className="w-full h-0.5 bg-gray-200 dark:bg-[#064e78] mt-3 rounded-sm overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00A3FF]"
                    initial={{ width: "0%" }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sections with Compact Spacing */}

                {/* 1️⃣ ARTICLES */}
                <CompactSection
                  title="Published scientific articles?"
                  value={hasArticles}
                  setValue={setHasArticles}
                >
                  {articles.map((article, index) => (
                    <CompactCard key={index}>
                      <div className="space-y-3">
                        <FormInput
                          label="Title"
                          value={article.title}
                          onChange={(e) =>
                            updateItem(
                              articles,
                              setArticles,
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Article title"
                          icon={<Icons.Article />}
                        />
                        <FormTextArea
                          label="Description based on APA Citation"
                          value={article.citation}
                          onChange={(e) =>
                            updateItem(
                              articles,
                              setArticles,
                              index,
                              "citation",
                              e.target.value,
                            )
                          }
                          placeholder="Author, A. (Year). Title. Journal..."
                          rows={1}
                        />
                        <FormInput
                          label="Link"
                          type="url"
                          value={article.link}
                          onChange={(e) =>
                            updateItem(
                              articles,
                              setArticles,
                              index,
                              "link",
                              e.target.value,
                            )
                          }
                          placeholder="https://..."
                        />
                        <div className="flex justify-end">
                          <RemoveButton
                            onClick={() => removeItem(setArticles, index)}
                          />
                        </div>
                      </div>
                    </CompactCard>
                  ))}
                  {hasArticles === "Yes" && (
                    <AddButton
                      label="Add Article"
                      onClick={() =>
                        addItem(setArticles, {
                          title: "",
                          citation: "",
                          link: "",
                        })
                      }
                    />
                  )}
                </CompactSection>

                {/* 2️⃣ PROJECTS */}
                <CompactSection
                  title="Research projects?"
                  value={hasProjects}
                  setValue={setHasProjects}
                >
                  {projects.map((project, index) => (
                    <CompactCard key={index}>
                      <div className="space-y-3">
                        <FormInput
                          label="Project Title"
                          value={project.title}
                          onChange={(e) =>
                            updateItem(
                              projects,
                              setProjects,
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Project name"
                          icon={<Icons.Project />}
                        />
                        <FileUpload
                          id={`project-file-${index}`}
                          label="File (optional)"
                          onFileAccepted={(file) =>
                            updateItem(
                              projects,
                              setProjects,
                              index,
                              "file",
                              file,
                            )
                          }
                          onFileRemove={() =>
                            updateItem(
                              projects,
                              setProjects,
                              index,
                              "file",
                              null,
                            )
                          }
                          currentFile={project.file || undefined}
                          icon={<Icons.Upload className="w-3.5 h-3.5" />}
                        />
                        <div className="flex justify-end">
                          <RemoveButton
                            onClick={() => removeItem(setProjects, index)}
                          />
                        </div>
                      </div>
                    </CompactCard>
                  ))}
                  {hasProjects === "Yes" && (
                    <AddButton
                      label="Add Project"
                      onClick={() =>
                        addItem<Project>(setProjects, { title: "", file: null })
                      }
                    />
                  )}
                </CompactSection>

                {/* 3️⃣ CONFERENCES */}
                <CompactSection
                  title="Conference participation?"
                  value={hasConferences}
                  setValue={setHasConferences}
                >
                  {conferences.map((conf, index) => (
                    <CompactCard key={index}>
                      <div className="space-y-3">
                        <FormInput
                          label="Conference Title"
                          value={conf.title}
                          onChange={(e) =>
                            updateItem(
                              conferences,
                              setConferences,
                              index,
                              "title",
                              e.target.value,
                            )
                          }
                          placeholder="Conference name"
                          icon={<Icons.Conference />}
                        />
                        <FileUpload
                          id={`conference-file-${index}`}
                          label="File (optional)"
                          onFileAccepted={(file) =>
                            updateItem(
                              conferences,
                              setConferences,
                              index,
                              "file",
                              file,
                            )
                          }
                          onFileRemove={() =>
                            updateItem(
                              conferences,
                              setConferences,
                              index,
                              "file",
                              null,
                            )
                          }
                          currentFile={conf.file || undefined}
                          icon={<Icons.Upload className="w-3.5 h-3.5" />}
                        />
                        <div className="flex justify-end">
                          <RemoveButton
                            onClick={() => removeItem(setConferences, index)}
                          />
                        </div>
                      </div>
                    </CompactCard>
                  ))}
                  {hasConferences === "Yes" && (
                    <AddButton
                      label="Add Conference"
                      onClick={() =>
                        addItem<Conference>(setConferences, {
                          title: "",
                          file: null,
                        })
                      }
                    />
                  )}
                </CompactSection>

                {/* 4️⃣ AWARDS */}
                <CompactSection
                  title="Scientific awards?"
                  value={hasAwards}
                  setValue={setHasAwards}
                >
                  {awards.map((award, index) => (
                    <CompactCard key={index}>
                      <div className="space-y-3">
                        <FileUpload
                          id={`award-file-${index}`}
                          label="Award Certificate"
                          onFileAccepted={(file) =>
                            updateItem(awards, setAwards, index, "file", file)
                          }
                          onFileRemove={() =>
                            updateItem(awards, setAwards, index, "file", null)
                          }
                          currentFile={award.file || undefined}
                          icon={<Icons.Upload className="w-3.5 h-3.5" />}
                        />
                        <div className="flex justify-end">
                          <RemoveButton
                            onClick={() => removeItem(setAwards, index)}
                          />
                        </div>
                      </div>
                    </CompactCard>
                  ))}
                  {hasAwards === "Yes" && (
                    <AddButton
                      label="Add Award"
                      onClick={() => addItem<Award>(setAwards, { file: null })}
                    />
                  )}
                </CompactSection>

                {/* 5️⃣ LABS */}
                <CompactSection
                  title="Laboratory activities?"
                  value={hasLabs}
                  setValue={setHasLabs}
                >
                  {labs.map((lab, index) => (
                    <CompactCard key={index}>
                      <div className="space-y-3">
                        <FileUpload
                          id={`lab-file-${index}`}
                          label="Lab Report"
                          onFileAccepted={(file) =>
                            updateItem(labs, setLabs, index, "file", file)
                          }
                          onFileRemove={() =>
                            updateItem(labs, setLabs, index, "file", null)
                          }
                          currentFile={lab.file || undefined}
                          icon={<Icons.Upload className="w-3.5 h-3.5" />}
                        />
                        <div className="flex justify-end">
                          <RemoveButton
                            onClick={() => removeItem(setLabs, index)}
                          />
                        </div>
                      </div>
                    </CompactCard>
                  ))}
                  {hasLabs === "Yes" && (
                    <AddButton
                      label="Add Lab Activity"
                      onClick={() =>
                        addItem<LabActivity>(setLabs, { file: null })
                      }
                    />
                  )}
                </CompactSection>

                {/* 6️⃣ RESEARCH SKILLS */}
                <CompactSection
                  title="Research skills?"
                  value={hasSkills}
                  setValue={setHasSkills}
                >
                  {skills.map((skill, index) => (
                    <CompactCard key={index}>
                      <div className="space-y-3">
                        <FormTextArea
                          label="Skill Description"
                          value={skill.description}
                          onChange={(e) =>
                            updateItem(
                              skills,
                              setSkills,
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Describe your skills..."
                          rows={1}
                        />
                        <FileUpload
                          id={`skill-file-${index}`}
                          label="Document (optional)"
                          onFileAccepted={(file) =>
                            updateItem(skills, setSkills, index, "file", file)
                          }
                          onFileRemove={() =>
                            updateItem(skills, setSkills, index, "file", null)
                          }
                          currentFile={skill.file || undefined}
                          icon={<Icons.Upload className="w-3.5 h-3.5" />}
                        />
                        <div className="flex justify-end">
                          <RemoveButton
                            onClick={() => removeItem(setSkills, index)}
                          />
                        </div>
                      </div>
                    </CompactCard>
                  ))}
                  {hasSkills === "Yes" && (
                    <AddButton
                      label="Add Skill"
                      onClick={() =>
                        addItem<ResearchSkill>(setSkills, {
                          description: "",
                          file: null,
                        })
                      }
                    />
                  )}
                </CompactSection>

                {/* Compact Form Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-3 mt-3 border-t border-gray-200 dark:border-[#064e78]">
                  <motion.button
                    type="button"
                    onClick={onBack}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 px-3 py-2.5 bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] text-gray-700 dark:text-gray-300 rounded-sm text-xs font-medium flex items-center justify-center gap-1 hover:border-[#00A3FF] transition-colors"
                  >
                    <Icons.ArrowLeft className="w-3 h-3" />
                    <span>Back</span>
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 px-3 py-2.5 bg-[#00A3FF] text-white rounded-sm text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#0091e6] transition-colors disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-3 h-3 border-2 border-white border-t-transparent rounded-sm"
                        />
                        <span>...</span>
                      </>
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <Icons.ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

/* ===========================
   COMPACT SUB-COMPONENTS
=========================== */

interface CompactSectionProps {
  title: string;
  value: "Yes" | "No";
  setValue: React.Dispatch<React.SetStateAction<"Yes" | "No">>;
  children: ReactNode;
}

const CompactSection = ({
  title,
  value,
  setValue,
  children,
}: CompactSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-[#01111c] p-2 border border-gray-200 dark:border-[#064e78] rounded-sm">
        <label className="text-xs font-medium text-gray-900 dark:text-white truncate">
          {title}
        </label>
        <NexusSelect value={value} onChange={setValue} />
      </div>
      {value === "Yes" && <div className="space-y-2 pl-2">{children}</div>}
    </div>
  );
};

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
}: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-0.5">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? "pl-7" : "px-2"} pr-2 py-2 text-xs bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00A3FF] transition-colors`}
      />
    </div>
  </div>
);

interface FormTextAreaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

const FormTextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: FormTextAreaProps) => (
  <div>
    <label className="block text-sm  font-medium text-gray-700 dark:text-gray-400 mb-0.5">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-2 py-2 text-xs bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00A3FF] transition-colors resize-none"
    />
  </div>
);

const CompactCard = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-white dark:bg-[#01111c] p-3 border border-gray-200 dark:border-[#064e78] rounded-sm"
  >
    {children}
  </motion.div>
);

const AddButton = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className="w-full px-2 py-2.5 bg-white dark:bg-[#011b2b] border border-dashed border-gray-300 dark:border-[#064e78] rounded-sm text-gray-600 dark:text-gray-400 text-xs hover:border-[#00A3FF] hover:text-[#00A3FF] transition-colors flex items-center justify-center gap-1"
  >
    <Icons.Add className="w-3 h-3" />
    {label}
  </motion.button>
);

const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="text-red-500 hover:text-red-700 p-1 rounded-sm transition-colors flex items-center gap-1 text-sm  font-medium"
  >
    <Icons.Trash className="w-3 h-3" />
    Remove
  </motion.button>
);

export default AcademicActivitiesStep;