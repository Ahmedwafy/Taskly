// src → app → components → molecules → DesktopPagination.tsx
// dual-personality reusable component [ Link Mode - Callback Mode ]
import Link from 'next/link';
import React from 'react';
import Previous from '@/../public/svgIcons/Previous.svg';
import Next from '@/../public/svgIcons/Next.svg';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  onPageChange?: (page: number) => void;
}

const DesktopPagination = ({
  currentPage,
  totalPages,
  baseUrl,
  onPageChange,
}: PaginationProps) => {
  // If there's only 1 page, don't need to render pagination controls
  if (totalPages <= 1) return null;

  const renderPaginationItem = (
    pageNumber: number,
    label: React.ReactNode,
    isDisabled: boolean,
    isCurrent: boolean,
  ) => {
    // w-11 h-11 gives it that perfect square layout from your image
    const baseClasses = `w-11 h-11 border flex items-center justify-center font-semibold text-base transition-colors rounded-md`;

    // Custom hex code matches for the deep blue active state and soft border/text colors
    const stateClasses = isCurrent
      ? 'bg-[#0642A6] text-white border-[#0642A6]'
      : isDisabled
        ? 'pointer-events-none opacity-40 border-[#E4E7EC] text-[#344054]'
        : 'bg-[#F9FAFB] border-[#E4E7EC] text-[#344054] hover:bg-gray-100';

    const fullClassName = `${baseClasses} ${stateClasses}`;

    // Condition 1: Use custom click event if callback (onPageChange) is provided
    if (onPageChange) {
      return (
        <button
          key={`page-${pageNumber}`}
          onClick={() => !isDisabled && onPageChange(pageNumber)}
          disabled={isDisabled}
          className={fullClassName}
        >
          {label}
        </button>
      );
    }

    // Condition 2: Fallback to Next.js Links (Requires baseUrl)
    const href = baseUrl ? `${baseUrl}?page=${pageNumber}` : '#';

    return (
      <Link
        key={`page-${pageNumber}`}
        href={href}
        className={fullClassName}
        aria-disabled={isDisabled}
      >
        {label}
      </Link>
    );
  };

  return (
    // Clean, centered layout without the amber background
    <div className="flex items-center justify-center gap-2.5 py-6">
      {/* Previous Button */}
      {renderPaginationItem(
        currentPage - 1,
        <Previous className="w-4 h-4 text-[#344054]" />,
        currentPage === 1,
        false,
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) =>
          renderPaginationItem(
            pageNumber,
            pageNumber,
            false,
            currentPage === pageNumber,
          ),
      )}

      {/* Next Button */}
      {renderPaginationItem(
        currentPage + 1,
        <Next className="w-4 h-4 text-[#344054]" />,
        currentPage === totalPages,
        false,
      )}
    </div>
  );
};

export default DesktopPagination;
