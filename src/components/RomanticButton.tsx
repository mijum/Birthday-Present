import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface RomanticButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'subtle';
  pulsing?: boolean;
}

export const RomanticButton: React.FC<RomanticButtonProps> = ({
  children,
  variant = 'primary',
  pulsing = true,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[52px] min-w-[180px] rounded-full font-sans text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap select-none cursor-pointer transition-all duration-300 touch-manipulation active:scale-[0.96] after:absolute after:-inset-2.5 after:content-[""] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e5b887] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b0c16]';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#94314e] via-[#b64b67] to-[#862540] text-[#fff6f4] shadow-[0_4px_20px_rgba(182,75,103,0.35)] border border-[#e5a4b4]/40 hover:shadow-[0_6px_28px_rgba(182,75,103,0.55)] hover:border-[#f5c7d2]/70',
    secondary:
      'bg-[#381624]/80 text-[#fdeef2] backdrop-blur-md border border-[#e2a8b8]/30 hover:bg-[#4a1c30] hover:border-[#f3c2ce]/60 shadow-[0_2px_12px_rgba(0,0,0,0.25)]',
    subtle:
      'bg-transparent text-[#e8b5c2] border border-[#e8b5c2]/25 hover:border-[#e8b5c2]/60 hover:text-white hover:bg-white/5',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={
        pulsing
          ? {
              boxShadow: [
                '0 4px 18px rgba(182,75,103,0.3)',
                '0 4px 28px rgba(229,184,135,0.45)',
                '0 4px 18px rgba(182,75,103,0.3)',
              ],
            }
          : undefined
      }
      transition={{
        boxShadow: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Delicate inner sheen */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/5 to-white/15 opacity-60"
        aria-hidden="true"
      />
    </motion.button>
  );
};
