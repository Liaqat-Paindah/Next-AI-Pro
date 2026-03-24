"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  ArrowRight,
  FileText,
  Target,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface FrameworkStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  linear: string;
}

const frameworkSteps: FrameworkStep[] = [
  {
    id: 1,
    title: "Create Your Account",
    description:
      "Start your journey by creating an account to access our Scholarship Attainment Framework.",
    icon: UserPlus,
    color: "blue",
    linear:
      "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
  },
  {
    id: 2,
    title: "Complete Your Profile",
    description:
      "Build a comprehensive profile showcasing your achievements, goals, and qualifications.",
    icon: FileText,
    color: "purple",
    linear:
      "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10",
  },
  {
    id: 3,
    title: "Follow Guidance",
    description:
      "Receive personalized recommendations and expert guidance to strengthen your profile.",
    icon: Target,
    color: "amber",
    linear:
      "from-amber-500/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10",
  },
];

const ScholarshipFrameworkLanding = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { data: session } = useSession();

  const getColorStyles = (color: string) => {
    const styles = {
      blue: {
        light: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500 dark:border-blue-500",
        icon: "bg-linear-to-br from-blue-500 to-cyan-500",
        glow: "shadow-blue-500/20",
      },
      purple: {
        light: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500 dark:border-purple-500",
        icon: "bg-linear-to-br from-purple-500 to-pink-500",
        glow: "shadow-purple-500/20",
      },
      amber: {
        light: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500 dark:border-amber-500",
        icon: "bg-linear-to-br from-amber-500 to-orange-500",
        glow: "shadow-amber-500/20",
      },
    };
    return styles[color as keyof typeof styles];
  };

  return (
    <div className="min-h-screen">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-1/4 top-0 h-125 w-125 rounded-full bg-blue-500/20 blur-[120px] dark:bg-blue-500/10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-1/4 bottom-0 h-125 w-125 rounded-full bg-purple-500/20 blur-[120px] dark:bg-purple-500/10"
        />

        {/* Subtle Grid Pattern */}
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
            Start Your{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scholarship Journey
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-6xl p-0 px-4 text-sm text-justify text-gray-600 dark:text-gray-400 ">
            Join our Scholarship Attainment Framework, a creative and structured
            seven-stage process designed to help you maximize your chances of
            winning an international scholarship. Through this framework, you
            receive guidance from experienced professional advisors who work
            with you to strengthen your profile and prepare a high-quality,
            competitive application.
          </p>
        </motion.div>

        {/* Framework Steps - Vertical Layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          <div className="flex flex-col gap-4">
            {frameworkSteps.map((step, index) => {
              const Icon = step.icon;
              const isHovered = hoveredStep === step.id;
              const colorStyles = getColorStyles(step.color);

              return (
                <div key={step.id} className="relative">
                  {/* Connecting Vector */}
                  {index < frameworkSteps.length - 1 && (
                    <div className="absolute left-10 -bottom-8 z-10 hidden sm:block">
                      <div className="relative flex flex-col items-center">
                        {/* Vertical Line */}
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            delay: 0.5 + index * 0.2,
                            duration: 0.6,
                          }}
                          className="h-12 w-px bg-linear-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"
                        />
                        {/* Animated Arrow */}
                        <motion.div
                          animate={{
                            y: [0, 6, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                          className="absolute -bottom-1"
                        >
                          <ChevronDown
                            className={`h-5 w-5 ${colorStyles.light}`}
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Step Card - Professional Design */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    onHoverStart={() => setHoveredStep(step.id)}
                    onHoverEnd={() => setHoveredStep(null)}
                    className="group"
                  >
                    <div
                      className={`
                        relative overflow-hidden rounded-sm border transition-all duration-300
                        bg-white dark:bg-gray-900/50 backdrop-blur-sm
                        ${
                          isHovered
                            ? `${colorStyles.border} shadow-sm ${colorStyles.glow}`
                            : "border-gray-200 dark:border-gray-800 shadow-sm"
                        }
                      `}
                    >
                      <div className="relative p-6">
                        <div className="flex items-start gap-6">
                          {/* Icon Section */}
                          <div className="relative shrink-0">
                            <div
                              className={`
                                inline-flex rounded-sm p-4 transition-all duration-300
                                ${colorStyles.icon}
                              `}
                            >
                              <Icon className="h-6 w-6 text-white" />
                            </div>

                            {/* Step Number Badge */}
                            <div
                              className={`
                                absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center
                                rounded-full bg-white text-sm font-semibold shadow-sm
                                dark:bg-gray-800 dark:text-gray-200
                                transition-all duration-300 border border-gray-200 dark:border-gray-700
                              `}
                            >
                              {step.id}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1">
                            <h3
                              className={`mb-3 text-xl font-semibold transition-colors duration-300 ${colorStyles.light}`}
                            >
                              {step.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Final CTA - Professional & Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-4 text-center"
        >
          {!session ? (
            <div className="rounded-sm border border-gray-200 bg-white/50 p-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/30">
              <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
                Ready to Begin?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                Join thousands of successful scholars who have achieved their
                dreams through our proven framework.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-sm bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-sm"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Create Your Account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group rounded-sm border border-gray-300 bg-transparent px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-white"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </div>
          ) : (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-sm bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:shadow-sm"
              >
                Continue Your Journey
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ScholarshipFrameworkLanding;