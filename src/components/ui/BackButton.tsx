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
    if (onClick) {
      onClick(e);
    }
    router.back();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn("flex items-center gap-2", className)}
      type="button"
      {...props}
    >
      <ArrowLeft size={18} />
      {label && <span>{label}</span>}
    </Button>
  );
};
