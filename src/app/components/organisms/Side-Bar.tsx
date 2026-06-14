'use client';
import Image from 'next/image';
import * as icons from '../../../../public/icons/icons';
import { useState } from 'react';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAppDispatch } from '@/redux/reduxHooks';
// import { clearUser } from '@/features/auth/authSlice';
// import { signOut } from '@/services/auth';
// import { toast } from 'sonner';

// type SidebarItemProps = {
//   title: string;
//   icon: StaticImageData;
//   mobileIcon: StaticImageData;
// };

interface SideBarProps {
  onItemClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  handleLogout?: () => void;
  mobileIcon?: StaticImageData;
}

const SideBar = ({
  onItemClick,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
  mobileIcon,
  handleLogout,
}: SideBarProps) => {
  // const [loading, setLoading] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isCollapsed =
    typeof controlledCollapsed === 'boolean'
      ? controlledCollapsed
      : internalCollapsed;

  // const router = useRouter();
  // const dispatch = useAppDispatch();
  const navItems = [
    {
      label: 'Projects',
      icon: mobileIcon ? mobileIcon : icons.Projects,
      alt: 'Projects',
      href: '/projects',
    },
    {
      label: 'Project Epic',
      icon: icons.Epics,
      alt: 'Project Epics',
      href: '/projects',
    },
    {
      label: 'Project Tasks',
      icon: icons.Tasks,
      alt: 'Project Tasks',
      href: '/projects',
    },
    {
      label: 'Project Members',
      icon: icons.Members,
      alt: 'Project Members',
      href: '/projects',
    },
    {
      label: 'Project Details',
      icon: icons.Details,
      alt: 'Project Details',
      href: '/projects',
    },
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
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-end px-3"></div>
        {/* Logo */}
        <div
          className={`w-full flex items-center py-6 mb-10 transition-all duration-500 ease-in-out ${
            isCollapsed ? 'justify-center gap-0' : 'justify-start gap-2'
          }`}
        >
          <div
            className={`transition-all duration-500 ease-in-out ${
              isCollapsed ? 'mx-auto' : 'relative left-4 mr-4 my-auto'
            }`}
          >
            <Image src={icons.Logo} alt="Logo" width={18} height={20} />
          </div>
          <span
            className={`text-[20px] font-bold transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap ${
              isCollapsed ? 'hidden' : 'max-w-30 opacity-100'
            }`}
          >
            TASKLY
          </span>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2 px-2">
          {navItems.map((item) => {
            return (
              <button
                key={item.label}
                onClick={() => onItemClick?.()}
                className={`group list-unit flex items-center gap-3 overflow-hidden rounded-sm py-4 transition-all duration-500 ease-in-out ${
                  isCollapsed ? 'px-3 justify-center' : 'px-4 justify-start'
                } min-w-[90%] mx-auto hover:bg-white hover:shadow-sm hover:text-neutral-100 cursor-pointer`}
              >
                <div>
                  <Image
                    src={item.icon}
                    alt={item.alt}
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <Link href={item.href}>
                  <span
                    className={`block overflow-hidden whitespace-nowrap text-sm transition-all duration-500 ease-in-out ${
                      isCollapsed
                        ? 'max-w-0 opacity-0 scale-95'
                        : 'max-w-40 opacity-100 scale-100'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapse & Logout */}
      <div className="flex flex-col gap-4 pl-8 py-6">
        <button
          type="button"
          onClick={handleCollapse}
          className="hidden sm:flex items-center gap-3 cursor-pointer"
        >
          <Image
            src={icons.Collapse}
            alt="Collapse"
            className={`transition-transform duration-400 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />

          {!isCollapsed && <span>Collapse</span>}
        </button>

        <button
          type="button"
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleLogout}
          // onClick={async () => {
          //   try {
          //     setLoading(true);
          //     await signOut(); // signOut() -> Delete access_token From Cookies
          //     dispatch(clearUser()); // -> Update User State in Store/Slice -- clear frontend state --
          //     // router.push('/login');
          //     router.replace('/login');
          //     setLoading(false);
          //   } catch (err) {
          //     console.error('Logout failed', err);
          //     toast.error('Logout failed');
          //   }
          // }}
        >
          <Image
            src={icons.Logout}
            alt="Logout"
            className={`transition-transform duration-300`}
          />

          {!isCollapsed && <span className="text-[#BA1A1A]">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
