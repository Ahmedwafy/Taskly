'use client';

import { ReactNode, useState, useEffect } from 'react';
import SideBar from './Side-Bar';
import Desktop_Header from './Desktop_Header';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/reduxHooks';
import { clearUser, setUser } from '@/features/auth/authSlice';
import { signOutAction } from '@/app/actions/auth';

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

  // Added a client-side state synchronization using useEffect to dispatch setUser(userData) on mount.
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

  return (
    <div className="flex h-screen">
      <div className="hidden md:block">
        <SideBar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          handleLogout={handleLogout}
        />
      </div>

      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
        <Desktop_Header
          fullName={fullName}
          department={department}
          avatarText={fullName
            .trim()
            .split(/\s+/)
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
          handleLogout={handleLogout}
        />

        <main
          className={`flex-1 overflow-auto transition-all duration-300`}
          // style={{ paddingLeft: isCollapsed ? '5rem' : '16rem' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DesktopInterface;
