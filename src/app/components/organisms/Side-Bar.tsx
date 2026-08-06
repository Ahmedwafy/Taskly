// src → app → components → organisms → Side-Bar.tsx
'use client';
import { useState } from 'react';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import LOGO from '@/../public/svgIcons/LOGO.svg';
import CollapseIcon from '@/../public/svgIcons/Collapse.svg';
import LogoutIcon from '@/../public/svgIcons/Logout.svg';
import ProjectsIcon from '@/../public/svgIcons/Projects.svg';
import StatisticsIcon from '@/../public/svgIcons/Statistics.svg';
import EpicsIcon from '@/../public/svgIcons/Epics.svg';
import TasksIcon from '@/../public/svgIcons/Tasks.svg';
import MembersIcon from '@/../public/svgIcons/Members.svg';
import DetailsIcon from '@/../public/svgIcons/Details.svg';
import { usePathname, useSearchParams } from 'next/navigation';

interface SideBarProps {
  isCollapsed?: boolean;
  mobileIcon?: StaticImageData;

  onItemClick?: () => void;
  handleLogout?: () => void;
  onToggleCollapse?: () => void;
}

const SideBar = ({
  isCollapsed: controlledCollapsed,
  // mobileIcon,
  onItemClick,
  handleLogout,
  onToggleCollapse,
}: SideBarProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isCollapsed =
    typeof controlledCollapsed === 'boolean'
      ? controlledCollapsed
      : internalCollapsed;

  const pathname = usePathname(); // Ex: '/projects/123/epics'
  const searchParams = useSearchParams();

  const isItemActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split('?');

    // exact match for simple paths
    if (!hrefQuery) {
      return pathname === hrefPath;
    }

    // for links with a query string (e.g. Project Tasks board view)
    const hrefParams = new URLSearchParams(hrefQuery);
    const viewParam = hrefParams.get('view');
    return (
      pathname === hrefPath &&
      (viewParam ? searchParams.get('view') === viewParam : true)
    );
  };
  const isProjectDetailsPage = /^\/projects\/[^/]+/.test(pathname);
  // but :
  // When navigating directly to /my-statistics, pathname.split('/')[2] will be undefined.
  // If a user clicks a project link like /projects/undefined/epics, it will break.

  const projectId = pathname.split('/')[2]; // Ex: ['', 'projects', '123', 'epics']

  const navItems = [
    {
      label: 'Projects',
      Icon: ProjectsIcon,
      alt: 'Projects',
      href: '/projects',
    },

    ...(isProjectDetailsPage
      ? [
          {
            label: 'My Statistics',
            Icon: StatisticsIcon,
            alt: 'My Statistics',
            href: `/my-statistics`,
          },
          {
            label: 'Project Epics',
            Icon: EpicsIcon,
            alt: 'Project Epics',
            href: `/projects/${projectId}/epics`,
          },
          {
            label: 'Project Tasks',
            Icon: TasksIcon,
            alt: 'Project Tasks',
            href: `/projects/${projectId}/tasks?view=board`,
          },
          {
            label: 'Project Members',
            Icon: MembersIcon,
            alt: 'Project Members',
            href: `/projects/${projectId}/members`,
          },
          {
            label: 'Project Edit',
            Icon: DetailsIcon,
            alt: 'Project Edit',
            href: `/projects/${projectId}/edit`,
          },
        ]
      : [
          {
            label: 'My Statistics',
            Icon: StatisticsIcon,
            alt: 'My Statistics',
            href: `/my-statistics`,
          },
        ]),
  ];

  const handleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
      return;
    }
    setInternalCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`flex flex-col justify-between bg-surface-low overflow-hidden transition-all duration-500 ease-in-out h-full ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* ○ ○ ○ Mobile close button ○ ○ ○ */}
        <div className="lg:hidden flex items-center justify-end px-3"></div>
        {/* ○ ○ Logo ○ ○ */}
        <div
          className={`w-full flex items-center py-6 mb-10 transition-all duration-500 ease-in-out min-h-20
            ${isCollapsed ? 'justify-center gap-0' : 'justify-start gap-2'}`}
        >
          <div
            className={`transition-all duration-500 ease-in-out  ${
              isCollapsed
                ? 'mx-auto pl-0'
                : 'relative left-4 mr-4 my-auto pl-6 '
            }`}
          >
            <LOGO width={18} height={20} />
          </div>
          <span
            className={`text-[20px] font-bold transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed
                ? 'hidden! transition-all duration-500 ease-in-out'
                : 'max-w-30 opacity-100'
            }`}
          >
            TASKLY
          </span>
        </div>

        {/* ○ ○ ○  Navigation ○ ○ ○  */}
        <div className="flex flex-col gap-1 pl-6 py-6">
          {navItems.map((item) => {
            const Icon = item.Icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onItemClick?.()}
                className={`group list-unit flex items-center gap-3 overflow-hidden rounded-sm py-4 transition-all duration-500 ease-in-out min-w-[90%] mx-auto cursor-pointer hover:pl-4 whitespace-nowrap
        ${
          active
            ? 'bg-white shadow-sm text-neutral-100 pl-4'
            : 'hover:bg-white hover:shadow-sm hover:text-neutral-100'
        }`}
              >
                <div className="shrink-0 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>

                <span
                  className={`text-sm transition-all duration-500 ease-in-out ${
                    isCollapsed
                      ? 'max-w-0 opacity-0 pointer-events-none'
                      : 'max-w-40 opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ○ ○ ○  Collapse & Logout ○ ○ ○  */}
      <div className="flex flex-col gap-4 pl-8 py-6">
        <button
          type="button"
          onClick={handleCollapse}
          className="hidden sm:flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap"
        >
          <CollapseIcon
            className={`transition-transform duration-500 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />

          <span
            className={`text-sm transition-all duration-500 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
            }`}
          >
            Collapse
          </span>
        </button>

        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer overflow-hidden whitespace-nowrap"
          onClick={handleLogout}
        >
          <LogoutIcon className="transition-transform duration-300" />

          <span
            className={`text-sm text-[#BA1A1A] transition-all duration-500 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100'
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
