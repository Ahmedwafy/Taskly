// src > app > components > molecules > PageHeader.tsxs
'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../atoms/Button';
import Breadcrumb from '../organisms/Breadcrumb';
import InputField from '../atoms/input';
import SearchIcon from '@/../public/svgIcons/serachIcon.svg';
import InviteMember from '@/../public/svgIcons/InviteMember.svg';
import TasksViewSelection from '../atoms/TasksViewSelection';
import { StaticImageData } from 'next/image';
import { TASKS_VIEW_OPTIONS } from '@/lib/enums';
import { ReactNode } from 'react';

interface PageHeaderTypes {
  href: string;
  title: string;
  description?: string;
  buttonName: string;
  icon?: StaticImageData;
  projectName?: string;
  className?: string;
  SVGicon?: ReactNode;
  currentValue?: string;
  needSearchIcon?: string;
  handleViewChange?: (newValue: string) => void;
  // --- ADDED SEARCH PROPS ---
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  isSearching?: boolean;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
}

const PageHeader = ({
  title,
  description,
  icon,
  buttonName,
  href,
  projectName,
  className,
  currentValue,
  handleViewChange,
  SVGicon,
  searchValue,
  onSearchChange,
  isSearching,
  searchQuery,
  setSearchQuery,
}: PageHeaderTypes) => {
  const isProjectEpics = title === 'Project Epics';
  const isProjectTasks = title === 'Active Workboard';
  const isProjectMembers = title === 'Project Members';
  const isEditProjects = title === 'Edit Projects';

  if (isProjectEpics) {
    return (
      <>
        {/* ==== Desktop View ==== */}
        <header
          className={`hidden lg:flex justify-between w-full ${className}`}
        >
          <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
            <div className="flex gap-4">
              <Breadcrumb projectName={projectName} />
            </div>
            <h1 className="title-style">{title}</h1>
            {description && <p className="text-gray-500">{description}</p>}
          </div>

          <div className="flex gap-4 w-full justify-between items-end">
            <div className="w-full relative">
              <InputField
                epicStyle="h-15"
                placeholder="Search Epics..."
                variant="search"
                value={searchValue} // <-- Value prop
                onChange={(e) => onSearchChange?.(e.target.value)} // <-- Search change handler > Update search local state
              />
              {isSearching && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
                  Searching...
                </span>
              )}
            </div>

            <Link href={href}>
              <Button name={buttonName} className="w-55! mt-10 h-15">
                <div className="my-auto">
                  {icon && <Image src={icon} alt="Member" />}
                </div>
              </Button>
            </Link>
          </div>
        </header>

        {/* ==== Mobile View ==== */}
        <div className="lg:hidden mt-20 relative">
          <InputField
            epicStyle="h-15"
            placeholder="Search Epics..."
            variant="search"
            value={searchValue} // <-- Value prop
            onChange={(e) => onSearchChange?.(e.target.value)} // <-- Search change handler
          />
          {isSearching && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
              Searching...
            </span>
          )}
        </div>
      </>
    );
  }

  if (isProjectTasks) {
    return (
      <header className={`hidden md:flex justify-between ${className}`}>
        <div className="w-1/2 h-fit pt-2 pl-4 flex flex-col gap-2 ">
          <div className="flex gap-4">
            <Breadcrumb projectName={projectName} />
          </div>
          <h1 className="title-style">{title}</h1>
          {description && <p className="title-desc-style">{description}</p>}
        </div>

        <div className="flex gap-2 items-end justify-end w-full">
          <div className="w-1/2 relative">
            <InputField
              tasksStyle="h-15"
              variant="search"
              placeholder="Search Tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
            {isSearching && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
                Searching...
              </span>
            )}
          </div>

          <div className="h-15 relative flex items-center bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition">
            <TasksViewSelection
              currentValue={currentValue || ''}
              handleViewChange={handleViewChange ? handleViewChange : () => {}}
              options={TASKS_VIEW_OPTIONS.map((view) => ({
                value: view,
                label: view.replace(/_/g, ' '),
              }))}
            />
          </div>

          <button className="bg-[#D7E2FF] rounded-md w-12 h-12 flex items-center justify-center mb-2">
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </header>
    );
  }

  if (isProjectMembers) {
    return (
      <header className={`hidden sm:flex justify-between w-full ${className}`}>
        {/* --- Header --- */}
        <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
          <div className="flex gap-4">
            <Breadcrumb projectName={projectName} />
          </div>
          <h1 className="title-style">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
        </div>

        <Link href={href}>
          <Button name={buttonName} className="w-60! mt-10 h-15">
            <InviteMember className="scale-120" />
          </Button>
        </Link>
      </header>
    );
  }

  if (isEditProjects) {
    return (
      <header className={`hidden md:flex justify-between w-full ${className}`}>
        {/* --- Header --- */}
        <div className="w-full h-fit pt-2 pl-4 flex flex-col gap-2">
          <div className="flex gap-4">
            <Breadcrumb projectName={projectName} />
          </div>
          <h1 className="title-style">{title}</h1>
          {description && <p className="text-gray-500">{description}</p>}
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
        <h1 className="title-style">{title}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>

      <Link href={href}>
        <Button name={buttonName} className="w-60! mt-10 h-15">
          {SVGicon && SVGicon}
        </Button>
      </Link>
    </header>
  );
};

export default PageHeader;
