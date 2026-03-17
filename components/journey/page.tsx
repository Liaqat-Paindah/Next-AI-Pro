"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  ArrowRight,
  FileText,
  Target,
  Sparkles,
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
    <div className=" min-h-screen overflow-hidden ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* linear Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-1/4 top-0 h-125 w-125 rounded-sm bg-blue-500/10 blur-[120px] dark:bg-blue-500/20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -right-1/4 bottom-0 h-125 w-125 rounded-sm bg-purple-500/10 blur-[120px] dark:bg-purple-500/20"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-[0.02] dark:opacity-[0.05]" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-900/50 dark:bg-blue-950/50"
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Your Path to International Scholarships
            </span>
          </motion.div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
            Start Your{" "}
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scholarship Journey
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-5xl text-sm text-gray-400 dark:text-gray-300">
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
          className="mt-8"
        >
          <div className="grid gap-6 lg:grid-cols-3">
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
                  {/* Connection Line (except last) */}
                  {index < frameworkSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/3 hidden lg:block">
                      <ChevronRight className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                    </div>
                  )}

                  {/* Step Card */}
                  <div
                    className={`
                      relative overflow-hidden rounded-sm border border-gray-200 
                      bg-white/50 p-8 backdrop-blur-sm transition-all duration-500
                      dark:border-gray-800 dark:bg-gray-900/50
                      ${isHovered ? "scale-105 border-blue-300 shadow-xl dark:border-blue-700" : ""}
                    `}
                  >
                    {/* Step Number */}
                    <div className="absolute -right-4 -top-4 h-20 w-20">
                      <div
                        className={`
                          absolute inset-0 rounded-sm bg-linear-to-r ${step.color} 
                          opacity-10 blur-2xl transition-all duration-500
                          ${isHovered ? "scale-150 opacity-20" : ""}
                        `}
                      />
                      <span
                        className={`
                          absolute right-8 top-8 text-3xl font-bold text-gray-200 
                          transition-all duration-500 dark:text-gray-800
                          ${isHovered ? "scale-110 text-blue-200 dark:text-blue-900" : ""}
                        `}
                      >
                        {step.id}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="relative mb-6">
                      <div
                        className={`
                          inline-flex rounded-sm bg-linear-to-r ${step.color} p-3
                          transition-all duration-500
                          ${isHovered ? "scale-110 shadow-lg" : ""}
                        `}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="mb-3 text-md font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>

                    {/* Action Button */}
                    {!session && (
                      <Link href="/auth/register">
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {step.action}
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          {!session ? (
            <div className="rounded-sm border border-gray-200 bg-white/50 p-12 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/50">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                Join thousands of successful scholars who have achieved their
                dreams through our framework.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden rounded-sm bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 text-md  text-white shadow-sm transition-all hover:shadow-sm"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Create Your Account
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </Link>
                <Link href="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group rounded-sm border border-gray-300 bg-transparent px-6 py-3 text-md text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </div>
            </div>
          ) : (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
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
