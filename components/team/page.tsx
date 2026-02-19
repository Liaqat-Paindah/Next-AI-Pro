"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";
import Image from "next/image";

// Refined Icons with Nexus aesthetic
const Icons = {
  Linkedin: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  Mail: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    </svg>
  ),
  Globe: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Award: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="8" r="7" />
      <polygon points="12 2 14 7 19 7 15 11 17 16 12 13 7 16 9 11 5 7 10 7 12 2" />
    </svg>
  ),
  Users: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Sparkles: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5" />
    </svg>
  ),
  Quote: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M10 11h-4v4h4v-4z" />
      <path d="M18 11h-4v4h4v-4z" />
      <path d="M14 7v4M6 7v4" />
    </svg>
  ),
  ChevronRight: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    ></svg>
  ),
  ChevronDown: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    ></svg>
  ),
  Circle: ({ className = "w-1.5 h-1.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="6" />
    </svg>
  ),
  X: ({ className = "w-3.5 h-3.5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// Digital Cursor Component
const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 30, stiffness: 600 };
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
      className="pointer-events-none fixed z-50 h-6 w-6 rounded-sm border border-[#00A3FF]/30 hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

// Team Member Card Component - Advanced Nexus Design
const TeamMemberCard = ({
  name,
  role,
  bio,
  social,
  imageUrl,
  index,
}: {
  name: string;
  role: string;
  bio: string;
  social: { linkedin?: string; twitter?: string; email?: string };
  imageUrl: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Advanced border effect */}
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/20 to-[#7000FF]/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/10 to-[#7000FF]/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white dark:bg-[#011d2e] border border-gray-200 dark:border-[#064e78] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image Section - Nexus Style */}
        <div className="relative h-48 overflow-hidden">
          {/* linear Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10" />

          {/* Digital Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-linear(45deg,rgba(0,163,255,0.1)_1px,transparent_1px),linear-linear(-45deg,rgba(112,0,255,0.1)_1px,transparent_1px)] bg-size-20px_20px z-20 mix-blend-overlay" />

          {/* Image */}
          <div className="relative w-full h-full">
            {imageUrl && !imageError ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
                priority={index < 3}
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-[#00A3FF]/20 to-[#7000FF]/20 flex items-center justify-center">
                <span className="text-4xl font-light text-[#00A3FF] dark:text-[#00A3FF]">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            )}
          </div>

   
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name and Role */}
          <div className="mb-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 font-mono">
                  {name}
                </h3>
                <p className="text-xs text-[#00A3FF] dark:text-[#00A3FF] font-mono">
                  {role}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
            {bio}
          </p>



          {/* Social Links */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-[#064e78]">
            {social.linkedin && (
              <motion.a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-1.5 rounded-sm bg-gray-100 dark:bg-[#012d46] text-gray-600 dark:text-gray-400 hover:text-[#00A3FF] dark:hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 transition-all"
              >
                <Icons.Linkedin className="w-3.5 h-3.5" />
              </motion.a>
            )}
            {social.twitter && (
              <motion.a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-1.5 rounded-sm bg-gray-100 dark:bg-[#012d46] text-gray-600 dark:text-gray-400 hover:text-[#00A3FF] dark:hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 transition-all"
              >
                <Icons.Twitter className="w-3.5 h-3.5" />
              </motion.a>
            )}
            {social.email && (
              <motion.a
                href={`mailto:${social.email}`}
                whileHover={{ scale: 1.1 }}
                className="p-1.5 rounded-sm bg-gray-100 dark:bg-[#012d46] text-gray-600 dark:text-gray-400 hover:text-[#00A3FF] dark:hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 transition-all"
              >
                <Icons.Mail className="w-3.5 h-3.5" />
              </motion.a>
            )}

            {/* Digital Signature */}
            <div className="ml-auto flex items-center gap-1">
              <span className="w-1 h-1 bg-[#00A3FF] rounded-sm" />
              <span className="w-1 h-1 bg-[#7000FF] rounded-sm" />
              <span className="w-1 h-1 bg-[#00A3FF] rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stat Card - Advanced
const StatCard = ({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-r from-[#00A3FF]/0 via-[#00A3FF]/10 to-[#7000FF]/0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" />

      <div className="relative bg-white dark:bg-[#011d2e] border border-gray-200 dark:border-[#064e78] rounded-sm p-3 text-center">
        <div className="text-xl font-bold text-[#00A3FF] dark:text-[#00A3FF] font-mono">
          {value}
        </div>
        <div className="text-[10px] text-gray-500 dark:text-gray-500 font-mono tracking-wider">
          {label}
        </div>

        {/* Digital Glitch Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-[#00A3FF]/5 to-transparent rounded-sm"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
};


export default function AyandahaDigitalTeam() {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 + custom * 0.05,
        duration: 0.4,
      },
    }),
  };

  // Team members data with high-quality image URLs
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Former admissions director at Stanford. 15+ years in international education strategy and policy development.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "alex.chen@ayandaha.com",
      },
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "Fatima Ahmadi",
      role: "Scholarship Director",
      bio: "Ex-Fulbright program director. Expert in identifying and securing funding for international students.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "fatima.ahmadi@ayandaha.com",
      },
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "Bashir Yousofi",
      role: "Technology Director",
      bio: "Former Google ed-tech lead. Architect of our digital platform and AI-driven application assistant.",
      social: {
        linkedin: "#",
        email: "bashir.yousofi@ayandaha.com",
      },
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "Shabana Hamdard",
      role: "Student Success Lead",
      bio: "Specializes in academic adaptation, cultural integration, and student wellness programs.",
      social: {
        linkedin: "#",
        email: "shabana.hamdard@ayandaha.com",
      },
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "David Kim",
      role: "Partnerships Director",
      bio: "Built and maintains relationships with 200+ universities across 30 countries.",
      social: {
        linkedin: "#",
        email: "david.kim@ayandaha.com",
      },
      imageUrl:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces",
    },
    {
      name: "Lisa Ghiran",
      role: "Immigration Head",
      bio: "Visa expert with 15+ years experience. 99% success rate on student visa applications.",
      social: {
        linkedin: "#",
        email: "lisa.wong@ayandaha.com",
      },
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces",
    },
  ];

  const stats = [
    { value: "50+", label: "TEAM MEMBERS" },
    { value: "30", label: "COUNTRIES" },
    { value: "15K+", label: "STUDENTS" },
  ];

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden bg-gray-50 dark:bg-transparent">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top_right,rgba(0,163,255,0.05),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-linear(ellipse_at_bottom_left,rgba(112,0,255,0.05),transparent_50%)]" />

          {/* Digital Grid - Subtle */}
          <div className="absolute inset-0 bg-[linear-linear(rgba(0,163,255,0.03)_1px,transparent_1px),linear-linear(90deg,rgba(112,0,255,0.03)_1px,transparent_1px)] bg-size-40px_40px" />

          {/* Animated Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.line
              x1="0"
              y1="20%"
              x2="100%"
              y2="20%"
              stroke="rgba(0,163,255,0.05)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.line
              x1="0"
              y1="80%"
              x2="100%"
              y2="80%"
              stroke="rgba(112,0,255,0.05)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 py-8 md:py-16">
          {/* Enhanced Header Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-8 md:mb-12"
          >
            <motion.h1
              custom={1}
              variants={textVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-mono leading-tight"
            >
              Digital{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00A3FF] to-[#7000FF]">
                  Architects
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={textVariants}
              className="text-sm  text-justify text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed"
            >
              Our team of dedicated professionals is committed to transforming
              educational journeys through innovation, personalized guidance,
              and advanced technological solutions. With deep expertise and a
              forward-thinking approach, we design strategic pathways that
              empower students and institutions to achieve sustainable success
              in an evolving academic landscape.
            </motion.p>

            {/* Digital Pulse Dots */}
            <motion.div
              custom={3}
              variants={textVariants}
              className="flex justify-center gap-1 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-sm bg-[#00A3FF]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 md:mb-12"
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                value={stat.value}
                label={stat.label}
                index={index}
              />
            ))}
          </motion.div>

          {/* Team Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                social={member.social}
                imageUrl={member.imageUrl}
                index={index}
              />
            ))}
          </motion.div>

          {/* Bottom Decorative Element */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10 md:mt-12"
          >
            <div className="flex items-center gap-2">
              <div className="w-12 h-px bg-linear-to-r from-transparent to-[#00A3FF]" />
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-[#00A3FF] rotate-45" />
                <div className="w-1 h-1 bg-[#7000FF] rotate-45" />
                <div className="w-1 h-1 bg-[#00A3FF] rotate-45" />
              </div>
              <div className="w-12 h-px bg-linear-to-l from-transparent to-[#7000FF]" />
            </div>
          </motion.div>
        </div>

        {/* Digital Borders */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#00A3FF]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#7000FF]/30 to-transparent" />
      </section>
    </>
  );
}
