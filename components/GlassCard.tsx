import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`
        glass-material
        relative
        rounded-[1.25rem]
        shadow-[0_4px_24px_-1px_rgba(0,0,0,0.04)]
        transition-all duration-500 ease-ios transform-gpu
        ${hoverEffect ? 'hover:bg-white/80 active:scale-[0.99] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.06)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};