import { ReactNode } from 'react';

// CSS-only transition shims. Same API as the old framer-motion versions,
// but no animation-library dependency and no per-frame JS cost during playback.

export const FadeTransition = ({ children, className = "", delay = 0 }: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <div
    className={`animate-in fade-in duration-300 ${className}`}
    style={delay ? { animationDelay: `${delay}s` } : undefined}
  >
    {children}
  </div>
);

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
  const slideClass = {
    up: 'slide-in-from-bottom-4',
    down: 'slide-in-from-top-4',
    left: 'slide-in-from-right-4',
    right: 'slide-in-from-left-4',
  }[direction];

  return (
    <div
      className={`animate-in fade-in ${slideClass} duration-300 ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

export const ScaleTransition = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
}) => (
  <div className={`transition-transform duration-150 hover:scale-105 active:scale-95 ${className}`}>
    {children}
  </div>
);

export const PanelTransition = ({
  children,
  isCollapsed,
  className = ""
}: {
  children: ReactNode;
  isCollapsed: boolean;
  className?: string;
}) => (
  <div className={`overflow-hidden transition-all duration-300 ${className}`}>
    {!isCollapsed && children}
  </div>
);

export const StaggerContainer = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) => (
  <div className={`animate-in fade-in duration-300 ${className}`}>
    {children}
  </div>
);

export const StaggerItem = ({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`animate-in fade-in slide-in-from-bottom-2 duration-300 ${className}`}>
    {children}
  </div>
);

export const FloatingPanelTransition = ({
  children,
  className = "",
  isDragging = false
}: {
  children: ReactNode;
  className?: string;
  isDragging?: boolean;
}) => (
  <div className={`transition-shadow duration-200 ${isDragging ? 'shadow-2xl' : 'shadow-lg'} ${className}`}>
    {children}
  </div>
);

export const ThemeTransition = ({
  children,
  className = "",
  brandSkin
}: {
  children: ReactNode;
  className?: string;
  brandSkin: string;
}) => (
  <div key={brandSkin} className={`animate-in fade-in duration-500 ${className}`}>
    {children}
  </div>
);

export const PulseTransition = ({
  children,
  className = "",
  isActive = false
}: {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
}) => (
  <div className={`${isActive ? 'animate-pulse' : ''} ${className}`}>
    {children}
  </div>
);

export const SkeletonTransition = ({
  width = "100%",
  height = "1rem",
  className = ""
}: {
  width?: string;
  height?: string;
  className?: string;
}) => (
  <div
    className={`animate-pulse bg-gray-300/60 rounded ${className}`}
    style={{ width, height }}
  />
);
