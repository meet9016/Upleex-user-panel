'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const ProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] h-1 overflow-hidden bg-blue-100/30 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-upleex-purple to-upleex-blue shadow-[0_0_10px_rgba(14,165,233,0.5)] transition-all duration-500 ease-out"
        style={{ 
          width: loading ? '70%' : '100%',
          opacity: loading ? 1 : 0,
          transition: loading ? 'width 10s cubic-bezier(0.1, 0.05, 0.1, 1)' : 'width 0.3s ease-in-out, opacity 0.3s ease-in-out 0.2s'
        }}
      />
    </div>
  );
};

export default ProgressBar;
