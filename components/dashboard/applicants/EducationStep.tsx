"use client";

import Loading from "@/app/loading";
import { UseEducationInformation } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Path } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ZodIssue } from "zod";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Associate14thOptionalRecord,
  BachelorEducation,
  EducationFormData,
  EducationFormDataField,
  EducationStepKey,
  HighSchoolEducation,
  MasterEducation,
  bachelorEducationSchema,
  highSchoolEducationSchema,
  k12SchoolRecordSchema,
  masterEducationSchema,
} from "@/types/application";
import { FormInput } from "./education/FormInput";
import { PHDEducation as PHDSection } from "./education/PHDSection";
import { MasterEducation as MasterSection } from "./education/MasterSection";
import { BachelorEducation as BachelorSection } from "./education/BachelorSection";
import { HighSchoolEducation as HighSchoolSection } from "./education/HighSchoolSection";

type EducationLevel = EducationFormData["level"];

// Icons for the form
const Icons = {
  Graduation: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3L1 9L12 15L21 10.5V16" />
      <path d="M5 13V17L12 21L19 17V13" />
    </svg>
  ),
  University: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M12 4L4 8L12 12L20 8L12 4Z" />
    </svg>
  ),
  Book: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 3H8C9.1 3 10 3.9 10 5V21C10 19.9 9.1 19 8 19H2V3Z" />
      <path d="M22 3H16C14.9 3 14 3.9 14 5V21C14 19.9 14.9 19 16 19H22V3Z" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
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
  ArrowLeft: ({ className = "w-4 h-4" }) => (
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
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Target: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

// Digital Cursor Component (matching Personal component)
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

const educationLevelOptions = [
  { value: "PHD", label: "Doctorate (PhD)" },
  { value: "Master", label: "Master's Degree" },
  { value: "Bachelor", label: "Bachelor's Degree" },
  { value: "Associate", label: "Associate Degree (14th Grade)" },
  { value: "HighSchool", label: "High School Diploma" },
  { value: "MiddleSchool", label: "Middle School" },
];

const stepLabels: Record<EducationStepKey, string> = {
  phd: "Doctorate",
  master: "Master's",
  bachelor: "Bachelor's",
  "associate-question": "Associate Question",
  associate: "Associate",
  highschool: "High School",
  "primary-school": "Primary School",
  "secondary-school": "Secondary School",
};

const stepOrderByLevel: Record<EducationLevel, EducationStepKey[]> = {
  PHD: [
    "phd",
    "master",
    "bachelor",
    "associate-question",
    "associate",
    "highschool",
  ],
  Master: ["master", "bachelor", "associate-question", "associate", "highschool"],
  Bachelor: ["bachelor", "associate-question", "associate", "highschool"],
  Associate: ["associate", "highschool"],
  HighSchool: ["highschool"],
  MiddleSchool: ["primary-school", "secondary-school"],
};

const createEmptyBachelor = (): BachelorEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: undefined as unknown as number,
  academic_gap: "",
  academicRank: "",
  startDate: "",
  graduationDate: "",
  currentlyStudying: false,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

const createEmptyHighSchool = (): HighSchoolEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: undefined as unknown as number,
  academic_gap: "",
  academicRank: "",
  startDate: "",
  graduationDate: "",
  currentlyStudying: false,
  finalExamYear: undefined,
  finalExamScore: undefined,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

const createEmptyMaster = (): MasterEducation => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: undefined as unknown as number,
  academicRank: "",
  startDate: "",
  graduationDate: "",
  currentlyStudying: false,
  thesisTopic: "",
  thesisFile: undefined,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

const createEmptyAssociate14thOptional = (): Associate14thOptionalRecord => ({
  fieldOfStudy: "",
  institutionName: "",
  gpa: undefined,
  academic_gap: "",
  academicRank: "",
  startDate: "",
  graduationDate: "",
  currentlyStudying: false,
  finalExamYear: undefined,
  finalExamScore: undefined,
  diplomaFile: undefined,
  transcriptFile: undefined,
});

function getVisibleSteps(
  level: EducationLevel,
  associateAnswer: "yes" | "no" | undefined,
  currentStep: EducationStepKey | null,
) {
  const steps = stepOrderByLevel[level];
  if (!steps.includes("associate")) {
    return steps;
  }

  return steps.filter((step) => {
    if (step !== "associate") return true;
    return associateAnswer === "yes" || currentStep === "associate";
  });
}

export default function EducationInfo() {
  const router = useRouter();
  const { data: userSession, status } = useSession();
  const mutation = UseEducationInformation();
  const [currentStep, setCurrentStep] = useState<EducationStepKey | null>(null);

  const {
    register,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EducationFormData>({
    defaultValues: {
      level: undefined,
      hasAssociate14thDegree: undefined,
    },
  });

  const selectedLevel = watch("level");
  const associateAnswer = watch("hasAssociate14thDegree");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formErrors = errors as any;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [router, status]);

  useEffect(() => {
    if (!selectedLevel) {
      setCurrentStep(null);
      return;
    }

    setCurrentStep(stepOrderByLevel[selectedLevel][0]);
    setValue("phdEducation", createEmptyMaster());
    setValue("masterEducation", createEmptyMaster());
    setValue("bachelorEducation", [createEmptyBachelor()]);
    setValue("highSchoolEducation", [createEmptyHighSchool()]);
    setValue("associate14thEducation", createEmptyHighSchool());
    setValue("primarySchool", createEmptyAssociate14thOptional());
    setValue("secondarySchoolEducation", [createEmptyHighSchool()]);
    setValue("hasAssociate14thDegree", undefined as never);
  }, [selectedLevel, setValue]);

  const visibleSteps = useMemo(() => {
    if (!selectedLevel || !currentStep) return [];
    return getVisibleSteps(selectedLevel, associateAnswer, currentStep);
  }, [associateAnswer, currentStep, selectedLevel]);

  if (status === "loading") return <Loading />;
  if (status !== "authenticated") return null;

  const applyStepZodErrors = (prefix: string, issues: ZodIssue[]) => {
    issues.forEach((issue) => {
      const issuePath = issue.path.map(String).join(".");
      const fullPath = issuePath ? `${prefix}.${issuePath}` : prefix;
      setError(fullPath as Path<EducationFormData>, {
        type: "manual",
        message: issue.message,
      });
    });
  };

  const validateCurrentStep = (): boolean => {
    if (!selectedLevel || !currentStep) return false;

    switch (currentStep) {
      case "phd": {
        clearErrors("phdEducation" as Path<EducationFormData>);
        const result = masterEducationSchema.safeParse(getValues("phdEducation"));
        if (!result.success) {
          applyStepZodErrors("phdEducation", result.error.issues);
          return false;
        }
        return true;
      }
      case "master": {
        clearErrors("masterEducation" as Path<EducationFormData>);
        const result = masterEducationSchema.safeParse(getValues("masterEducation"));
        if (!result.success) {
          applyStepZodErrors("masterEducation", result.error.issues);
          return false;
        }
        return true;
      }
      case "bachelor": {
        clearErrors("bachelorEducation.0" as Path<EducationFormData>);
        const result = bachelorEducationSchema.safeParse(
          getValues("bachelorEducation.0"),
        );
        if (!result.success) {
          applyStepZodErrors("bachelorEducation.0", result.error.issues);
          return false;
        }
        return true;
      }
      case "associate-question": {
        clearErrors("hasAssociate14thDegree" as Path<EducationFormData>);
        if (associateAnswer !== "yes" && associateAnswer !== "no") {
          setError("hasAssociate14thDegree" as Path<EducationFormData>, {
            type: "manual",
            message: "Please choose yes or no.",
          });
          return false;
        }
        return true;
      }
      case "associate": {
        if (selectedLevel === "Associate") {
          clearErrors("associate14thEducation" as Path<EducationFormData>);
          const result = k12SchoolRecordSchema.safeParse(
            getValues("associate14thEducation"),
          );
          if (!result.success) {
            applyStepZodErrors("associate14thEducation", result.error.issues);
            return false;
          }
          return true;
        }

        clearErrors("primarySchool" as Path<EducationFormData>);
        const result = k12SchoolRecordSchema.safeParse(getValues("primarySchool"));
        if (!result.success) {
          applyStepZodErrors("primarySchool", result.error.issues);
          return false;
        }
        return true;
      }
      case "highschool": {
        clearErrors("highSchoolEducation.0" as Path<EducationFormData>);
        const result = highSchoolEducationSchema.safeParse(
          getValues("highSchoolEducation.0"),
        );
        if (!result.success) {
          applyStepZodErrors("highSchoolEducation.0", result.error.issues);
          return false;
        }
        return true;
      }
      case "primary-school": {
        clearErrors("primarySchool" as Path<EducationFormData>);
        const result = k12SchoolRecordSchema.safeParse(getValues("primarySchool"));
        if (!result.success) {
          applyStepZodErrors("primarySchool", result.error.issues);
          return false;
        }
        return true;
      }
      case "secondary-school": {
        clearErrors("secondarySchoolEducation.0" as Path<EducationFormData>);
        const result = highSchoolEducationSchema.safeParse(
          getValues("secondarySchoolEducation.0"),
        );
        if (!result.success) {
          applyStepZodErrors("secondarySchoolEducation.0", result.error.issues);
          return false;
        }
        return true;
      }
      default:
        return false;
    }
  };

  const getNextStep = () => {
    if (!selectedLevel || !currentStep) return null;
    const steps = getVisibleSteps(selectedLevel, associateAnswer, currentStep);
    const idx = steps.indexOf(currentStep);
    if (idx < 0 || idx === steps.length - 1) return null;
    return steps[idx + 1];
  };

  const getPrevStep = () => {
    if (!selectedLevel || !currentStep) return null;
    const steps = getVisibleSteps(selectedLevel, associateAnswer, currentStep);
    const idx = steps.indexOf(currentStep);
    if (idx <= 0) return null;
    return steps[idx - 1];
  };

  const submitCurrentStep = () => {
    if (!selectedLevel || !currentStep || mutation.isPending) {
      return;
    }

    const userId = userSession?.user?._id as string | undefined;
    if (!userId) {
      toast.error("Please sign in again.");
      return;
    }

    if (!validateCurrentStep()) {
      toast.error("Please fill required fields.");
      return;
    }

    let data: EducationFormDataField = { userId, level: selectedLevel };

    if (currentStep === "phd") {
      data = { ...data, phdEducation: getValues("phdEducation") };
    } else if (currentStep === "master") {
      data = { ...data, masterEducation: getValues("masterEducation") };
    } else if (currentStep === "bachelor") {
      data = { ...data, bachelorEducation: [getValues("bachelorEducation.0")] };
    } else if (currentStep === "associate-question") {
      data = { ...data, hasAssociate14thDegree: associateAnswer };
    } else if (currentStep === "associate") {
      if (selectedLevel === "Associate") {
        data = {
          ...data,
          associate14thEducation: getValues("associate14thEducation"),
        };
      } else {
        data = {
          ...data,
          hasAssociate14thDegree: "yes",
          primarySchool: getValues("primarySchool"),
        };
      }
    } else if (currentStep === "highschool") {
      data = {
        ...data,
        hasAssociate14thDegree: associateAnswer,
        highSchoolEducation: [getValues("highSchoolEducation.0")],
      };
    } else if (currentStep === "primary-school") {
      data = { ...data, primarySchool: getValues("primarySchool") };
    } else if (currentStep === "secondary-school") {
      data = {
        ...data,
        secondarySchoolEducation: [getValues("secondarySchoolEducation.0")],
      };
    }

    const nextStep = getNextStep();
    const finalizeFlow = nextStep === null;

    mutation.mutate(
      {
        data,
        stepKey: currentStep,
        finalizeFlow,
      },
      {
        onSuccess: () => {
          if (nextStep) {
            setCurrentStep(nextStep);
            toast.success(`${stepLabels[currentStep]} saved.`);
          }
        },
      },
    );
  };

  const goToPrevStep = () => {
    const prevStep = getPrevStep();
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  const renderCurrentStep = () => {
    if (!selectedLevel || !currentStep) return null;

    if (currentStep === "phd") {
      return (
        <PHDSection
          prefix="phdEducation"
          register={register}
          errors={formErrors.phdEducation}
          watch={watch}
          showThesis
        />
      );
    }

    if (currentStep === "master") {
      return (
        <MasterSection
          prefix="masterEducation"
          register={register}
          errors={formErrors.masterEducation}
          watch={watch}
          showThesis
        />
      );
    }

    if (currentStep === "bachelor") {
      return (
        <BachelorSection
          prefix="bachelorEducation.0"
          register={register}
          errors={formErrors.bachelorEducation?.[0]}
          watch={watch}
        />
      );
    }

    if (currentStep === "associate-question") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border border-gray-200 dark:border-[#064e78] rounded-sm space-y-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icons.Target className="w-5 h-5 text-[#00A3FF]" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Do you have an Associate Degree (14th Grade)?
            </h4>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                value="yes"
                className="border-gray-300 dark:border-[#064e78] text-[#00A3FF] focus:ring-[#00A3FF]"
                {...register("hasAssociate14thDegree")}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
              <input
                type="radio"
                value="no"
                className="border-gray-300 dark:border-[#064e78] text-[#00A3FF] focus:ring-[#00A3FF]"
                {...register("hasAssociate14thDegree")}
              />
              No
            </label>
          </div>
          {typeof formErrors?.hasAssociate14thDegree?.message === "string" && (
            <p className="text-xs text-red-500">
              {formErrors.hasAssociate14thDegree.message}
            </p>
          )}
        </motion.div>
      );
    }

    if (currentStep === "associate") {
      if (selectedLevel === "Associate") {
        return (
          <HighSchoolSection
            prefix="associate14thEducation"
            register={register}
            errors={formErrors.associate14thEducation}
            watch={watch}
            heading="Associate Degree Details"
            subheading="Provide your associate degree information"
            showFinalExam={false}
          />
        );
      }

      return (
        <HighSchoolSection
          prefix="primarySchool"
          register={register}
          errors={formErrors.primarySchool}
          watch={watch}
          heading="Associate Degree Details"
          subheading="Provide your associate degree information"
          showFinalExam={false}
        />
      );
    }

    if (currentStep === "highschool") {
      return (
        <HighSchoolSection
          prefix="highSchoolEducation.0"
          register={register}
          errors={formErrors.highSchoolEducation?.[0]}
          watch={watch}
          showFinalExam
        />
      );
    }

    if (currentStep === "primary-school") {
      return (
        <HighSchoolSection
          prefix="primarySchool"
          register={register}
          errors={formErrors.primarySchool}
          watch={watch}
          heading="Primary School Details"
          subheading="Provide your primary school information"
          showFinalExam={false}
        />
      );
    }

    return (
      <HighSchoolSection
        prefix="secondarySchoolEducation.0"
        register={register}
        errors={formErrors.secondarySchoolEducation?.[0]}
        watch={watch}
        heading="Secondary School Details"
        subheading="Provide your secondary school information"
        showFinalExam={false}
      />
    );
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-2">
        <div className="relative container">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 md:p-8 relative">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitCurrentStep();
                }}
                className="space-y-6"
              >
                {/* Header Section */}
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-[#064e78]">
                  <div className="p-2 bg-[#00A3FF]/10 rounded-sm">
                    <Icons.Graduation className="w-5 h-5 text-[#00A3FF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Educational Information
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Please provide your educational background details
                    </p>
                  </div>
                </div>

                {/* Education Level Select */}
                <FormInput
                  label="Highest Level of Education"
                  type="select"
                  id="level"
                  placeholder="Select your highest education level"
                  required
                  register={register}
                  error={errors.level}
                  options={educationLevelOptions}
                  icon={<Icons.Graduation className="w-4 h-4" />}
                />

                {selectedLevel && currentStep && (
                  <div className="space-y-6">
                    {/* Step Progress Indicator - Redesigned with better visual hierarchy */}
                    <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-[#064e78] pb-4">
                      {visibleSteps.map((step, idx) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`px-3 py-1.5 text-sm rounded-sm transition-all ${
                            step === currentStep
                              ? "bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white shadow-lg"
                              : "bg-gray-100 dark:bg-[#064e78]/50 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {idx + 1}. {stepLabels[step]}
                        </motion.div>
                      ))}
                    </div>

                    {/* Current Step Form */}
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="animate-fadeIn"
                    >
                      {renderCurrentStep()}
                    </motion.div>
                  </div>
                )}

                {/* Form Actions - Matching Personal component style */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-[#064e78]">
                  <motion.button
                    type="button"
                    onClick={() => router.back()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative group"
                  >
                    <div className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="relative px-4 py-2 bg-white dark:bg-[#011b2b] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 border border-gray-300 dark:border-[#064e78] hover:border-gray-400 dark:hover:border-[#00A3FF]/50 transition-colors">
                      <Icons.ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </div>
                  </motion.button>

                  {selectedLevel && currentStep && getPrevStep() && (
                    <motion.button
                      type="button"
                      onClick={goToPrevStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 relative group"
                    >
                      <div className="relative px-4 py-2 bg-white dark:bg-[#011b2b] text-gray-700 dark:text-gray-300 rounded-sm font-medium text-sm flex items-center justify-center gap-2 border border-gray-300 dark:border-[#064e78] hover:border-gray-400 dark:hover:border-[#00A3FF]/50 transition-colors">
                        <Icons.ArrowLeft className="w-4 h-4" />
                        <span>Previous Step</span>
                      </div>
                    </motion.button>
                  )}

                  <motion.button
                    type="submit"
                    disabled={!selectedLevel || !currentStep || mutation.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative group"
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
                          <span>
                            {getNextStep() ? "Save & Continue" : "Save & Complete"}
                          </span>
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