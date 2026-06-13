// src/app/projects/error.tsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as images from '../../../../public/images/images';
import Button from '@/app/components/atoms/Button';

export default function Error({
  error,
  reset, // Will Call Api Again
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <Image src={images.Error} alt="Error occurred" width={160} height={140} />

      <h2 className="text-2xl font-semibold text-gray-800">
        Something went wrong
      </h2>

      <p className="text-gray-500 max-w-sm">
        We couldn’t load your projects. Please try again.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Try again
        </button>

        <Link href="/" className="px-4 py-2 border rounded-md text-gray-700">
          Go Home
        </Link>
        {/* reset >  will re-execute page.tsx in smae scope */}
        <Button onClick={() => reset()}>Retry</Button>
      </div>
    </div>
  );
}
