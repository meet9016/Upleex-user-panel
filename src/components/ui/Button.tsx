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
    primary: "bg-gradient-to-r from-upleex-purple to-upleex-blue text-white hover:opacity-90 shadow-md border-transparent",
    secondary: "bg-upleex-dark text-white hover:bg-slate-800 border-transparent",
    outline: "border-2 border-upleex-purple text-upleex-purple hover:bg-upleex-purple/10",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg"
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
