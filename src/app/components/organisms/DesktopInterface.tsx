'use client';

import { ReactNode, useState, useEffect } from 'react';
import SideBar from './Side-Bar';
import Desktop_Header from './Desktop_Header';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/reduxHooks';
import { clearUser, setUser } from '@/features/auth/authSlice';
import { signOut } from '@/services/auth';
import { toast } from 'sonner';

interface DesktopInterfaceProps {
  userData: {
    user_metadata?: { name?: string; department?: string };
  };
  children: ReactNode;
}

const DesktopInterface = ({ userData, children }: DesktopInterfaceProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const fullName = userData?.user_metadata?.name ?? '';
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Added a client-side state synchronization using useEffect to dispatch setUser(userData) on mount.
  useEffect(() => {
    dispatch(setUser(userData));
  }, [dispatch, userData]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      dispatch(clearUser());
      router.replace('/login');
      setLoading(false);
    } catch (error) {
      console.error('Logout failed', error);
      toast.error('Logout failed');
    }
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
          department={userData?.user_metadata?.department}
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
