import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fade in/out transition
export const FadeTransition = ({ children, className = "", delay = 0 }: { 
  children: ReactNode; 
  className?: string; 
  delay?: number; 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from direction
export const SlideTransition = ({ 
  children, 
  direction = 'up', 
  className = "", 
  delay = 0 
}: { 
  children: ReactNode; 
  direction?: 'up' | 'down' | 'left' | 'right'; 
  className?: string; 
  delay?: number; 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20 };
      case 'down': return { y: -20 };
      case 'left': return { x: 20 };
      case 'right': return { x: -20 };
      default: return { y: 20 };
    }
  };

  return (
    <motion.div
      initial={{ ...getInitialPosition(), opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ ...getInitialPosition(), opacity: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale animation for buttons and interactive elements
export const ScaleTransition = ({ 
  children, 
  className = "",
  hoverScale = 1.05,
  tapScale = 0.95 
}: { 
  children: ReactNode; 
  className?: string;
  hoverScale?: number;
  tapScale?: number;
}) => (
  <motion.div
    whileHover={{ scale: hoverScale }}
    whileTap={{ scale: tapScale }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Panel collapse/expand animation
export const PanelTransition = ({ 
  children, 
  isCollapsed, 
  className = "" 
}: { 
  children: ReactNode; 
  isCollapsed: boolean; 
  className?: string; 
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={isCollapsed ? 'collapsed' : 'expanded'}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
      style={{ overflow: 'hidden' }}
    >
      {!isCollapsed && children}
    </motion.div>
  </AnimatePresence>
);

// Stagger animation for lists/grids
export const StaggerContainer = ({ 
  children, 
  className = "",
  staggerDelay = 0.05 
}: { 
  children: ReactNode; 
  className?: string;
  staggerDelay?: number;
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string; 
}) => (
  <motion.div
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.4, ease: "easeOut" }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Floating panel animation
export const FloatingPanelTransition = ({ 
  children, 
  className = "",
  isDragging = false 
}: { 
  children: ReactNode; 
  className?: string;
  isDragging?: boolean;
}) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: -10 }}
    animate={{ 
      scale: isDragging ? 1.02 : 1, 
      opacity: 1, 
      y: 0,
      boxShadow: isDragging 
        ? "0 20px 40px rgba(0,0,0,0.3)" 
        : "0 10px 20px rgba(0,0,0,0.15)"
    }}
    exit={{ scale: 0.9, opacity: 0, y: -10 }}
    transition={{ 
      duration: 0.3, 
      ease: "easeOut",
      boxShadow: { duration: 0.2 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Theme transition wrapper
export const ThemeTransition = ({ 
  children, 
  className = "",
  brandSkin 
}: { 
  children: ReactNode; 
  className?: string;
  brandSkin: string;
}) => (
  <motion.div
    key={brandSkin}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulse animation for active states
export const PulseTransition = ({ 
  children, 
  className = "",
  isActive = false 
}: { 
  children: ReactNode; 
  className?: string;
  isActive?: boolean;
}) => (
  <motion.div
    animate={isActive ? {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1]
    } : {}}
    transition={{
      duration: 1.5,
      repeat: isActive ? Infinity : 0,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Loading skeleton animation
export const SkeletonTransition = ({ 
  width = "100%", 
  height = "1rem", 
  className = "" 
}: { 
  width?: string; 
  height?: string; 
  className?: string; 
}) => (
  <motion.div
    className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${className}`}
    style={{ width, height }}
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);