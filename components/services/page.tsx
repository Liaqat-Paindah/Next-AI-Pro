"use client";

import React, { useState } from "react";
import { motion, useInView } from "framer-motion";

const Icons = {
  Globe: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Compass: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v4M22 12h-4M12 20v2M4 12H2M20 12h2M12 4v2M18 12h2M12 18v2M6 12H4" />
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
  Check: ({ className = "w-3 h-3" }) => (
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
  Sparkles: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5" />
    </svg>
  ),
  Award: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="7" />
      <polygon points="12 2 14 7 19 7 15 11 17 16 12 13 7 16 9 11 5 7 10 7 12 2" />
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
      <path d="M4 4h16v2H4V4zm2 4h12v2H6V8zm14-4v14c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4h16z" />
    </svg>
  ),
  Framework: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
  Expertise: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  Star: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
  Phone: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7L12 14 2 7" />
    </svg>
  ),
  ChevronRight: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  WhatsApp: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M12.031 2.016c-5.484 0-9.984 4.5-9.984 9.984 0 1.828.516 3.563 1.406 5.063l-1.453 4.922 5.109-1.406c1.406.844 3.047 1.406 4.922 1.406 5.484 0 9.984-4.5 9.984-9.984s-4.5-9.985-9.984-9.985zm0 1.969c4.406 0 7.969 3.563 7.969 7.969s-3.563 7.969-7.969 7.969c-1.5 0-2.953-.422-4.219-1.172l-0.328-0.188-3.047 0.844 0.891-3.047-0.188-0.328c-0.797-1.266-1.219-2.719-1.219-4.266 0-4.406 3.563-7.969 7.969-7.969zm-2.719 4.5c-0.188 0-0.422 0.047-0.656 0.047-0.234 0-0.563 0.094-0.844 0.469s-1.078 1.078-1.078 2.625 1.125 3.047 1.266 3.234c0.141 0.188 2.063 3.188 5.016 4.453 2.953 1.266 2.953 0.844 3.516 0.797 0.563-0.047 1.828-0.797 2.063-1.547 0.234-0.75 0.234-1.406 0.188-1.547-0.047-0.141-0.188-0.234-0.422-0.375s-1.266-0.656-1.453-0.703c-0.188-0.047-0.328-0.047-0.469 0.094-0.141 0.141-0.563 0.703-0.703 0.844-0.141 0.141-0.281 0.188-0.469 0.094-0.188-0.094-0.797-0.328-1.5-0.938-0.563-0.469-0.938-1.031-1.031-1.219-0.094-0.188-0.016-0.281 0.094-0.422 0.094-0.094 0.234-0.281 0.328-0.422 0.094-0.141 0.141-0.281 0.188-0.422 0.047-0.141 0-0.281-0.047-0.375-0.047-0.094-0.422-1.031-0.609-1.406-0.141-0.328-0.328-0.281-0.469-0.281h-0.422c-0.141 0-0.375 0.047-0.563 0.234-0.188 0.188-0.703 0.703-0.703 1.734 0 1.031 0.75 2.016 0.844 2.156 0.094 0.141 1.453 2.297 3.563 3.188 2.109 0.891 2.109 0.609 2.484 0.563 0.375-0.047 1.219-0.516 1.406-1.031 0.188-0.516 0.188-0.938 0.141-1.031-0.047-0.094-0.188-0.141-0.422-0.234z" />
    </svg>
  ),
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description: string;
  descriptionDetailed: string;
  features: string[];
  highlights: string[];
  index: number;
}

const renderFeatureText = (feature: string) => {
  const [featureTitle, ...featureDetails] = feature.split(":");

  if (featureDetails.length === 0) {
    return feature;
  }

  return (
    <>
      <span className="font-bold text-[#6ABAE1]">{featureTitle}:</span>{" "}
      {featureDetails.join(":").trim()}
    </>
  );
};

const ServiceCard = ({
  icon,
  title,
  subtitle,
  description,
  descriptionDetailed,
  features,
  index,
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group flex justify-center"
    >
      <div className="w-full max-w-5xl">
        <div
          className={`
            relative bg-white dark:bg-gray-800/90 
            border border-gray-200 dark:border-gray-700 
            rounded-sm overflow-hidden
            transition-all duration-400
            hover:border-[#6ABAE1]/40 dark:hover:border-[#6ABAE1]/40
            hover:shadow-2xl hover:shadow-[#6ABAE1]/10
            backdrop-blur-sm
          `}
        >
          {/* Top gradient accent bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#6ABAE1] to-purple-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
            style={{ originX: 0 }}
          />

          {/* Content Container */}
          <div className="p-5 sm:p-6 md:p-8">
            {/* Header with Icon and Title */}
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <motion.div
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  rotate: isHovered ? 3 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm bg-linear-to-br from-[#6ABAE1]/15 to-purple-600/15 flex items-center justify-center border border-[#6ABAE1]/30 shadow-sm shrink-0"
              >
                <div className="text-[#6ABAE1]">{icon}</div>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {title}
                </h3>
                {subtitle && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 sm:w-6 h-px bg-[#6ABAE1]/50" />
                    <p className="text-xs sm:text-sm text-[#6ABAE1] font-medium">
                      {subtitle}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Short Description */}
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                {description}
              </p>
            )}

            {/* Detailed Description */}
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/50 rounded-sm border-l-3 border-[#6ABAE1]">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {descriptionDetailed}
              </p>
            </div>

            {/* Features Section */}
            <div className="mb-5 sm:mb-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-1 h-3 sm:h-4 bg-[#6ABAE1] rounded-full" />
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {title.includes("Academic")
                    ? "Our Services"
                    : "Our Seven-Stage Scholarship Attainment Framework"}
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.02 + i * 0.02,
                      duration: 0.3,
                    }}
                    className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 group/item"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#6ABAE1]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] sm:text-[10px] font-bold text-[#6ABAE1]">
                        {i + 1}
                      </span>
                    </div>
                    <span className="leading-relaxed flex-1">
                      {renderFeatureText(feature)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative corner glow */}
          <motion.div
            className="absolute -bottom-12 -right-12 w-24 h-24 sm:w-32 sm:h-32 bg-[#6ABAE1]/5 rounded-full blur-2xl pointer-events-none"
            animate={{
              scale: isHovered ? 1.2 : 0.8,
              opacity: isHovered ? 0.5 : 0.2,
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Services Data
// ============================================================================

const services = [
  {
    icon: <Icons.Compass className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
    title: "Academic and Career Path Guidance",
    subtitle: "Field of Study Selection",
    description: "",
    descriptionDetailed:
      "Choosing a field of study—and ultimately a career path—is one of the most critical decisions in the educational journey. Today, this decision is more important than ever, as rapid scientific and technological advancements continue to reshape global job markets. Every year, many professions disappear while new ones emerge, making it essential to align one's career path with these ongoing changes. With our strong track record and pioneering work in this field, we confidently position ourselves as a leading professional educational consulting provider in Afghanistan. Our expertise is grounded in extensive research and the publication of the country's first professional book on educational consulting (Ayandaha).",
    features: [
      "Ayandaha Book: Comprehensive academic fields resource (Continuous updating, publishing, and distribution)",
      "One-on-One Academic & Career Counseling",
      "Seminars & Advisory Programs (Short workshops to one-month courses)",
      "Expert-led labor market trend analysis and academic choice discussions",
      "Scholarship field selection advising for international universities",
    ],
    highlights: [
      "First professional educational consulting in Afghanistan",
      "Authored country's first professional educational consulting book (Ayandaha)",
      "Pioneering research & publication",
    ],
  },
  {
    icon: <Icons.Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />,
    title: "Access to International Scholarships",
    subtitle: "7-Stage Success System",
    description:
      "A structured 7-stage system designed to maximize your chances of securing international scholarships.",
    descriptionDetailed:
      "Our second core service focuses on supporting students in securing international scholarships. Scholarships are widely regarded as the most valuable pathway to studying abroad, as they provide financial support—an especially important advantage for many of our students. We are committed to helping an increasing number of students access these life-changing opportunities each year. To achieve this, we have designed an innovative and structured system called the 'Scholarship Attainment Framework.' This framework is specifically developed to maximize applicants' chances of success. A key feature of our approach is early preparation. We engage applicants well before scholarship announcements, guiding them through a structured preparation process. This is essential, as international scholarships often have demanding requirements that cannot be met overnight—they require time, planning, and consistent effort. Our framework enables students to gradually build their profiles under the guidance of our expert advisors.",
    features: [
      "Information Submission: At this stage, applicants provide all necessary personal, academic, and professional information required for evaluation and application",
      "Eligibility Assessment: At this stage, we assess each applicant's profile against international scholarship criteria and provide clear feedback.",
      "Eligibility Alignment: At this stage, we guide applicants on how to meet and align with scholarship requirements and standards.",
      "Competitive Enhancement: At this stage, we help applicants strengthen their profiles to meet high competitive standards, significantly improving their chances of success",
      "Application Customization: At this stage, we tailor each application to align with the specific goals and values of each scholarship program.",
      "Application Submission: At this stage, we professionally submit applications in accordance with best practices and established guidelines",
      "Post-Submission Follow-Up: At this stage, through strategic and proactive communication, we work to increase applicants' visibility and positively influence selection outcomes.",
    ],
    highlights: [
      "First structured framework for scholarship success",
      "Early preparation & profile building",
      "Strategic post-submission follow-up",
    ],
  },
];

// ============================================================================
// Why Choose Us Data
// ============================================================================

const whyChooseUs = [
  {
    icon: <Icons.Star className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "First in Afghanistan",
    desc: "First professional educational consulting initiative",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
  {
    icon: <Icons.Book className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Ayandaha Publication",
    desc: "Country's first professional educational consulting book",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <Icons.Framework className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Structured Framework",
    desc: "First structured framework for scholarship success",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    icon: <Icons.Expertise className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Expert Team",
    desc: "Years of expertise in education & consulting",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
];

// ============================================================================
// Main Services Component
// ============================================================================

export default function Services() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Active contact links - update with your actual details
  const whatsappNumber = "+93700000000"; // Replace with actual WhatsApp number
  const emailAddress = "info@pathways.edu.af"; // Replace with actual email
  const registrationLink = "/register"; // Replace with actual registration path or URL

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 2px 2px, rgba(106, 186, 225, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#6ABAE1]/10 rounded-full blur-3xl"
          animate={{ x: ["0%", "10%", "0%"], y: ["0%", "5%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ x: ["0%", "-5%", "0%"], y: ["0%", "-8%", "0%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 lg:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
          >
            Our{" "}
            <span className="bg-linear-to-r from-[#6ABAE1] to-purple-600 bg-clip-text text-transparent">
              Services
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2"
          >
            We firmly believe that every individual deserves dignity and
            respect. These values should guide all human interactions. With this
            principle at our core, we are committed to delivering our services
            in a manner that reflects the worth of our people—especially our
            students, who represent the future of our society.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-4 sm:mt-6"
          >
            <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
              We primarily support students in{" "}
              <span className="bg-linear-to-r from-[#6ABAE1] to-purple-600 bg-clip-text text-transparent">
                two key areas:
              </span>
            </p>
          </motion.div>
        </motion.div>

        {/* Services Grid - Centered Cards */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {services.map((service, idx) => (
            <ServiceCard key={service.title} {...service} index={idx} />
          ))}
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-10 md:mt-12"
        >
          <div className="relative rounded-sm overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#6ABAE1]/5 via-transparent to-purple-600/5" />
            <div className="relative p-5 sm:p-6 md:p-8 lg:p-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-sm">
              <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                  <Icons.Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#6ABAE1]" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Why Choose{" "}
                    <span className="bg-linear-to-r from-[#6ABAE1] to-purple-600 bg-clip-text text-transparent">
                      Us?
                    </span>
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Setting the standard for educational consulting in Afghanistan
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {whyChooseUs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className={`text-center p-4 sm:p-5 rounded-sm bg-linear-to-br ${item.gradient} backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-sm bg-white dark:bg-gray-900 flex items-center justify-center text-[#6ABAE1] shadow-sm">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section with Active Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 sm:mt-12 md:mt-16"
        >
          <div className="relative rounded-sm overflow-hidden bg-linear-to-r from-[#6ABAE1] to-purple-600 p-px">
            <div className="relative rounded-sm bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 text-center">
              <motion.div
                initial={{ scale: 0.98 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Ready to Transform Your Future?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-lg mx-auto px-2">
                  Join hundreds of successful students who have achieved their
                  academic dreams through our guidance and support.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  {/* Register Now Link */}
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={registrationLink}
                    className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-sm bg-linear-to-r from-[#6ABAE1] to-purple-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base inline-flex items-center gap-1"
                  >
                    Register Now
                    <Icons.ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 inline ml-1" />
                  </motion.a>

                  {/* Contact Options */}
                  <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {/* WhatsApp Link */}
                    <a
                      href={`https://wa.me/+93796493189`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-[#6ABAE1] transition-colors duration-200 group"
                    >
                      <Icons.WhatsApp className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-green-500 group-hover:scale-110 transition-transform" />
                      <span className="hidden xs:inline">WhatsApp</span>
                      <span className="xs:hidden">WhatsApp</span>
                    </a>
                    <span className="w-px h-3 bg-gray-300 dark:bg-gray-600" />
                    {/* Email Link */}
                    <a
                      href={`mailto:ayandaha2026@gmail.com`}
                      className="flex items-center gap-1.5 hover:text-[#6ABAE1] transition-colors duration-200 group"
                    >
                      <Icons.Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-500 group-hover:text-[#6ABAE1] transition-colors" />
                      <span className="hidden xs:inline">Email</span>
                      <span className="xs:hidden">Mail</span>
                    </a>
                  </div>
                </div>

                {/* Optional: Show email and phone hint on very small screens */}
                <div className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 sm:hidden">
                  {whatsappNumber.replace(/^\+/, "")} • {emailAddress}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
