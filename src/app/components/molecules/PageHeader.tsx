// src → app → components → molecules → PageHeader.tsxs
'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '../atoms/Button';
import { StaticImageData } from 'next/image';
import Breadcrumb from '../organisms/Breadcrumb';
import Input from '@/app/components/atoms/Input';

interface PageHeaderTypes {
  href: string;
  title: string;
  buttonName: string;
  icon: StaticImageData;
  projectName?: string;
  className?: string;
}

const PageHeader = ({
  title,
  icon,
  buttonName,
  href,
  projectName,
  className,
}: PageHeaderTypes) => {
  const isProjectEpics = title === 'Project Epics';
  return (
    <header className={`hidden md:flex justify-between w-full ${className}`}>
      {/* Header */}
      <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
        <div className="flex gap-4">
          <Breadcrumb projectName={projectName} />
        </div>
        <h1 className="display-lg">{title}</h1>
      </div>

      {/* Button */}
      {isProjectEpics ? (
        <div className="flex gap-4 w-full justify-between items-end">
          <div className="w-full relative">
            <Input
              epicStyle="h-15 absolute bottom-0!"
              placeholder="Search Epics..."
            />
          </div>
          <Link href={href}>
            <Button name={buttonName} className="w-55! mt-10 h-15">
              <div className="my-auto">
                <Image src={icon} alt="Member" />
              </div>
            </Button>
          </Link>
        </div>
      ) : (
        <Link href={href}>
          <div className="flex gap-2 px-0!">
            <Button name={buttonName} className="w-55! mt-10 h-15">
              <div className="my-auto">
                <Image src={icon} alt="Member" />
              </div>
            </Button>
          </div>
        </Link>
      )}
    </header>
  );
};

export default PageHeader;
