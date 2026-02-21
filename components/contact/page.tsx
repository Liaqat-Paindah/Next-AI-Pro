"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  Variants,
  AnimatePresence,
} from "framer-motion";

// Icons object remains the same
const Icons = {
  Mail: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Location: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Send: ({ className = "w-3 h-3" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
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
};

// Digital Cursor Component (unchanged)
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

// Contact Info Card Component - Smaller version
const ContactInfoCard = ({
  icon,
  title,
  content,
  link,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Digital Border Effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur" />

      {/* Card - Smaller padding */}
      <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 hover:dark:border-[#1c6fa5] dark:border-[#064e78] rounded-sm p-4 h-full shadow-sm dark:shadow-sm ">
        {/* Icon Container - Smaller */}
        <div className="relative mb-3">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-sm bg-linear-to-br  from-[#00A3FF]/10 to-[#7000FF]/10 dark:from-[#00A3FF]/20 dark:to-[#7000FF]/20 flex items-center justify-center border border-[#00A3FF]/30"
          >
            <div className="text-[#00A3FF] dark:text-[#00A3FF]">{icon}</div>
          </motion.div>

          {/* Digital Pulse */}
          <motion.div
            className="absolute rounded-sm "
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Smaller text */}
        <h3 className="text-sm font-bold text-gray-900  dark:text-white mb-1 o">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
          {content}
        </p>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

// Form Input Component - Smaller version
const FormInput = ({
  label,
  type,
  id,
  placeholder,
  required,
  textarea,
  value,
  onChange,
}: {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 o"
      >
        {label}
        {required && <span className="text-[#00A3FF] ml-1">*</span>}
      </label>

      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            rows={3}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors resize-none font-light"
          />
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#00A3FF] dark:focus:border-[#00A3FF] transition-colors font-light"
          />
        )}

        {/* Digital Underline Effect */}
        <motion.div
          className="absolute -bottom-px left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// Success Modal Component - Smaller version
const SuccessModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div
          className="absolute inset-0  backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-[#011b2b] rounded-sm p-6 max-w-md w-full border border-gray-200 dark:border-[#064e78] shadow-sm dark:shadow-sm "
        >
          {/* Digital Corner Markers */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00A3FF] dark:border-[#00A3FF]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00A3FF] dark:border-[#00A3FF]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00A3FF] dark:border-[#00A3FF]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00A3FF] dark:border-[#00A3FF]" />

          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
              className="w-16 h-16 rounded-full bg-linear-to-br from-[#00A3FF]/20 to-[#7000FF]/20 flex items-center justify-center mx-auto mb-3 border border-[#00A3FF]/30"
            >
              <Icons.Check className="w-8 h-8 text-[#00A3FF]" />
            </motion.div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 o">
              Message Sent!
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-light">
              Thank you for reaching out. Our team will respond within 24 hours.
            </p>

            <button onClick={onClose} className="relative group w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 " />
              <div className="relative px-4 py-2 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm font-semibold text-sm">
                Close
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Contact Component - Smaller overall
export default function AyandahaDigitalContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <DigitalCursor />
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />

      <section className="relative w-full   overflow-hidden">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,163,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,255,0.03)_1px,transparent_1px)] bg-size-32px_32px dark:bg-[linear-gradient(rgba(0,163,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,255,0.05)_1px,transparent_1px)]" />

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-[#00A3FF]/10 dark:bg-[#00A3FF]/5 rounded-full "
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#7000FF]/10 dark:bg-[#7000FF]/5 rounded-full "
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

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-8 md:py-20">
          {/* Header - Smaller */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-3 md:mb-4"
          >
            <motion.h1
              custom={1}
              variants={textVariants}
              className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 o"
            >
              Let is Start Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00A3FF] to-[#7000FF]">
                 Journey
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={textVariants}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light"
            >
              Ready to transform your educational future? Our digital platform
              connects you with world-class opportunities.
            </motion.p>
          </motion.div>

          {/* Contact Info Grid - Smaller cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 md:mb-12"
          >
            <ContactInfoCard
              index={0}
              icon={<Icons.Mail className="w-5 h-5" />}
              title="EMAIL"
              content="info@ayandaha.com"
              link="mailto:info@ayandaha.com"
            />
            <ContactInfoCard
              index={1}
              icon={<Icons.Phone className="w-5 h-5" />}
              title="PHONE"
              content="+93(0) 700-000-000"
              link="tel:+93(0) 700-000-000"
            />
            <ContactInfoCard
              index={2}
              icon={<Icons.Location className="w-5 h-5" />}
              title="LOCATION"
              content="13th district Kabul, 10001"
            />
            <ContactInfoCard
              index={3}
              icon={<Icons.Clock className="w-5 h-5" />}
              title="HOURS"
              content="Saturday – Tuesday: 8:00 AM – 4:00 PM "
            />
          </motion.div>

          {/* Contact Form Section - Smaller form */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 md:mb-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-5 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormInput
                    label="FULL NAME"
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="EMAIL ADDRESS"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="SUBJECT"
                    type="text"
                    id="subject"
                    placeholder="What is this regarding?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="MESSAGE"
                    type="text"
                    id="message"
                    placeholder="Tell us about your goals..."
                    required
                    textarea
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group w-full"
                  >
                    <div className="absolute -inset-1 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm  " />
                    <div className="relative px-2 py-1.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] text-white rounded-sm  text-sm flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-sm"
                          />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Icons.Send className="w-3 h-3" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right Side - Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Map - Smaller */}
              <div className="relative group">
                <div className="absolute bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm" />
                <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-3 h-105 shadow-sm dark:shadow-sm ">
                  <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-sm flex items-center justify-center">
                    <div className="text-center w-full h-full">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13151.807474106014!2d69.08509987933664!3d34.50410447821333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16601fe78c12f%3A0x8c7bb3da0ac6dc2f!2z2K3Ys9uM2YYg2LLYp9iv2Ycg2KjYstmG2LMg2LPZhtiq2LE!5e0!3m2!1sen!2s!4v1771524744469!5m2!1sen!2s"
                        className="w-full h-full rounded-sm"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                      <div className="flex justify-center gap-1 mt-1">
                        <div className="w-1 h-1 bg-[#00A3FF] rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-[#00A3FF] rounded-full animate-pulse delay-75" />
                        <div className="w-1 h-1 bg-[#00A3FF] rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
