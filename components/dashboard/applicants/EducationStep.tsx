"use client";

import Loading from "@/app/loading";
import { UseEducationInformation } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EducationFormData,
  BachelorEducation,
  HighSchoolEducation,
  EducationFormDataField,
  MasterEducation,
} from "@/types/application";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Import components
import { FormInput } from "./education/FormInput";
import { PHDEducation as PHDSection } from "./education/PHDSection";
import { MasterEducation as MasterSection } from "./education/MasterSection";
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

// Education level options with clear descriptions
const educationLevelOptions = [
  {
    value: "PHD",
    label: "PHD ",
    description: "Doctoral degree program with research focus",
  },
  {
    value: "Master",
    label: "Master",
    description: "Postgraduate degree (MA, MSc, MBA, etc.)",
  },
  {
    value: "Bachelor",
    label: "Bachelor",
    description: "Undergraduate degree (BA, BSc, BEng, etc.)",
  },
  {
    value: "HighSchool",
    label: "High School ",
    description: "Secondary education completion",
  },
];

// Default empty education object
const createEmptyBachelor = (): BachelorEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: 0,
  academic_gap: "",
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
  academic_gap: "",
  academicRank: "",
  startDate: "",
  graduationDate: "",
  finalExamYear: undefined,
  finalExamScore: undefined,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

const createEmptyMaster = (): MasterEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: 0,
  academicRank: "",
  startDate: "",
  graduationDate: "",
  thesisTopic: "",
  thesisFile: undefined,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

const createEmptyPhd = (): MasterEducation => ({
  ...createEmptyMaster(),
});

export default function EducationInfo() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = UseEducationInformation();

  // State to track if level is selected
  const [levelSelected, setLevelSelected] = useState(false);

  // State to control section visibility
  const [showPhd, setShowPhd] = useState(false);
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
    defaultValues: {
      level: undefined,
    },
  });

  const selectedLevel = watch("level");

  // Effect to handle level selection and show appropriate sections
  useEffect(() => {
    if (!selectedLevel) {
      setLevelSelected(false);
      setShowPhd(false);
      setShowMaster(false);
      setShowBachelor(false);
      setShowHighSchool(false);
      setBachelorCount(0);
      setHighSchoolCount(0);

      // Clear all education data - FIXED: Don't set undefined for masterEducation
      setValue("bachelorEducation", []);
      setValue("highSchoolEducation", []);
      return;
    }

    setLevelSelected(true);

    // Reset counts and clear previous data
    setBachelorCount(0);
    setHighSchoolCount(0);
    setValue("bachelorEducation", []);
    setValue("highSchoolEducation", []);

    // Set up sections based on selected level
    switch (selectedLevel) {
      case "PHD":
        setShowPhd(true);
        setShowMaster(true);
        setShowBachelor(true);
        setShowHighSchool(true);
        // Initialize PhD education
        setValue("phdEducation", createEmptyPhd());
        // Initialize master education for PhD
        setValue("masterEducation", createEmptyMaster());
        // Initialize one bachelor education by default for PhD
        setValue("bachelorEducation", [createEmptyBachelor()]);
        setBachelorCount(1);
        // Initialize one high school education by default
        setValue("highSchoolEducation", [createEmptyHighSchool()]);
        setHighSchoolCount(1);
        break;

      case "Master":
        setShowPhd(false);
        setShowMaster(true);
        setShowBachelor(true);
        setShowHighSchool(true);
        // Initialize master education for Master's
        setValue("masterEducation", createEmptyMaster());
        // Initialize one bachelor education by default for Master
        setValue("bachelorEducation", [createEmptyBachelor()]);
        setBachelorCount(1);
        // Initialize one high school education by default
        setValue("highSchoolEducation", [createEmptyHighSchool()]);
        setHighSchoolCount(1);
        break;

      case "Bachelor":
        setShowPhd(false);
        setShowMaster(false);
        setShowBachelor(true);
        setShowHighSchool(true);
        // Initialize one bachelor education by default
        setValue("bachelorEducation", [createEmptyBachelor()]);
        setBachelorCount(1);
        // Initialize one high school education by default
        setValue("highSchoolEducation", [createEmptyHighSchool()]);
        setHighSchoolCount(1);
        break;

      case "HighSchool":
        setShowPhd(false);
        setShowMaster(false);
        setShowBachelor(false);
        setShowHighSchool(true);
        // Initialize one high school education by default
        setValue("highSchoolEducation", [createEmptyHighSchool()]);
        setHighSchoolCount(1);
        break;
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
    const submissionData: EducationFormDataField = {
      level: data.level,
      userId: userSession.user._id as string,
    };

    // Add level-specific fields based on the selected level
    if (data.level === "PHD") {
      submissionData.phdEducation = data.phdEducation;
      submissionData.masterEducation = data.masterEducation;
      submissionData.bachelorEducation = data.bachelorEducation;
      submissionData.highSchoolEducation = data.highSchoolEducation;
    } else if (data.level === "Master") {
      submissionData.masterEducation = data.masterEducation;
      submissionData.bachelorEducation = data.bachelorEducation;
      submissionData.highSchoolEducation = data.highSchoolEducation;
    } else if (data.level === "Bachelor") {
      if (data.bachelorEducation && data.bachelorEducation.length > 0) {
        submissionData.bachelorEducation = data.bachelorEducation;
      }
      submissionData.highSchoolEducation = data.highSchoolEducation;
    } else if (data.level === "HighSchool") {
      submissionData.highSchoolEducation = data.highSchoolEducation;
    }

    mutation.mutate(submissionData);
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

  // Get selected level label for display
  const getSelectedLevelLabel = () => {
    const level = educationLevelOptions.find(
      (opt) => opt.value === selectedLevel,
    );
    return level ? level.label : selectedLevel;
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-2">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Header */}
                <div className="">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2">
                    Education Information
                  </h3>
                </div>

                {/* Education Level Selection - Always Visible */}
                <div className=" ">
                  <FormInput
                    label="Highest Level of Education"
                    type="select"
                    id="level"
                    placeholder="Select your highest education level"
                    required
                    register={register}
                    error={errors.level}
                    icon={<Icons.Education className="w-4 h-4" />}
                    options={educationLevelOptions}
                  />
                </div>

                {/* Level Selected Confirmation */}
                {levelSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm"
                  >
                    <Icons.Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Selected Level: <strong>{getSelectedLevelLabel()}</strong>{" "}
                      - Please complete the{" "}
                      {selectedLevel === "PHD"
                        ? "PhD"
                        : selectedLevel === "Master"
                          ? "Master's"
                          : selectedLevel === "Bachelor"
                            ? "Bachelor's"
                            : "High School"}{" "}
                      details below
                    </span>
                  </motion.div>
                )}

                {/* Dynamic Education Sections - Based on Selected Level */}
                {levelSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                  >
                    {/* PHD Education Section */}
                    {showPhd && selectedLevel === "PHD" && (
                      <div className="space-y-4">
                        <PHDSection
                          prefix="phdEducation"
                          register={register}
                          showThesis={true}
                        />
                      </div>
                    )}

                    {/* Master Education Section - shown for PHD and Master */}
                    {showMaster &&
                      (selectedLevel === "PHD" ||
                        selectedLevel === "Master") && (
                        <div className="space-y-4">
                          <MasterSection
                            prefix="masterEducation"
                            register={register}
                            errors={errors}
                            showThesis={true}
                          />
                        </div>
                      )}

                    {/* Bachelor Education Sections */}
                    {showBachelor && (
                      <motion.div className="space-y-4">
                        <div className="flex items-center justify-between">
                          {(selectedLevel === "PHD" ||
                            selectedLevel === "Master" ||
                            selectedLevel === "Bachelor") && (
                            <motion.button
                              type="button"
                              onClick={addBachelorEducation}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#00A3FF]/10 text-[#00A3FF] rounded-sm hover:bg-[#00A3FF]/20 transition-colors"
                            >
                              <Icons.Add className="w-4 h-4" />
                              Add Another Bachelor Degree
                            </motion.button>
                          )}
                        </div>

                        {bachelorCount > 0 ? (
                          Array.from({ length: bachelorCount }).map(
                            (_, index) => (
                              <BachelorSection
                                key={`bachelor-${index}`}
                                prefix={`bachelorEducation.${index}`}
                                onRemove={
                                  bachelorCount > 1
                                    ? () => removeBachelorEducation(index)
                                    : undefined
                                }
                                register={register}
                              />
                            ),
                          )
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No bachelor degrees added. Click Add Bachelor Degree
                            to add your information.
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* High School Education Sections */}
                    {showHighSchool && (
                      <motion.div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <motion.button
                            type="button"
                            onClick={addHighSchoolEducation}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#00A3FF]/10 text-[#00A3FF] rounded-sm hover:bg-[#00A3FF]/20 transition-colors"
                          >
                            <Icons.Add className="w-4 h-4" />
                            Add Baccalaureate Details
                          </motion.button>
                        </div>

                        {highSchoolCount > 0 ? (
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
                          )
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No high school education added. Click Add High
                            School to add your information.
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Level-specific help text */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Note:</strong> Please make sure that your information is accurate and your documents are complete.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* No Level Selected Message */}
                {!levelSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-gray-50 dark:bg-[#022b40] rounded-sm"
                  >
                    <Icons.Education className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                      Please select your highest level of education to continue
                      with the application.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      The form will adapt based on your selection
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
                    <div className="relative px-4 py-2 dark:bg-[#076094] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 dark:border-[#5fb7e9]">
                      <span>Back</span>
                    </div>
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={mutation.isPending || !levelSelected}
                    whileHover={{ scale: levelSelected ? 1.02 : 1 }}
                    whileTap={{ scale: levelSelected ? 0.98 : 1 }}
                    className={`flex-1 relative group ${
                      !levelSelected ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
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
