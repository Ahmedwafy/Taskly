// src → app → components → pages → EmptyState.tsx

import Image from 'next/image';
import React from 'react';
import Button from '../atoms/Button';
import Link from 'next/link';
import * as images from '../../../../public/images/images';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
      <Image
        src={images.Empty_State}
        alt="No projects found"
        width={280}
        height={280}
        className="opacity-80"
        priority
      />

      <div className="flex flex-col gap-2">
        <h2 className="headline-lg text-gray-700">
          You don&apos;t have any projects yet.
        </h2>

        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Start by creating your first one.
        </p>
      </div>

      <Link href="/projects/add">
        <Button name="+ Create a Project" className="w-52!" />
      </Link>
    </div>
  );
};

export default EmptyState;
