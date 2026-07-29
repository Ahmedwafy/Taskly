// src → app → components → pages → NewEmptyState.tsx
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
  //
  rocketIcon: React.ElementType;
  drawingCompassIcon: React.ElementType;
  squaresIcon: React.ElementType;
  plusIcon: React.ElementType;
}

const EpicsEmptyState = ({
  imageSrc,
  title,
  description,
  buttonText,
  buttonHref,
  buttonIcon,
  features,
  rocketIcon,
  drawingCompassIcon,
  squaresIcon,
  plusIcon,
}: EmptyStateProps) => {
  const RocketIcon = rocketIcon;
  const DrawingCompassIcon = drawingCompassIcon;
  const SquaresIcon = squaresIcon;
  const PlusIcon = plusIcon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto">
      {/* ○ ○ ○ Central Illustrative Graphic ○ ○ ○ */}
      <div className="mb-6 drop-shadow-sm">
        {rocketIcon && drawingCompassIcon && squaresIcon && plusIcon ? (
          <div className="flex gap-4 bg-white p-4 rounded-2xl w-56 h-56 justify-center items-center">
            <div className="flex flex-col gap-4">
              <div className="bg-[#0052CC33] h-16 w-16 rounded-xl flex items-center justify-center">
                <RocketIcon className="h-6 w-6" />
              </div>
              <div className="bg-[#D7E2FF] h-16 w-16 rounded-xl flex items-center justify-center">
                <SquaresIcon className="h-6 w-6 text-[#737685]" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-[#D7E2FF] h-16 w-16 rounded-xl flex items-center justify-center">
                <DrawingCompassIcon className="h-6 w-6 text-[#737685]" />
              </div>
              <div className="bg-[#003D9B0D] h-16 w-16 rounded-xl flex items-center justify-center border border-dashed border-[#003D9B33]">
                <PlusIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ) : (
          <Image src={imageSrc} alt={title} width={240} height={240} priority />
        )}
      </div>

      {/* ○ ○ ○  Primary Message ○ ○ ○  */}
      <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-500 text-sm max-w-md text-center mb-8 leading-relaxed">
        {description}
      </p>

      {/* ○ ○ ○  Call to Action Button ○ ○ ○  */}
      <Link
        href={buttonHref}
        className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-(--primary) to-(--primary-container)
         text-white font-bold text-[18px] px-6 py-3 rounded-lg shadow-md transition-colors mb-16 text-sm h-15 w-[252.5px]"
      >
        {buttonIcon}
        {buttonText}
      </Link>

      {/* ○ ○ ○  Secondary Feature Highlights Grid ○ ○ ○  */}
      {features && features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#F1F3FF] border border-slate-50 p-6 rounded-2xl flex flex-col items-start text-left w-52 h-[180.5px]"
            >
              <div className="p-2.5 bg-white rounded-md shadow-sm text-blue-600 mb-4">
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
