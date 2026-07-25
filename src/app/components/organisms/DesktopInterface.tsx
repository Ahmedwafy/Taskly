'use client';

import { ReactNode, useState, useEffect } from 'react';
import SideBar from './Side-Bar';
import Desktop_Header from './Desktop_Header';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/reduxHooks';
import { clearUser, setUser } from '@/features/auth/authSlice';
import { signOutAction } from '@/app/actions/auth';
import { getInitials } from '@/lib/helpers/user';

interface DesktopInterfaceProps {
  userData: {
    name?: string;
    department?: string;
  };
  children: ReactNode;
}

const DesktopInterface = ({ userData, children }: DesktopInterfaceProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [, setLoading] = useState(false);
  const fullName = userData?.name ?? '';
  const department = userData?.department ?? '';
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser(userData));
  }, [dispatch, userData]);

  const handleLogout = async () => {
    setLoading(true);

    // 1. Call the Server Action
    await signOutAction();

    // 2. Clear your client-side global Redux state
    dispatch(clearUser());

    // 3. Clear loading and push the user to the login screen
    setLoading(false);
    router.replace('/login');
  };

  const initialFullName = getInitials(fullName); // "John Doe" >>> "JD"

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="hidden md:block">
        <SideBar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          handleLogout={handleLogout}
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0 w-full transition-all duration-300 ease-in-out bg-background">
        <Desktop_Header
          fullName={fullName}
          department={department}
          avatarText={initialFullName}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          handleLogout={handleLogout}
        />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DesktopInterface;
