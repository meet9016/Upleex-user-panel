'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils';

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  className, 
  label = "Back", 
  variant = "ghost",
  size = "md",
  onClick,
  ...props
}) => {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    router.back();
  };

  return (
  <Button
  variant={variant}
  size={size}
  onClick={handleBack}
  type="button"
  className={cn(
    "group flex items-center gap-2 px-5 py-2.5",
    "rounded-full",
    "bg-gray-200 text-gray-800",
    "shadow-sm border border-gray-300",
    "hover:bg-gray-300 hover:shadow-md",
    "active:scale-95 transition-all duration-200",
    className
  )}
  {...props}
>
  <ArrowLeft 
    size={18} 
    className="transition-transform duration-200 group-hover:-translate-x-1"
  />
  {label && <span className="font-medium">{label}</span>}
</Button>
  );
};