import React from 'react';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
  children,
}) => {
  const s = (status || '').toLowerCase();

  const getStatusStyles = () => {
    // Green
    if (['successful', 'complete', 'paid', 'confirmed', 'delivered', 'approved','approval'].includes(s)) {
      return 'text-green-700 bg-green-50 border-green-200';
    }
    // Red
    if (['rejected', 'cancelled', 'reject', 'failed'].includes(s)) {
      return 'text-rose-700 bg-rose-50 border-rose-200';
    }
    // Yellow
    if (['pending', 'awaiting', 'processing'].includes(s)) {
      return 'text-amber-700 bg-amber-50 border-amber-200';
    }
    // Blue
    if (['shipped', 'shaping', 'dispatched'].includes(s)) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    }

    // Default
    return 'text-gray-600 bg-gray-100 border-gray-200';
  };

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {label && (
        <span className="text-[10px] font-medium text-gray-400 leading-none">
          {label}
        </span>
      )}

      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium border leading-none whitespace-nowrap ${getStatusStyles()}`}
      >
        {children}
        {status}
      </span>
    </div>
  );
};

export default StatusBadge;