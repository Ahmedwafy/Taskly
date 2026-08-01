'use client';

import { ReactNode, useState } from 'react';
import SideBar from './Side-Bar';
import Desktop_Header from './Desktop_Header';
import { useSignOut } from '@/app/hooks/auth/useSignOut';
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
  const { mutate: signOut } = useSignOut();

  const fullName = userData?.name ?? '';
  const department = userData?.department ?? '';

  const handleLogout = () => {
    signOut();
  };

  const initialFullName = getInitials(fullName);

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
