"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "@/components/services/Icons";
import { ServiceCardProps } from "@/types/services";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.6 }
  })
};

const services: ServiceCardProps[] = [
  {
    icon: <Icons.Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "International Admissions",
    description:
      "Comprehensive guidance for studying abroad at top universities worldwide. We handle everything from university selection to visa processing.",
    features: [
      "University Selection",
      "Application Support",
      "Visa Guidance",
      "Scholarship Assistance",
    ],
    index: 0,
  },
  {
    icon: <Icons.Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Career Counseling",
    description: "Personalized career path planning and professional development with expert mentors and industry insights.",
    features: [
      "Career Assessment",
      "Profile Building",
      "Interview Prep",
      "Internship Placement",
    ],
    index: 1,
  },
  {
    icon: <Icons.Award className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Test Preparation",
    description: "Expert coaching for standardized tests and entrance exams with personalized study plans and mock tests.",
    features: ["IELTS/TOEFL", "SAT/ACT", "GRE/GMAT", "Subject Tests"],
    index: 2,
  },
  {
    icon: <Icons.Values className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Scholarship Support",
    description:
      "Dedicated assistance in securing financial aid and merit-based awards to make your education affordable.",
    features: [
      "Scholarship Search",
      "Essay Editing",
      "Application Strategy",
      "Interview Coaching",
    ],
    index: 3,
  },
];

export const ServiceCard = ({
  icon,
  title,
  description,
  features,
  index,
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      {/* Digital border effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur" />

      <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-4 sm:p-5 md:p-6 h-full flex flex-col">
        {/* Icon with animation */}
        <div className="relative mb-3 sm:mb-4">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 flex items-center justify-center border border-[#00A3FF]/30"
          >
            <div className="text-[#00A3FF] dark:text-[#00A3FF]">{icon}</div>
          </motion.div>

          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-[#00A3FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 grow line-clamp-3">{description}</p>

        {/* Features list */}
        <div className="space-y-1.5 sm:space-y-2">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
              className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-600 dark:text-gray-400"
            >
              <Icons.Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00A3FF] " />
              <span className="truncate">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Digital scan line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
          initial={{ width: "0%" }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

export default function Services() {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <motion.h1
            custom={1}
            variants={textVariants}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3"
          >
            Let's Start Your{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00A3FF] to-[#7000FF]">
              Journey
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light px-4"
          >
            Ready to transform your educational future? Our digital platform
            connects you with world-class opportunities and expert guidance 
            every step of the way.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* Optional: Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center"
        >
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            All services include personalized support and digital tracking • 
            <span className="text-[#00A3FF]"> 100% satisfaction guaranteed</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}