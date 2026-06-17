import Link from 'next/link';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const DesktopPagination = ({ currentPage, totalPages }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Link
        href={`/projects?page=${currentPage - 1}`}
        className={`px-4 py-2 border rounded ${
          currentPage === 1 ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        Previous
      </Link>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <Link
            key={pageNumber}
            href={`/projects?page=${pageNumber}`}
            className={`px-4 py-2 border rounded ${
              currentPage === pageNumber ? 'bg-black text-white' : ''
            }`}
          >
            {pageNumber}
          </Link>
        ),
      )}

      <Link
        href={`/projects?page=${currentPage + 1}`}
        className={`px-4 py-2 border rounded ${
          currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        Next
      </Link>
    </div>
  );
};

export default DesktopPagination;
