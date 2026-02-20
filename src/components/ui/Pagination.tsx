'use client';

import React from 'react';
import { Button } from './Button';

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

    const maxButtons = 5; // max numbered buttons to show (excluding Prev/Next)

    // For small page counts, show all pages directly
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const showLeftEllipsis = currentPage > 3;
    const showRightEllipsis = currentPage < totalPages - 2;

    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (!showLeftEllipsis) {
      startPage = 2;
      endPage = 4;
    } else if (!showRightEllipsis) {
      startPage = totalPages - 3;
      endPage = totalPages - 1;
    }

    if (startPage > 2) pages.push('...');

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) pages.push('...');

    pages.push(totalPages);

    return pages;
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
        className="min-w-[2.5rem]"
      >
        Prev
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
            className="w-9 px-0"
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
        className="min-w-[2.5rem]"
      >
        Next
      </Button>

    </div>
  );
};
