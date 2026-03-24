"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface AyandahaHomeProps {
  servicesLink?: string;
  registrationLink?: string;
  whatsappNumber?: string;
  emailAddress?: string;
}

const AyandahaHome: React.FC<AyandahaHomeProps> = ({
  servicesLink = "/services",
  registrationLink = "/auth/register",
  whatsappNumber = "+93796493189",
  emailAddress = "ayandaha2026@gmail.com",
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const coreValues = [
    {
      icon: Award,
      title: "Expertise",
      description:
        "Nearly a decade of specialized experience in academic advising",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: BookOpen,
      title: "Commitment",
      description:
        "Dedicated to guiding students at every step of their journey",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Creativity",
      description: "Innovative approaches to educational consulting",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Dedication",
      description: "Unwavering support for Afghanistan's future leaders",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6 md:space-y-12"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-2">
            {/* Badge */}

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight"
            >
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ayandaha - Your Gateway to Global Education
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400  font-light px-2 sm:px-4 max-w-4xl mx-auto text-justify"
            >
              Ayandaha is the first professional educational consulting company
              in Afghanistan, dedicated to guiding students in two key areas:
              choosing the right field of study and pursuing education
              abroad—especially through scholarship opportunities. The company
              is built on nearly a decade of specialized experience in academic
              advising. Ayandaha is also the author of Afghanistan’s first
              professional book on educational consulting and the developer of
              the country’s first structured framework for securing
              scholarships. This innovative framework is designed as a
              comprehensive seven-step process, helping applicants maximize
              their chances of successfully obtaining scholarships.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 rounded-sm blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <Link
                  href={servicesLink}
                  className="relative inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-linear-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 "
                >
                  Our Services
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={registrationLink}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                  Create an Account
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Core Values Section */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Where Expertise Meets Excellence
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-white/50 to-transparent dark:from-gray-800/50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative h-full p-6 rounded-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-sm transition-all duration-300">
                      <div
                        className={`p-3 rounded-sm bg-linear-to-br ${value.color} w-fit mb-4 shadow-sm`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm dark:text-gray-300">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-xl font-bold text-gray-900 dark:text-white mt-10">
                Ready to Begin Your Journey?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 py-3 text-sm rounded-sm bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow-sm transition-all duration-300"
                >
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`mailto:${emailAddress}`}
                  className="group flex items-center justify-center gap-3 px-8 py-3 rounded-sm bg-linear-to-r from-blue-500 to-cyan-600 text-white text-sm shadow-sm hover:shadow-sm transition-all duration-300"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Send an Email</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AyandahaHome;
