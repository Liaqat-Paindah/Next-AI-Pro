"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";

// Enhanced Icons with smaller sizing
const Icons = {
  Globe: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
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
  Users: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Award: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
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
  Lightning: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
    </svg>
  ),
  Sparkles: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
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
  Check: ({ className = "w-2.5 h-2.5" }) => (
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
  Target: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
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
  Compass: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
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
  Heart: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Book: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Link: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  WhatsApp: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21z" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  ),
  Mail: ({ className = "w-3 h-3 sm:w-3.5 sm:h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  ),
};

// Digital Cursor Effect
const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 12);
      cursorY.set(e.clientY - 12);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-6 w-6 rounded-sm border border-[#6ABAE1] dark:border-[#6ABAE1] hidden lg:block mix-blend-difference opacity-60"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    />
  );
};

// Feature Chip Component - Fixed with proper link handling
const FeatureChip = ({
  text,
  icon,
  link,
}: {
  text: string;
  link?: string;
  icon?: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isExternalLink =
    link?.startsWith("http") ||
    link?.startsWith("mailto") ||
    link?.startsWith("https://wa.me");

  const handleClick = () => {
    if (link) {
      if (isExternalLink) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = link;
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={`flex items-center gap-1.5 rounded-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#6ABAE1]/50 hover:shadow-md transition-all duration-300 ${link ? "cursor-pointer" : "cursor-default"}`}
    >
      {icon && (
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.4 }}
          className="text-[#6ABAE1]"
        >
          {icon}
        </motion.div>
      )}
      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
        {text}
      </span>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-col items-center gap-0.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2.5 border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
    >
      <motion.div
        animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        className="text-[#6ABAE1]"
      >
        {icon}
      </motion.div>
      <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
        {value}
      </span>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
};

// Info Card Component
const InfoCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 h-full shadow-sm hover:shadow-md transition-all">
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          className="w-9 h-9 rounded-lg bg-[#6ABAE1]/10 dark:bg-[#6ABAE1]/20 flex items-center justify-center mb-3 border border-[#6ABAE1]/20"
        >
          <div className="text-[#6ABAE1]">{icon}</div>
        </motion.div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1.5">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Goal Card Component
const GoalCard = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start gap-3">
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.4 }}
            className="w-9 h-9 rounded-lg bg-[#6ABAE1]/10 dark:bg-[#6ABAE1]/20 flex items-center justify-center shrink-0 border border-[#6ABAE1]/20"
          >
            <div className="text-[#6ABAE1]">{icon}</div>
          </motion.div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-0.5">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main About Component
export default function AyandahaDigitalAbout() {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 + custom * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full bg-linear-to-br from-blue-50/50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-linear(rgba(106,186,225,0.02)_1px,transparent_1px),linear-linear(90deg,rgba(106,186,225,0.02)_1px,transparent_1px)] bg-size-[24px_24px]" />
          <motion.div
            className="absolute top-10 left-5 w-32 h-32 bg-[#6ABAE1]/10 rounded-sm blur-2xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-5 w-40 h-40 bg-purple-500/10 rounded-sm blur-2xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Main Content - Consistent padding */}
        <div className="relative container mx-auto px-6 sm:px-8 py-10 sm:py-14 md:py-18">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.h1
              custom={0}
              variants={textVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              About{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6ABAE1] to-purple-500">
                Us
              </span>
            </motion.h1>
            <motion.div
              custom={1}
              variants={textVariants}
              className="w-14 h-0.5 bg-linear-to-r from-[#6ABAE1] to-purple-500 mx-auto rounded-sm"
            />
          </motion.div>

          {/* Description - Shortened version */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-3 mb-10"
          >
            <motion.p
              custom={2}
              variants={textVariants}
              className="text-sm sm:text-base text-justify text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Ayandaha began in early 2018 as a research initiative to develop
              Afghanistan`s first comprehensive educational consulting book. The
              project involved extensive field research across universities
              nationwide and in-depth library research on international
              curricula.
            </motion.p>
            <motion.p
              custom={3}
              variants={textVariants}
              className="text-sm sm:text-base text-justify text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              The resulting publication—Ayandaha—became Afghanistan`s first
              professional educational consulting book, providing thorough
              guidance on academic disciplines, career prospects, and global
              educational trends for students and educators.
            </motion.p>
            <motion.p
              custom={4}
              variants={textVariants}
              className="text-sm sm:text-base text-justify text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              This initiative laid the foundation for professional educational
              consulting in Afghanistan. Today (2026), Ayandaha has evolved into
              a professional consulting company, bringing together experienced
              consultants with deep expertise in education, counseling, and
              international study pathways.
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10"
          >
            <StatCard icon={<Icons.Globe />} label="Countries" value="30+" />
            <StatCard icon={<Icons.Users />} label="Students" value="15K+" />
            <StatCard
              icon={<Icons.Award />}
              label="Scholarships"
              value="5.2K+"
            />
          </motion.div>

          {/* Goals Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-2"
          >
            <motion.h2
              custom={0}
              variants={textVariants}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-3"
            >
              Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#6ABAE1] to-purple-500">
                Goals
              </span>
            </motion.h2>
            <motion.p
              custom={1}
              variants={textVariants}
              className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-400 max-w-6xl mx-auto mb-6"
            >
              Supporting students in making informed academic decisions and
              accessing international education opportunities
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-6">
              <GoalCard
                index={0}
                icon={<Icons.Compass />}
                title="Informed Decisions"
                description="Strategic guidance for academic and career paths aligned with global trends"
              />
              <GoalCard
                index={1}
                icon={<Icons.Globe />}
                title="International Access"
                description="Expanding access to global education, especially scholarships in developed countries"
              />
            </div>

            <div className="max-w-4xl mx-auto space-y-2">
              <motion.p
                custom={2}
                variants={textVariants}
                className="text-sm sm:text-base text-justify text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                In todays rapidly evolving world, choosing future-ready career
                paths is essential. We provide professional guidance to help
                students align their education with global labor market demands.
              </motion.p>
              <motion.p
                custom={3}
                variants={textVariants}
                className="text-sm sm:text-base text-justify text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Our core priority is helping students pursue education abroad
                through scholarships. We have developed a comprehensive
                seven-step framework designed to maximize scholarship success.
              </motion.p>
            </div>
          </motion.div>

          {/* Vision, Mission, Values */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8  ">
            <InfoCard
              index={0}
              icon={<Icons.Target />}
              title="Our Vision"
              description="To become a trusted regional institution serving as a reliable reference for educational guidance and gateway to global academic opportunities."
            />
            <InfoCard
              index={1}
              icon={<Icons.Award />}
              title="Our Mission"
              description="To provide accurate, informed, and professional educational guidance while maximizing students' opportunities for obtaining scholarships."
            />
            <InfoCard
              index={2}
              icon={<Icons.Heart />}
              title="Our Values"
              description="Social responsibility, integrity, transparency, and accountability in all our services and interactions."
            />
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 p-5 rounded-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm max-w-4xl mx-auto text-center"
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
              Start Your Journey with Ayandaha
            </h3>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              <FeatureChip
                text="Services"
                icon={<Icons.Link />}
                link="/services"
              />
              <FeatureChip
                text="Create Account"
                icon={<Icons.Book />}
                link="/auth/register"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <FeatureChip
                text="WhatsApp"
                icon={<Icons.WhatsApp />}
                link="https://wa.me/93796493189?text=Hello%20I%20need%20assistance"
              />
              <FeatureChip
                text="Email"
                icon={<Icons.Mail />}
                link="mailto:ayandaha2026@gmail.com"
              />
            </div>
          </motion.div>
        </div>

        {/* Subtle Borders */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#6ABAE1]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#6ABAE1]/30 to-transparent" />
      </section>
    </>
  );
}
