'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, Variants } from 'framer-motion';

// Types
interface Slide {
  id: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
  ctaUrl: string;
  ctaText: string;
  tag?: string;
  metrics?: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];
  features?: string[];
  color: string;
}

interface CarouselProps {
  slides?: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  infinite?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

// Custom icons for digital feel
const Icons = {
  Globe: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Users: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Award: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7"/>
      <polygon points="12 2 14 7 19 7 15 11 17 16 12 13 7 16 9 11 5 7 10 7 12 2"/>
    </svg>
  ),
  Lightning: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"/>
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v18M3 12h18M5 5l14 14M5 19L19 5"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// Digital Carousel slides in English
const digitalSlides: Slide[] = [
  {
    id: 'slide-1',
    imgSrc: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
    imgAlt: 'Modern digital education platform interface with holographic elements',
    title: 'Your Academic Future Starts Here',
    description: 'Smart platform for university applications and scholarships, with precision guidance and full support.',
    ctaUrl: '#',
    ctaText: 'Get Started',
    color: '#3b82f6',
    metrics: [
      { icon: <Icons.Globe />, label: 'Countries', value: '30+' },
      { icon: <Icons.Users />, label: 'Students', value: '15K+' },
      { icon: <Icons.Award />, label: 'Scholarships', value: '5.2K+' },
    ],
    features: ['Smart Profile', 'Auto Matching', '24/7 Support'],
  },
  {
    id: 'slide-2',
    imgSrc: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    imgAlt: 'Digital transformation in education with futuristic interface',
    title: 'From Zero to Admission',
    description: 'Smart system guides you through every step, from university selection to visa application.',
    ctaUrl: '#',
    ctaText: 'Apply Now',
    color: '#8b5cf6',
    metrics: [
      { icon: <Icons.Globe />, label: 'Universities', value: '450+' },
      { icon: <Icons.Users />, label: 'Acceptances', value: '8.7K+' },
      { icon: <Icons.Lightning />, label: 'Visa Rate', value: '92%' },
    ],
    features: ['AI Advisor', 'Document Upload', 'Real-time Tracking'],
  },
  {
    id: 'slide-3',
    imgSrc: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
    imgAlt: 'Digital dashboard showing scholarship opportunities',
    title: 'Exclusive Scholarships',
    description: 'Search through 5000+ active scholarships with smart filters and find your perfect match.',
    ctaUrl: '#',
    ctaText: 'Search Now',
    color: '#ec4899',
    metrics: [
      { icon: <Icons.Award />, label: 'Full Fund', value: '2.1K+' },
      { icon: <Icons.Globe />, label: 'Europe', value: '1.8K+' },
      { icon: <Icons.Lightning />, label: 'USA', value: '1.4K+' },
    ],
    features: ['Advanced Filters', 'Notifications', 'Smart Compare'],
  },
];

// Digital Cursor Effect Component
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
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
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

// Digital Navigation Button
const DigitalNavButton = ({ 
  direction, 
  onClick 
}: { 
  direction: 'previous' | 'next'; 
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      type="button"
      className={`
        absolute ${direction === 'previous' ? 'left-4' : 'right-4'} 
        top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center
        rounded-sm bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10
        text-white shadow-[0_8px_32px_rgba(0,0,0,0.2)]
        transition-all hover:bg-white/20 dark:hover:bg-white/30 hover:border-white/40
        focus:outline-none focus:ring-2 focus:ring-[#6ABAE1] focus:ring-offset-2
        md:h-10 md:w-10
      `}
      aria-label={`${direction} slide`}
      onClick={onClick}
    >
      <motion.div
        animate={{ x: isHovered ? (direction === 'previous' ? -2 : 2) : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-4 w-4 md:h-5 md:w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={direction === 'previous' 
              ? 'M15.75 19.5L8.25 12l7.5-7.5' 
              : 'M8.25 4.5l7.5 7.5-7.5 7.5'
            }
          />
        </svg>
      </motion.div>
    </motion.button>
  );
};

// Digital Indicator
const DigitalIndicator = ({ 
  total, 
  current, 
  onSelect 
}: { 
  total: number; 
  current: number; 
  onSelect: (index: number) => void;
}) => (
  <div 
    className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2"
    role="group"
    aria-label="Slide navigation"
  >
    {Array.from({ length: total }).map((_, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="group relative"
        onClick={() => onSelect(index)}
      >
        <div className={`
          h-1.5 rounded-sm transition-all duration-300
          ${current === index 
            ? 'w-8 bg-white dark:bg-blue-400' 
            : 'w-1.5 bg-white/40 dark:bg-white/30 group-hover:bg-white/60 dark:group-hover:bg-white/50'
          }
        `} />
        {current === index && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-400"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    ))}
  </div>
);

// Feature Chip Component
const FeatureChip = ({ text, index }: { text: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex items-center gap-1.5 rounded-sm bg-white/10 dark:bg-black/30 backdrop-blur-sm px-3 py-1.5 border border-white/20 dark:border-white/10"
    >
      <motion.div
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icons.Check />
      </motion.div>
      <span className="text-xs text-white/90 dark:text-white/90">{text}</span>
    </motion.div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  icon, 
  label, 
  value 
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
      className="flex items-center gap-2 rounded-sm bg-white/10 dark:bg-black/30 backdrop-blur-sm px-3 py-1.5 border border-white/20 dark:border-white/10"
    >
      <motion.div
        animate={{ 
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="text-blue-300 dark:text-blue-400"
      >
        {icon}
      </motion.div>
      <div className="flex items-baseline gap-1">
        <span className="text-xs font-bold text-white dark:text-white">{value}</span>
        <span className="text-[10px] text-white/70 dark:text-white/70">{label}</span>
      </div>
    </motion.div>
  );
};

// Main Carousel Component
export default function AyandahaDigitalCarousel({ 
  slides = digitalSlides,
  autoPlay = true,
  autoPlayInterval = 6000,
  infinite = true,
  showControls = true,
  showIndicators = true,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Fixed here

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (currentIndex === slides.length - 1) {
      if (infinite) goToSlide(0);
    } else {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, slides.length, infinite, goToSlide]);

  const previousSlide = useCallback(() => {
    if (currentIndex === 0) {
      if (infinite) goToSlide(slides.length - 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, slides.length, infinite, goToSlide]);

  // Auto-play with pause on hover
  useEffect(() => {
    if (isAutoPlaying) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, autoPlayInterval, nextSlide]);
  // Fixed variants with proper typing
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  // Fixed text variants with proper typing
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + custom * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      <DigitalCursor />
      <div 
        className={`relative w-full overflow-hidden bg-black dark:bg-gray-900 ${className}`}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(autoPlay)}
        aria-roledescription="carousel"
        aria-label="Digital Education Platform"
      >
        {/* Slides Container - Reduced height */}
        <div className="relative h-115 w-full md:h-125 lg:h-135">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {/* Background Image with Digital Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={slides[currentIndex].imgSrc}
                  alt={slides[currentIndex].imgAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  quality={90}
                />
                
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                
                {/* Digital Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-linear(rgba(255,255,255,0.02)_1px,transparent_1px),linear-linear(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[32px_32px]" />
                
                {/* Holographic Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-pulse" />
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
                    custom={0}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl text-left mx-auto"
                  >
                    {/* Digital Tag */}
                    <motion.div
                      custom={1}
                      variants={textVariants}
                      className="flex items-center gap-2 mb-3"
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
                      >
                        <Icons.Sparkles />
                      </motion.div>
                      <span className="text-xs font-mono text-blue-400 dark:text-blue-400">
                        {slides[currentIndex].tag}
                      </span>
                    </motion.div>
                    
                    {/* Title */}
                    <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl font-display leading-tight">
                      {slides[currentIndex].title}
                    </h2>
                    
                    {/* Description */}
                    <p className="mb-3 text-sm text-white/90 sm:text-base max-w-xl font-light">
                      {slides[currentIndex].description}
                    </p>
                    
                    {/* Metrics Row */}
                    <motion.div
                      custom={2}
                      variants={textVariants}
                      className="flex flex-wrap gap-2 mb-3"
                    >
                      {slides[currentIndex].metrics?.map((metric, idx) => (
                        <MetricCard key={idx} {...metric} />
                      ))}
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      custom={3}
                      variants={textVariants}
                      className="flex flex-wrap gap-2 mb-4"
                    >
                      {slides[currentIndex].features?.map((feature, idx) => (
                        <FeatureChip key={idx} text={feature} index={idx} />
                      ))}
                    </motion.div>
                    
                    {/* CTA Button */}
                    <motion.a
                      custom={4}
                      variants={textVariants}
                      href={slides[currentIndex].ctaUrl}
                      className="
                        inline-flex items-center justify-center gap-2
                        rounded-sm bg-[#6ABAE1] px-5 py-2.5 text-sm font-medium text-white
                        shadow-[0_0_20px_rgba(59,130,246,0.5)]
                        transition-all hover:bg-[#6ABAE1] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]
                        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                        dark:bg-[#6ABAE1] dark:hover:bg-[#6ABAE1]
                      "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{slides[currentIndex].ctaText}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </motion.a>

                    {/* Digital Pulse Effect */}
                    <motion.div
                      className="absolute -bottom-10 left-0 w-32 h-32 bg-[#6ABAE1]/10 rounded-sm blur-3xl"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Digital Borders */}
              <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#6ABAE1]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#6ABAE1]/50 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {showControls && (
          <>
            <DigitalNavButton direction="previous" onClick={previousSlide} />
            <DigitalNavButton direction="next" onClick={nextSlide} />
          </>
        )}

        {/* Digital Indicators */}
        {showIndicators && (
          <DigitalIndicator 
            total={slides.length}
            current={currentIndex}
            onSelect={goToSlide}
          />
        )}

        {/* Digital Progress Bar */}
        {autoPlay && (
          <motion.div
            key={currentIndex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              duration: autoPlayInterval / 1000,
              ease: "linear",
            }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#6ABAE1] via-purple-600 to-pink-600 origin-left"
            style={{ transformOrigin: '0% 50%' }}
          />
        )}
      </div>
    </>
  );
}

// Export types
export type { Slide, CarouselProps };