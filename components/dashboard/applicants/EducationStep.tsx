// app/education/page.tsx
"use client";

import Loading from "@/app/loading";
import { UseEducationInformation } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  educationSchema,
  EducationFormData,
  BachelorEducation,
  HighSchoolEducation,
  EducationFormDataField,
} from "@/types/application";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Import components
import { FormInput } from "./education/FormInput";
import { MasterEducation } from "./education/MasterSection";
import { BachelorEducation as BachelorSection } from "./education/BachelorSection";
import { HighSchoolEducation as HighSchoolSection } from "./education/HighSchoolSection";

// Icons
const Icons = {
  Education: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

// Education level options
const educationLevelOptions = [
  { value: "PHD", label: "PHD" },
  { value: "Master", label: "Master" },
  { value: "Bachelor", label: "Bachelor" },
];

// Default empty education object
const createEmptyBachelor = (): BachelorEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: 0,
  academicRank: "",
  startDate: "",
  graduationDate: "",
  diplomaFile: undefined,
  transcriptFile: undefined,
});

const createEmptyHighSchool = (): HighSchoolEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: 0,
  academicRank: "",
  startDate: "",
  graduationDate: "",
  finalExamYear: undefined,
  finalExamScore: undefined,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

export default function EducationInfo() {
  const router = useRouter();
  const {data:userSession, status } = useSession();
  const mutation = UseEducationInformation();

  // State to control section visibility
  const [showMaster, setShowMaster] = useState(false);
  const [showBachelor, setShowBachelor] = useState(false);
  const [showHighSchool, setShowHighSchool] = useState(false);

  // Counts for dynamic sections
  const [bachelorCount, setBachelorCount] = useState(0);
  const [highSchoolCount, setHighSchoolCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      level: undefined, // No default selection
      bachelorEducation: [],
      highSchoolEducation: [],
    },
  });

  const selectedLevel = watch("level");

  useEffect(() => {
    if (!selectedLevel) {
      setShowMaster(false);
      setShowBachelor(false);
      setShowHighSchool(false);
      return;
    }
    switch (selectedLevel) {
      case "PHD":
        setShowMaster(true);
        setShowBachelor(true);
        setShowHighSchool(true);
        break;

      case "Master":
        setShowMaster(false); // Don't show Master section for Master level
        setShowBachelor(true);
        setShowHighSchool(true);
        break;

      case "Bachelor":
        setShowMaster(false);
        setShowBachelor(false);
        setShowHighSchool(true);
        setBachelorCount(0);
        setValue("bachelorEducation", []);
        break;

      default:
        // Default case
        setShowMaster(false);
        setShowBachelor(false);
        setShowHighSchool(false);
    }
  }, [selectedLevel, setValue]);
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
  const onSubmit = (data: EducationFormData) => {
    // Build submission data based on selected level
    const submissionData: EducationFormDataField = {
      level: data.level,
      userId: userSession.user._id as string
    };

    if (selectedLevel === "PHD") {
      const masterData = {
        fieldOfStudy: data.fieldOfStudy, // Adjust based on your actual field names
        institutionName: data.institutionName,
        gpa: data.gpa,
        startDate: data.startDate,
        graduationDate: data.graduationDate,
      };
      if (masterData.fieldOfStudy || masterData.institutionName) {
        submissionData.masterEducation = masterData;
      }
    }
    if (
      (selectedLevel === "PHD" || selectedLevel === "Master") &&
      data.bachelorEducation &&
      data.bachelorEducation.length > 0
    ) {
      submissionData.bachelorEducation = data.bachelorEducation;
    }
    if (data.highSchoolEducation && data.highSchoolEducation.length > 0) {
      submissionData.highSchoolEducation = data.highSchoolEducation;
    }

    console.log("Submission Data:", submissionData);
    mutation.mutate(submissionData as EducationFormDataField);
  };

  const addBachelorEducation = () => {
    const currentBachelor = getValues("bachelorEducation") || [];
    setValue("bachelorEducation", [...currentBachelor, createEmptyBachelor()]);
    setBachelorCount((prev) => prev + 1);
  };

  const addHighSchoolEducation = () => {
    const currentHighSchool = getValues("highSchoolEducation") || [];
    setValue("highSchoolEducation", [
      ...currentHighSchool,
      createEmptyHighSchool(),
    ]);
    setHighSchoolCount((prev) => prev + 1);
  };

  const removeBachelorEducation = (index: number) => {
    const currentBachelor = getValues("bachelorEducation") || [];
    setValue(
      "bachelorEducation",
      currentBachelor.filter((_, i) => i !== index),
    );
    setBachelorCount((prev) => prev - 1);
  };

  const removeHighSchoolEducation = (index: number) => {
    const currentHighSchool = getValues("highSchoolEducation") || [];
    setValue(
      "highSchoolEducation",
      currentHighSchool.filter((_, i) => i !== index),
    );
    setHighSchoolCount((prev) => prev - 1);
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-2">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
          {/* linear Orbs */}
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2 mb-4">
                    Education Information
                  </h3>
                </div>

                {/* Main Education Level */}
                <FormInput
                  label="Select Proposed Field of Study"
                  type="select"
                  id="level"
                  placeholder="Select Select Proposed Field of Study"
                  required
                  register={register}
                  error={errors.level}
                  icon={<Icons.Education className="w-4 h-4" />}
                  options={educationLevelOptions}
                />

                {/* Master Education Section - shown when PHD or Master is selected */}
                {showMaster && (
                  <MasterEducation
                    prefix=""
                    register={register}
                    errors={errors}
                    showThesis={true}
                  />
                )}

                {/* Bachelor Education Sections - shown when PHD or Master is selected */}
                {showBachelor && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        Bachelor Education
                      </h4>
                      <motion.button
                        type="button"
                        onClick={addBachelorEducation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#00A3FF]/10 text-[#00A3FF] rounded-sm hover:bg-[#00A3FF]/20 transition-colors"
                      >
                        <Icons.Add className="w-4 h-4" />
                        Add Bachelor
                      </motion.button>
                    </div>

                    {bachelorCount > 0 &&
                      Array.from({ length: bachelorCount }).map((_, index) => (
                        <BachelorSection
                          key={`bachelor-${index}`}
                          prefix={`bachelorEducation.${index}`}
                          onRemove={
                            bachelorCount > 1
                              ? () => removeBachelorEducation(index)
                              : undefined
                          }
                          register={register}
                          errors={errors.bachelorEducation?.[index]}
                        />
                      ))}

                    {bachelorCount === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No bachelor education added. Click `Add Bachelor` to add
                        your bachelor degree information.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* High School Education Sections - shown for all levels when level is selected */}
                {selectedLevel && showHighSchool && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        High School Education
                      </h4>
                      <motion.button
                        type="button"
                        onClick={addHighSchoolEducation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#00A3FF]/10 text-[#00A3FF] rounded-sm hover:bg-[#00A3FF]/20 transition-colors"
                      >
                        <Icons.Add className="w-4 h-4" />
                        Add High School
                      </motion.button>
                    </div>

                    {highSchoolCount > 0 &&
                      Array.from({ length: highSchoolCount }).map(
                        (_, index) => (
                          <HighSchoolSection
                            key={`highschool-${index}`}
                            prefix={`highSchoolEducation.${index}`}
                            onRemove={
                              highSchoolCount > 1
                                ? () => removeHighSchoolEducation(index)
                                : undefined
                            }
                            register={register}
                            errors={errors.highSchoolEducation?.[index]}
                            showFinalExam={true}
                          />
                        ),
                      )}

                    {highSchoolCount === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        No high school education added. Click `Add High School`
                        to add your high school information.
                      </p>
                    )}
                  </motion.div>
                )}

                {/* No Level Selected Message */}
                {!selectedLevel && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <p className="text-gray-700 text-sm dark:text-gray-400">
                      Please select your education level to continue.
                    </p>
                  </motion.div>
                )}

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
                    disabled={mutation.isPending || !selectedLevel}
                    whileHover={{ scale: selectedLevel ? 1.02 : 1 }}
                    whileTap={{ scale: selectedLevel ? 0.98 : 1 }}
                    className={`flex-1 relative group ${!selectedLevel ? "opacity-50 cursor-not-allowed" : ""}`}
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
