// src → app → components → molecules → PageHeader.tsxs
'use client';
import * as icons from '@/../public/icons/icons';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../atoms/Button';
import { StaticImageData } from 'next/image';
import Breadcrumb from '../organisms/Breadcrumb';
import InputField from '../atoms/input';
import SeacrIcon from '@/../public/svgIcons/serachIcon.svg';
import ArrowDown from '@/../public/svgIcons/ArrowDown.svg';
import Squares from '@/../public/svgIcons/Squares.svg';
import Member from '@/../public/svgIcons/Member.svg';

interface PageHeaderTypes {
  href: string;
  title: string;
  description?: string;
  buttonName: string;
  icon: StaticImageData;
  projectName?: string;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  icon,
  buttonName,
  href,
  projectName,
  className,
}: PageHeaderTypes) => {
  const isProjectEpics = title === 'Project Epics';
  const isProjectTasks = title === 'Active Workboard';

  if (isProjectEpics) {
    return (
      <header className={`hidden md:flex justify-between w-full ${className}`}>
        {/* --- Header --- */}
        <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
          <div className="flex gap-4">
            <Breadcrumb projectName={projectName} />
          </div>
          <h1 className="display-lg">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>
        <div className="flex gap-4 w-full justify-between items-end">
          <div className="w-full relative">
            <InputField
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
      </header>
    );
  }

  if (isProjectTasks) {
    return (
      <header className={`hidden md:flex justify-between w-full ${className}`}>
        {/* --- Header --- */}
        <div className="w-1/2 h-fit pt-2 pl-4 flex flex-col gap-2 ">
          <div className="flex gap-4">
            <Breadcrumb projectName={projectName} />
          </div>
          <h1 className="display-lg">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>

        <div className="flex gap-4 w-1/2 justify-between items-end">
          <div className="w-full relative ">
            <InputField
              epicStyle="h-15 absolute bottom-0!"
              placeholder="Search Tasks..."
            />
          </div>

          <button className="flex justify-center gap-4 items-center w-1/2 h-15 bg-white rounded-md shadow-sm">
            <Squares />
            Board View
            <ArrowDown />
          </button>

          <button className="bg-[#D7E2FF] h-15 px-8 rounded-md">
            <SeacrIcon className="h-6 w-6" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className={`hidden md:flex justify-between w-full ${className}`}>
      {/* --- Header --- */}
      <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
        <div className="flex gap-4">
          <Breadcrumb projectName={projectName} />
        </div>
        <h1 className="display-lg">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>

      <Link href={href}>
        <Button name={buttonName} className="w-55! mt-10 h-15">
          <Member className="h-6 w-6 my-auto" />
        </Button>
      </Link>
    </header>
  );
};

export default PageHeader;
