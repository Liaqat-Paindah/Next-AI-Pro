"use client";

import { useHobbies } from "@/hooks/useApplication";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { UseFormRegister, FieldError } from "react-hook-form";
import Loading from "@/app/loading";

const hobbiesSchema = z.object({
  favoriteSports: z
    .string()
    .min(1, "Favorite sports is required. If none, please write 'None'."),
  leisureActivities: z
    .string()
    .min(1, "Leisure activities are required. If none, please write 'None'."),
});

export type HobbiesFormData = z.infer<typeof hobbiesSchema>;

// Icons for the form
const Icons = {
  Sports: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20" />
    </svg>
  ),
  Leisure: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
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

// Form Input Props Interface
interface FormInputProps {
  label: string;
  type: string;
  id: keyof HobbiesFormData;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<HobbiesFormData>;
  error?: FieldError;
  disabled?: boolean;
  icon?: React.ReactNode;
}

// Form Input Component
const FormInput = ({
  label,
  id,
  placeholder,
  required,
  register,
  error,
  disabled,
  icon,
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type="text"
          id={id}
          {...register(id)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`w-full ${icon ? "pl-10" : "px-3"} py-2.5 text-sm bg-white dark:bg-[#011b2b] border ${
            error ? "border-red-500" : "border-gray-200 dark:border-[#064e78]"
          } rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        {/* Digital Underline Effect */}
        {!disabled && (
          <motion.div
            className="absolute -bottom-px left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
            initial={{ width: "0%" }}
            animate={{ width: isFocused ? "100%" : "0%" }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </motion.div>
  );
};

export default function Hobbies() {
  const router = useRouter();
  const { data: UserSession, status } = useSession();
  const mutation = useHobbies(); // You'll need to create this hook

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HobbiesFormData>({
    resolver: zodResolver(hobbiesSchema),
  });

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

  const submit = (data: HobbiesFormData) => {
    // Add userId to the data before submitting
    const payload = {
      ...data,
      userId: UserSession?.user?._id as string,
    };
    mutation.mutate(payload);
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden py-2">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
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
              <form onSubmit={handleSubmit(submit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Header Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider border-b border-gray-200 dark:border-[#064e78] pb-2 mb-4">
                      Hobbies & Interests
                    </h3>
                  </div>

                  {/* Favorite Sports Input */}
                  <FormInput
                    label="Favorite Sports"
                    type="text"
                    id="favoriteSports"
                    placeholder="e.g., Football, Swimming, Basketball, Tennis"
                    register={register}
                    error={errors.favoriteSports}
                    required
                    icon={<Icons.Sports className="w-4 h-4" />}
                  />

                  {/* Leisure Activities Input */}
                  <FormInput
                    label="Leisure Activities / Hobbies"
                    type="text"
                    id="leisureActivities"
                    placeholder="e.g., Reading, Painting, Gaming, Photography"
                    register={register}
                    error={errors.leisureActivities}
                    required
                    icon={<Icons.Leisure className="w-4 h-4" />}
                  />

                  {/* Additional Notes Section (Optional) */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      Share your Interests to help us connect you with
                      like-minded applicants.
                    </p>
                  </div>
                </div>

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
                    disabled={mutation.isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 relative group"
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
