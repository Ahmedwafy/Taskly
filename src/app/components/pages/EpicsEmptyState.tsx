// src/app/components/pages/NewEmptyState.tsx
'use client';

import Image, { StaticImageData } from 'next/image';
import React from 'react';
import Link from 'next/link';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface EmptyStateProps {
  imageSrc: StaticImageData;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  buttonIcon?: React.ReactNode;
  features?: FeatureCard[];
}

const EpicsEmptyState = ({
  imageSrc,
  title,
  description,
  buttonText,
  buttonHref,
  buttonIcon,
  features,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto">
      {/* Central Illustrative Graphic */}
      <div className="mb-6 drop-shadow-sm">
        <Image src={imageSrc} alt={title} width={240} height={240} priority />
      </div>

      {/* Primary Message */}
      <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-500 text-sm max-w-md text-center mb-8 leading-relaxed">
        {description}
      </p>

      {/* Call to Action Button */}
      <Link
        href={buttonHref}
        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors mb-16 text-sm"
      >
        {buttonIcon}
        {buttonText}
      </Link>

      {/* Secondary Feature Highlights Grid */}
      {features && features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#F8F9FF] border border-slate-50 p-6 rounded-2xl flex flex-col items-start text-left"
            >
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpicsEmptyState;
