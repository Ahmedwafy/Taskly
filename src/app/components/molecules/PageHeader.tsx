// src → app → components → molecules → PageHeader.tsxs
'use client';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../atoms/Button';
import { StaticImageData } from 'next/image';
import Breadcrumb from '../organisms/Breadcrumb';
import InputField from '../atoms/input';
import SearchIcon from '@/../public/svgIcons/serachIcon.svg';
// import ArrowDown from '@/../public/svgIcons/ArrowDown.svg';
// import Squares from '@/../public/svgIcons/Squares.svg';
// import TasksListIcon from '@/../public/svgIcons/TasksListIcon.svg';
import Member from '@/../public/svgIcons/Member.svg';
// import SelectField from '../atoms/SelectField';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { TASKS_VIEW_OPTIONS } from '@/lib/enums';
import TasksViewSelection from '../atoms/TasksViewSelection';

interface PageHeaderTypes {
  href: string;
  title: string;
  description?: string;
  buttonName: string;
  icon: StaticImageData;
  projectName?: string;
  className?: string;
  currentValue?: string;
  handleViewChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
}: PageHeaderTypes) => {
  const isProjectEpics = title === 'Project Epics';
  const isProjectTasks = title === 'Active Workboard';
  // const router = useRouter();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();

  // === Handle Add Query Params To URL === [Start] ===
  // const currentValue =
  //   searchParams.get('view')?.toUpperCase() === 'LIST'
  //     ? 'LIST_VIEW'
  //     : 'BOARD_VIEW';

  // const handleViewChange = (newValue: string) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set('view', newValue.toLowerCase().replace('_view', ''));
  //   router.push(`${pathname}?${params.toString()}`); // view=board OR view=list
  // };
  // === Handle Add Query Params To URL === [End] ===

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

          <div className="relative flex justify-center gap-4 items-center w-1/2 h-15 bg-white rounded-md shadow-sm border border-gray-200 px-4 hover:bg-gray-50 transition">
            <TasksViewSelection
              currentValue={currentValue || ''}
              handleViewChange={handleViewChange ? handleViewChange : () => {}}
              // handleViewChange={handleViewChange ? handleViewChange : ''}
              options={TASKS_VIEW_OPTIONS.map((view) => ({
                value: view,
                label: view.replace(/_/g, ' '),
              }))}
            />
          </div>

          <button className="bg-[#D7E2FF] h-15 px-8 rounded-md">
            <SearchIcon className="h-6 w-6" />
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
