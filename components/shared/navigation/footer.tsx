"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
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

  return (
    <footer className="relative   border-t border-gray-100 dark:border-gray-800/50">
      {/* Simple background - no gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 dark:bg-gray-900/30 rounded-sm blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-50 dark:bg-gray-900/30 rounded-sm blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Main Footer Content - Reduced spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-12 pb-8">
            {/* Brand Section */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-4"
            >
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Ayandaha Educational Consultancy"
                  className="w-auto h-9 dark:hidden"
                  width={140}
                  height={36}
                  priority
                />
                <Image
                  src="/logo-dark.png"
                  alt="Ayandaha Educational Consultancy"
                  className="w-auto h-9 hidden dark:block"
                  width={140}
                  height={36}
                  priority
                />
              </Link>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
                Ayandaha Educational Consultancy Services Company empowers
                students to achieve their international education dreams through
                expert guidance and comprehensive scholarship support.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Contact Us
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary dark:text-primary text-xs">
                      Office Address
                    </p>
                    <p className="text-gray-900 dark:text-white text-sm">
                      Kabul, Afghanistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary dark:text-primary text-xs">
                      Email Us
                    </p>
                    <a
                      href="mailto:info@ayandaha.com"
                      className="text-gray-900 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      info@ayandaha.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary dark:text-primary text-xs">
                      Call Us
                    </p>
                    <a
                      href="tel:+93700000000"
                      className="text-gray-900 dark:text-white text-sm hover:text-primary dark:hover:text-primary transition-colors duration-200"
                    >
                      +93 700 000 000
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar - Clean and simple */}
          <motion.div
            variants={itemVariants}
            className="pt-5 mt-2 border-t border-gray-100 dark:border-gray-800"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              {/* Copyright */}
              <p className="text-primary dark:text-primary text-xs text-center md:text-left">
                © {currentYear} Ayandaha Educational Consultancy Services
                Company. All rights reserved.
              </p>

              {/* Legal Links - No bullets */}
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy-policy"
                  className="text-primary dark:text-primary hover:text-primary dark:hover:text-primary text-xs transition-colors duration-200"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="text-primary dark:text-primary hover:text-primary dark:hover:text-primary text-xs transition-colors duration-200"
                >
                  Terms
                </Link>
                <Link
                  href="/cookies-policy"
                  className="text-primary dark:text-primary hover:text-primary dark:hover:text-primary text-xs transition-colors duration-200"
                >
                  Cookies
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
