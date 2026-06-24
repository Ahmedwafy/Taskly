// src → app → components → molecules → DesktopPagination.tsx
// dual-personality reusable component [ Link Mode - Callback Mode ]
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import React from 'react';
import * as icons from '@/../public/icons/icons'; // Make sure this path is correct

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
  // If there's only 1 page, we don't need to render pagination controls
  if (totalPages <= 1) return null;

  // Define icons here
  const previousIcon = (
    <Image
      src={icons.Arrow}
      alt="Previous"
      width={16}
      height={16}
      // className="rotate-180" // Rotates the arrow to face left
    />
  );
  const nextIcon = (
    <Image
      src={icons.Arrow}
      alt="Next"
      width={16}
      height={16}
      className="rotate-180"
    />
  );

  // Update helper signature to accept React.ReactNode for the label
  const renderPaginationItem = (
    pageNumber: number,
    label: React.ReactNode, // Can be a string, number, or JSX element "Anything that React can render on the screen."
    isDisabled: boolean,
    isCurrent: boolean,
  ) => {
    // Dynamic Tailwind Classes
    const baseClasses = `px-4 py-2 border rounded transition-colors flex items-center justify-center`;
    const stateClasses = isCurrent
      ? 'bg-primary text-white'
      : isDisabled
        ? 'pointer-events-none opacity-50'
        : 'hover:bg-gray-100';

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
    // If onPageChange doesn't exist, it falls back to a Next.js <Link>.
    // It automatically appends ?page=X to whatever base path you provided (like: /projects).
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
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button using the left-pointing arrow icon */}
      {/* creates a temporary array based on the total number of pages (e.g., [1, 2, 3]). */}
      {renderPaginationItem(
        currentPage - 1,
        previousIcon,
        currentPage === 1,
        false,
      )}

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) =>
          renderPaginationItem(
            pageNumber,
            pageNumber, // Standard number string/number label
            false,
            currentPage === pageNumber,
          ),
      )}

      {/* Next Button using the right-pointing arrow icon */}
      {/* Sets isDisabled to true if we have reached the last page (currentPage === totalPages). */}
      {renderPaginationItem(
        currentPage + 1,
        nextIcon,
        currentPage === totalPages,
        false,
      )}
    </div>
  );
};

export default DesktopPagination;
