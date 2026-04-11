import React from 'react';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '', children }) => {
  const s = (status || '').toLowerCase();

  const getStatusStyles = () => {
    // Green
    if (['successful', 'complete', 'paid', 'confirmed', 'delivered', 'approved'].includes(s)) {
      return 'bg-green-100 text-green-700';
    }
    // Red
    if (['rejected', 'cancelled', 'reject', 'failed'].includes(s)) {
      return 'bg-red-100 text-red-700';
    }
    // Yellow
    if (['pending', 'awaiting', 'processing'].includes(s)) {
      return 'bg-yellow-100 text-yellow-700';
    }
    // Blue
    if (['shipped', 'shaping', 'dispatched'].includes(s)) {
      return 'bg-blue-100 text-blue-700';
    }
    // Default Blue
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {label && (
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">
          {label}
        </span>
      )}
      <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-tighter flex items-center gap-1 w-fit ${getStatusStyles()}`}>
        {children}
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;
