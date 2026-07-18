// src → app → components → organisms → Side-Bar.tsx
'use client';
import Image from 'next/image';
import * as icons from '../../../../public/icons/icons';
import { useState } from 'react';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LOGO from '@/../public/svgIcons/LOGO.svg';
import CollapseIcon from '@/../public/svgIcons/Collapse.svg';
import LogoutIcon from '@/../public/svgIcons/Logout.svg';

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
  const isProjectDetailsPage = /^\/projects\/[^/]+/.test(pathname);
  const projectId = pathname.split('/')[2]; // Ex: ['', 'projects', '123', 'epics']

  const navItems = [
    {
      label: 'Projects',
      icon: icons.Collapsed_Projects,
      alt: 'Projects',
      href: '/projects',
    },

    ...(isProjectDetailsPage
      ? [
          {
            label: 'Project Epics',
            icon: icons.Epics,
            alt: 'Project Epics',
            href: `/projects/${projectId}/epics`,
          },
          {
            label: 'Project Tasks',
            icon: icons.Tasks,
            alt: 'Project Tasks',
            href: `/projects/${projectId}/tasks?view=board`,
          },
          {
            label: 'Project Members',
            icon: icons.Members,
            alt: 'Project Members',
            href: `/projects/${projectId}/members`,
          },
          {
            label: 'Project Edit',
            icon: icons.Details,
            alt: 'Project Edit',
            href: `/projects/${projectId}/edit`,
          },
        ]
      : []),
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
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onItemClick?.()}
                className="group list-unit flex items-center gap-3 overflow-hidden rounded-sm py-4 transition-all duration-500 ease-in-out min-w-[90%] mx-auto hover:bg-white hover:shadow-sm hover:text-neutral-100 cursor-pointer hover:pl-4 whitespace-nowrap"
              >
                {/* Wrapper to keep image layout stable */}
                <div className="shrink-0">
                  <Image src={item.icon} alt={item.alt} />
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
