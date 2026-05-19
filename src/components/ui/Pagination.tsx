'use client';

import React from 'react';
import { Button } from './Button';
import {  ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showWhenSingle?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showWhenSingle = false,
}) => {
  if (!showWhenSingle && totalPages <= 1) return null;

  // Helper to decide which page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // For small page counts, show all pages directly
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const firstThree = [1, 2, 3];
    const lastThree = [totalPages - 2, totalPages - 1, totalPages];

    const isNearStart = currentPage <= 3;
    const isNearEnd = currentPage >= totalPages - 2;

    if (isNearStart) {
      pages.push(...firstThree);
      pages.push(4);
      pages.push('...');
      pages.push(...lastThree);
    } else if (isNearEnd) {
      pages.push(...firstThree);
      pages.push('...');
      pages.push(totalPages - 3);
      pages.push(...lastThree);
    } else {
      pages.push(...firstThree);
      
      if (currentPage - 1 > 4) {
        pages.push('...');
      } else if (currentPage - 1 === 4) {
        pages.push(4);
      }
      
      pages.push(currentPage);
      
      if (currentPage + 1 < totalPages - 3) {
        pages.push('...');
      } else if (currentPage + 1 === totalPages - 3) {
        pages.push(totalPages - 3);
      }
      
      pages.push(...lastThree);
    }

    return Array.from(new Set(pages));
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
      
      {/* Previous Button */}
     <Button
  variant="outline"
  size="sm"
  onClick={() => onPageChange(currentPage - 1)}
  disabled={currentPage === 1}
  className="min-w-[2.5rem] border-0"
>
<ChevronLeft />
</Button>

      {/* Page Numbers */}
      {pageNumbers.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-gray-500 text-sm"
            >
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
         <Button
  key={page}
  size="sm"
  variant={isActive ? 'primary' : 'ghost'}
  onClick={() => onPageChange(page as number)}
  className="w-9 px-0 border-0"
>
  {page}
</Button>
        );
      })}

      {/* Next Button */}
      <Button
  variant="outline"
  size="sm"
  onClick={() => onPageChange(currentPage + 1)}
  disabled={currentPage === totalPages}
  className="min-w-[2.5rem] border-0"
>
<ChevronRight />
</Button>

    </div>
  );
};
