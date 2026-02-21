"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

// Icons component to match the Services pattern
const Icons = {
  Location: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Email: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Phone: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  ),
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Our Team", href: "/team" },
    { name: "Opportunities", href: "/opportunities" },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ];

  const contactInfo = [
    {
      icon: <Icons.Location className="w-4 h-4" />,
      label: "Office Address",
      value: "Kabul, Afghanistan",
      type: "text",
    },
    {
      icon: <Icons.Email className="w-4 h-4" />,
      label: "Email Us",
      value: "info@ayandaha.com",
      href: "mailto:info@ayandaha.com",
      type: "link",
    },
    {
      icon: <Icons.Phone className="w-4 h-4" />,
      label: "Call Us",
      value: "+93 700 000 000",
      href: "tel:+93700000000",
      type: "link",
    },
  ];

  return (
    <footer className="relative bg-white dark:bg-[#011b2b] border-t border-gray-200 dark:border-[#064e78] overflow-hidden">
      {/* Digital grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #00A3FF 1px, transparent 1px),
            linear-gradient(to bottom, #7000FF 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00A3FF]/5 dark:bg-[#00A3FF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7000FF]/5 dark:bg-[#7000FF]/5 rounded-full blur-3xl" />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-16 pb-12">
            {/* Brand Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-5"
            >
              <Link href="/" className="inline-block relative group">
                {/* Digital border effect on logo */}
                <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur" />
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Ayandaha Educational Consultancy"
                    className="w-auto h-10 dark:hidden"
                    width={160}
                    height={40}
                    priority
                  />
                  <Image
                    src="/logo-dark.png"
                    alt="Ayandaha Educational Consultancy"
                    className="w-auto h-10 hidden dark:block"
                    width={160}
                    height={40}
                    priority
                  />
                </div>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                Ayandaha Educational Consultancy Services Company empowers
                students to achieve their international education dreams through
                expert guidance and comprehensive scholarship support.
              </p>

 
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-5 relative inline-block">
                Quick Links
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#00A3FF] dark:hover:text-[#00A3FF] text-sm transition-colors duration-200"
                    >
                      <Icons.ArrowRight className={`w-3 h-3 transition-all duration-300 ${
                        hoveredLink === link.name ? 'translate-x-1 opacity-100' : 'opacity-0'
                      }`} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-5 relative inline-block">
                Support
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#7000FF] dark:hover:text-[#7000FF] text-sm transition-colors duration-200"
                    >
                      <Icons.ArrowRight className={`w-3 h-3 transition-all duration-300 ${
                        hoveredLink === link.name ? 'translate-x-1 opacity-100' : 'opacity-0'
                      }`} />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-5 relative inline-block">
                Contact Us
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </h3>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group relative"
                  >
                    {/* Digital border effect on hover */}
                    <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    
                    <div className="relative flex items-start gap-3 p-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-linear-to-br from-[#00A3FF]/10 to-[#7000FF]/10 border border-[#00A3FF]/30 text-[#00A3FF] dark:text-[#00A3FF] group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[#00A3FF] dark:text-[#00A3FF] text-xs font-medium">
                          {item.label}
                        </p>
                        {item.type === 'link' ? (
                          <a
                            href={item.href}
                            className="text-gray-900 dark:text-white text-sm hover:text-[#7000FF] dark:hover:text-[#7000FF] transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-900 dark:text-white text-sm">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Corner markers */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00A3FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar with digital style */}
          <motion.div
            variants={itemVariants}
            className="relative pt-6 pb-6 mt-4 border-t border-gray-200 dark:border-[#064e78]"
          >
            {/* Digital scan line */}
            <motion.div
              className="absolute top-0 left-0 h-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Copyright with digital style */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-[#00A3FF] to-[#7000FF] rounded-sm opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <p className="relative text-gray-600 dark:text-gray-400 text-xs text-center md:text-left px-3 py-1">
                  © {currentYear} Ayandaha Educational Consultancy. All rights reserved.
                </p>
              </div>

              {/* Legal Links with digital style */}
              <div className="flex items-center gap-6">
                {['Privacy', 'Terms', 'Cookies'].map((item, index) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}-policy`}
                    className="relative group text-xs"
                  >
                    <span className="relative z-10 text-gray-600 dark:text-gray-400 group-hover:text-transparent bg-clip-text group-hover:bg-linear-to-r group-hover:from-[#00A3FF] group-hover:to-[#7000FF] transition-all duration-300">
                      {item}
                    </span>
                    <motion.div
                      className="absolute bottom-0 left-0 h-px bg-linear-to-r from-[#00A3FF] to-[#7000FF]"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                ))}
              </div>

              {/* Digital version indicator */}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse" />
                <span className="text-[10px] text-gray-500 dark:text-gray-500 font-mono">
                  v.2.0.0
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;