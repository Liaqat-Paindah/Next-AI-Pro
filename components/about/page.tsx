"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";

// Reusing icons from the carousel
const Icons = {
  Globe: () => (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Users: () => (
    <svg
      className="w-3.5 h-3.5"
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
  Award: () => (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="7" />
      <polygon points="12 2 14 7 19 7 15 11 17 16 12 13 7 16 9 11 5 7 10 7 12 2" />
    </svg>
  ),
  Lightning: () => (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
    </svg>
  ),
  Sparkles: () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5" />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-3 h-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Target: () => (
    <svg
      className="w-3.5 h-3.5"
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
  Compass: () => (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v4M22 12h-4M12 20v2M4 12H2M20 12h2M12 4v2M18 12h2M12 18v2M6 12H4" />
    </svg>
  ),
  Heart: () => (
    <svg
      className="w-3.5 h-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

// Digital Cursor Effect Component (reused from carousel)
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
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 border-[#6ABAE1] dark:mix-blend-difference hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

// Feature Chip Component (reused from carousel)
const FeatureChip = ({
  text,
  index,
  icon,
}: {
  text: string;
  index: number;
  icon?: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex items-center gap-1.5 rounded-sm bg-white/10 dark:bg-black/30 backdrop-blur-sm px-3 py-1.5 border border-white/20 dark:border-white/10"
    >
      {icon && (
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className="text-blue-300 dark:text-blue-400"
        >
          {icon}
        </motion.div>
      )}
      <span className="text-xs text-white/90 dark:text-white/90">{text}</span>
    </motion.div>
  );
};

// Metric Card Component (adapted from carousel)
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
      whileHover={{ scale: 1.05, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex flex-col items-center justify-center gap-1 rounded-sm bg-white/10 dark:bg-black/30 backdrop-blur-sm px-4 py-3 border border-white/20 dark:border-white/10 min-w-25"
    >
      <motion.div
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="text-blue-300 dark:text-blue-400 mb-1"
      >
        {icon}
      </motion.div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-white dark:text-white">
          {value}
        </span>
        <span className="text-[10px] text-white/70 dark:text-white/70 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </motion.div>
  );
};

// Value Card Component
const ValueCard = ({
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Digital Border Effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#6ABAE1] to-purple-600 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm" />

      <div className="relative bg-white/5 dark:bg-black/40 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-sm p-6 h-full">
        {/* Icon with animation */}
        <motion.div
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 rounded-sm bg-[#6ABAE1]/20 flex items-center justify-center mb-4 border border-[#6ABAE1]/30"
        >
          <div className="text-[#6ABAE1]">{icon}</div>
        </motion.div>

        <h3 className="text-lg font-bold text-white mb-2 font-display">
          {title}
        </h3>
        <p className="text-sm text-white/80 dark:text-white/80 font-light">
          {description}
        </p>

        {/* Digital Pulse Effect */}
        <motion.div
          className="absolute -bottom-10 right-0 w-20 h-20 bg-[#6ABAE1]/5 rounded-sm blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};

// Main About Component
export default function AyandahaDigitalAbout() {
  // Text animation variants
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + custom * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full bg-[#001F4B] dark:bg-gray-900 overflow-hidden">
        {/* Background with digital grid */}
        <div className="absolute inset-0">
          {/* Digital Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-linear(rgba(255,255,255,0.02)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[32px_32px]" />

          {/* linear Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-[#6ABAE1]/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          {/* Header Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            {/* Digital Tag */}
            <motion.div
              custom={0}
              variants={textVariants}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              ></motion.div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              custom={1}
              variants={textVariants}
              className="text-3xl md:text-2xl lg:text-3xl font-bold text-white mb-4 font-display"
            >
              Empowering Dreams
              <span className=" text-[#6ABAE1]"> Through Education</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              variants={textVariants}
              className="text-sm md:text-base text-white/80 dark:text-white/80 max-w-2xl mx-auto font-light"
            >
              Ayandaha Educational Consulting Services Co. is dedicated to
              guiding students toward international academic opportunities, from
              scholarship discovery to successful enrollment.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <StatCard icon={<Icons.Globe />} label="Countries" value="30+" />
            <StatCard icon={<Icons.Users />} label="Students" value="15K+" />
            <StatCard
              icon={<Icons.Award />}
              label="Scholarships"
              value="5.2K+"
            />
          </motion.div>

          {/* Values Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <ValueCard
              index={0}
              icon={<Icons.Target />}
              title="Our Values"
              description="Integrity, excellence, and student-first approach guide every decision we make, ensuring transparent and reliable services."
            />
            <ValueCard
              index={1}
              icon={<Icons.Award />}
              title="Our Vision"
              description="To become the most trusted educational consulting partner, transforming the academic futures of thousands of students across the nation."
            />
            <ValueCard
              index={2}
              icon={<Icons.Heart />}
              title="Our Mission"
              description="To bridge the gap between talented students and world-class educational institutions through expert guidance and personalized consulting."
            />
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center gap-3"
          >
            <FeatureChip
              index={0}
              text="Expert Guidance"
              icon={<Icons.Compass />}
            />
            <FeatureChip
              index={1}
              text="Personalized Consulting"
              icon={<Icons.Users />}
            />
            <FeatureChip
              index={2}
              text="Scholarship Discovery"
              icon={<Icons.Globe />}
            />
            <FeatureChip
              index={3}
              text="Application Support"
              icon={<Icons.Check />}
            />
            <FeatureChip
              index={4}
              text="Visa Assistance"
              icon={<Icons.Lightning />}
            />
            <FeatureChip
              index={5}
              text="24/7 Support"
              icon={<Icons.Sparkles />}
            />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 text-center"
          ></motion.div>
        </div>

        {/* Digital Borders */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#6ABAE1]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#6ABAE1]/50 to-transparent" />
      </section>
    </>
  );
}
