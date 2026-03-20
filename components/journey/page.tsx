"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  ArrowRight,
  FileText,
  Target,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface FrameworkStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  color: string;
}

const frameworkSteps: FrameworkStep[] = [
  {
    id: 1,
    title: "Create Your Account",
    description:
      "Start your journey by creating an account to access our Scholarship Attainment Framework.",
    icon: UserPlus,
    action: "Sign up now",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Complete Your Profile",
    description:
      "Build a comprehensive profile showcasing your achievements, goals, and qualifications.",
    icon: FileText,
    action: "Fill details",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Follow Guidance",
    description:
      "Receive personalized recommendations and expert guidance to strengthen your profile.",
    icon: Target,
    action: "Get started",
    color: "from-amber-500 to-orange-500",
  },
];

const ScholarshipFrameworkLanding = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { data: session } = useSession();

  return (
    <div className="">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-1/4 top-0 h-125 w-125 rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-1/4 bottom-0 h-125 w-125 rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/20"
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            Start Your{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scholarship Journey
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-4xl text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Join our Scholarship Attainment Framework, a creative and structured
            seven-stage process designed to help you maximize your chances of
            winning an international scholarship. Through this framework, you
            receive guidance from experienced professional advisors who work
            with you to strengthen your profile and prepare a high-quality,
            competitive application.
          </p>
        </motion.div>

        {/* Framework Steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {frameworkSteps.map((step, index) => {
              const Icon = step.icon;
              const isHovered = hoveredStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  onHoverStart={() => setHoveredStep(step.id)}
                  onHoverEnd={() => setHoveredStep(null)}
                  className="group relative"
                >
                  {/* Connection Line (except last) - Now clearly visible */}
                  {index < frameworkSteps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block z-10">
                      <div className="relative">
                        <ChevronRight className="h-6 w-6 text-blue-400 dark:text-blue-500" />
                        <motion.div
                          animate={{
                            x: [0, 5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 text-blue-600 dark:text-blue-400"
                        >
                          <ChevronRight className="h-6 w-6 opacity-50" />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Step Card - Smaller and more professional */}
                  <div
                    className={`
                      relative overflow-hidden rounded-lg border border-gray-200 
                      bg-white p-6 backdrop-blur-sm transition-all duration-300
                      dark:border-gray-800 dark:bg-gray-900
                      ${isHovered 
                        ? "scale-[1.02] border-blue-300 shadow-lg dark:border-blue-700" 
                        : "shadow-sm hover:shadow-md"
                      }
                    `}
                  >
                    {/* Step Number - More subtle */}
                    <div className="absolute -right-2 -top-2 h-16 w-16">
                      <div
                        className={`
                          absolute inset-0 rounded-full bg-linear-to-r ${step.color} 
                          opacity-5 transition-all duration-300
                          ${isHovered ? "opacity-10" : ""}
                        `}
                      />
                      <span
                        className={`
                          absolute right-6 top-6 text-2xl font-bold 
                          transition-all duration-300
                          ${isHovered 
                            ? "text-blue-400 dark:text-gray-700" 
                            : "text-blue-400 dark:text-gray-800"
                          }
                        `}
                      >
                        {step.id}
                      </span>
                    </div>

                    {/* Icon - Smaller */}
                    <div className="relative mb-4">
                      <div
                        className={`
                          inline-flex rounded-lg bg-linear-to-r ${step.color} p-2.5
                          transition-all duration-300
                          ${isHovered ? "shadow-md" : ""}
                        `}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    {/* Content - Condensed */}
                    <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mb-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Action Button - Minimal */}
                    {!session && (
                      <Link href="/auth/register">
                        <motion.button
                          whileHover={{ x: 3 }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {step.action}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Final CTA - More compact */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          {!session ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                Join thousands of successful scholars who have achieved their
                dreams through our framework.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
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
                    className="group rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
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
                className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:shadow-lg"
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