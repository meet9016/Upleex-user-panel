import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-primary text-white hover:opacity-90 shadow-md border border-transparent",
    
    secondary: "bg-[#0f172a] text-white hover:bg-slate-800 border border-transparent",
    
    outline: "border-2 border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1]/10",
    
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
